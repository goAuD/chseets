/**
 * Content Filter Module for chseets
 * Detects prohibited content in titles, descriptions, and filenames
 */

// Prohibited word categories
const PROHIBITED_WORDS = {
    adult: ['porn', 'xxx', 'nsfw', 'nude', 'naked', 'sex', 'hentai', 'erotic', 'adult only', 'onlyfans', 'fansly'],
    violence: ['gore', 'murder', 'kill', 'torture', 'decapitat', 'dismember', 'execution', 'snuff'],
    drugs: ['cocaine', 'heroin', 'meth', 'fentanyl', 'drug deal', 'buy drugs'],
    weapons: ['bomb making', 'how to make bomb', 'weapon blueprint', 'gun blueprint'],
    hate: ['nazi', 'white power', 'race war', 'ethnic cleansing', 'genocide'],
    hacking: ['crack password', 'hack account', 'ddos attack', 'ransomware', 'malware download'],
    piracy: ['crack download', 'keygen', 'serial key', 'warez', 'pirated']
};

// Flatten all prohibited words
const ALL_PROHIBITED = Object.values(PROHIBITED_WORDS).flat();

/**
 * Check if text contains prohibited content
 * @param {string} text - Text to check
 * @returns {object} - {isValid: boolean, reason?: string, category?: string}
 */
export function validateContent(text) {
    if (!text || typeof text !== 'string') {
        return { isValid: true };
    }

    const normalized = text.toLowerCase().trim();

    for (const [category, words] of Object.entries(PROHIBITED_WORDS)) {
        for (const word of words) {
            if (normalized.includes(word.toLowerCase())) {
                return {
                    isValid: false,
                    reason: `Content contains prohibited term: "${word}"`,
                    category: category
                };
            }
        }
    }

    return { isValid: true };
}

/**
 * Validate a file before upload
 * @param {File} file - File to validate
 * @param {string} title - Optional title
 * @param {string} description - Optional description
 * @returns {object} - {isValid: boolean, errors: string[]}
 */
export function validateUpload(file, title = '', description = '') {
    const errors = [];

    // Check filename
    const filenameCheck = validateContent(file.name);
    if (!filenameCheck.isValid) {
        errors.push(`Filename: ${filenameCheck.reason}`);
    }

    // Check title
    if (title) {
        const titleCheck = validateContent(title);
        if (!titleCheck.isValid) {
            errors.push(`Title: ${titleCheck.reason}`);
        }
    }

    // Check description
    if (description) {
        const descCheck = validateContent(description);
        if (!descCheck.isValid) {
            errors.push(`Description: ${descCheck.reason}`);
        }
    }

    // Check file type (only allow safe types)
    const allowedTypes = [
        'application/pdf',
        'image/png',
        'image/jpeg',
        'image/webp',
        'image/gif'
    ];

    if (!allowedTypes.includes(file.type)) {
        errors.push(`File type "${file.type}" is not allowed. Only PDF and images are accepted.`);
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
        errors.push(`File is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum is 10MB.`);
    }

    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

/**
 * Report content to the system
 * @param {string} sheetId - ID of the sheet to report
 * @param {string} reason - Reason for reporting
 * @param {object} supabase - Supabase client
 */
export async function reportContent(sheetId, reason, supabase) {
    const { data: { user } } = await supabase.auth.getUser();

    const report = {
        sheet_id: sheetId,
        reason: reason,
        reporter_id: user?.id || null,
        reporter_email: user?.email || 'anonymous',
        created_at: new Date().toISOString(),
        status: 'pending'
    };

    // Try to insert into reports table (if exists)
    // For now, send email notification instead
    try {
        const { error } = await supabase
            .from('reports')
            .insert([report]);

        if (error) {
            console.warn('Reports table may not exist yet:', error);
            // Fallback: log to console for now
            console.log('CONTENT REPORT:', report);
        }
    } catch (err) {
        console.warn('Report submission error:', err);
    }

    return true;
}

export default {
    validateContent,
    validateUpload,
    reportContent,
    PROHIBITED_WORDS
};
