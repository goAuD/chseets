// /assets/js/app.js
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { CyberModal } from "/assets/js/modal.js";
import { validateUpload, reportContent } from "/assets/js/content-filter.js";
const PDFJS_CDN = "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.min.mjs";

/* ---------------- Supabase ---------------- */
const SUPABASE_URL = "https://zpvqcjrtsbznaaphjhug.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwdnFjanJ0c2J6bmFhcGhqaHVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MjM3MDcsImV4cCI6MjA3NjE5OTcwN30.pICNfmmQTvXz-TcLHTFI5EaXWtVV_DUGK7wjufVFjuc";
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

/* ---------------- DOM ---------------- */
const elSignin = document.querySelector('[data-action="signin"]');
const elSignout = document.querySelector('[data-action="signout"]');
const elsUser = document.querySelectorAll('[data-slot="user"]');
const elUploadForm = document.querySelector('#upload-form');
const elDropzone = document.getElementById('dropzone');
const elMyFiles = document.querySelector('#my-files');     // profil lista
const elDlList = document.querySelector('#dl-list');      // nyitóoldali "downloads"
const elSheetsList = document.querySelector('#sheets-list');  // /sheets/ galéria

/* ---------------- Burger Menu Toggle ---------------- */
document.addEventListener('DOMContentLoaded', () => {
  const burger = document.querySelector('.burger');
  const navMenu = document.getElementById('nav-menu');

  if (burger && navMenu) {
    burger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking links
    navMenu.querySelectorAll('a:not([data-action])').forEach(link => {
      link.addEventListener('click', () => navMenu.classList.remove('active'));
    });
  }
});

/* ---------------- Helpers ---------------- */
const human = (n) => { if (n == null) return ''; const u = ['B', 'KB', 'MB', 'GB']; let i = 0; while (n > 1024 && i < u.length - 1) { n /= 1024; i++; } return `${n.toFixed(1)} ${u[i]}`; };
const prettyName = (name) => name.replace(/^\d{10,}[_\-]/, ''); // levágja a timestamp_ részt
const slugify = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 80);

/* ---------------- User UI ---------------- */
async function renderUser(user) {
  if (user) {
    // Fetch username from profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .single();

    const displayName = profile?.username || user.email.split('@')[0];
    elsUser.forEach(el => {
      el.textContent = displayName;
      el.style.cursor = 'pointer';
      el.title = 'Click to edit username';
    });
  } else {
    elsUser.forEach(el => {
      el.textContent = "Guest";
      el.style.cursor = 'default';
      el.title = '';
    });
  }

  if (elSignin) elSignin.style.display = user ? "none" : "inline-flex";
  if (elSignout) elSignout.style.display = user ? "inline-flex" : "none";

  // Show/hide account management section (Danger Zone)
  const elAccountMgmt = document.getElementById('account-management');
  if (elAccountMgmt) elAccountMgmt.style.display = user ? "block" : "none";
}

// Username edit on click
document.addEventListener('click', async (e) => {
  const userSlot = e.target.closest('[data-slot="user"]');
  if (!userSlot) return;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return; // Only logged in users can edit

  const currentName = userSlot.textContent;
  const newName = prompt('Enter new username:', currentName);

  if (!newName || newName === currentName) return;

  try {
    const { error } = await supabase
      .from('profiles')
      .update({ username: newName.trim() })
      .eq('id', user.id);

    if (error) throw error;

    // Update all user slots
    document.querySelectorAll('[data-slot="user"]').forEach(el => {
      el.textContent = newName.trim();
    });

    alert('Username updated! ✅');
  } catch (err) {
    alert('Failed to update username: ' + err.message);
  }
});
async function initSession() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user ?? null;
    renderUser(user);
    if (user) listMyFiles(user);
  } catch (err) {
    console.error('Session init error:', err);
  }
}
async function updateSession() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    renderUser(user ?? null);
    if (user) listMyFiles(user);
  } catch (err) {
    console.error('Update session error:', err);
    renderUser(null);
  }
}
initSession();

/* ---------------- Global delete sync (event + cross-tab) ---------------- */
// 1) Oldal-közti esemény: bármely oldalról triggerelhető
window.addEventListener('sheet:deleted', (e) => {
  const { path, fileName } = e.detail || {};

  // Távolíts el kártyákat attribútum alapján
  if (path) {
    document.querySelectorAll(`[data-path="${path}"]`).forEach(n => n.remove());
  }
  if (fileName) {
    const clean = fileName.replace(/^\d{10,}[_\-]/, '');
    document.querySelectorAll(`[data-name="${clean}"]`).forEach(n => n.remove());
  }

  // Listák újratöltése, ha jelen vannak
  // Listák frissítése (de ne töltsük újra, ha csak a sajátunkat töröltük - a DOM removal már megtörtént)
  // A 'storage' event majd frissít más tabokat. Helyben elég a DOM remove.
  // Kivétel: ha Public lista van (dl-list), azt frissíteni kellhet.
  if (document.querySelector('#dl-list')) {
    listPublic();
  }
  if (document.querySelector('#sheets-list')) {
    // A sheets-list (galéria) teljes újratöltése esetleg visszahozhatja, ha a DB még nem konzisztens.
    // Hagyjuk a DOM törlést érvényesülni, csak késleltetve frissítsünk ha nagyon muszáj.
    // Most inkább kivesszük az automatikus újratöltést helyi törlésnél.
  }
});

// 2) Cross-tab sync a localStorage 'storage' eventtel
window.addEventListener('storage', (e) => {
  if (e.key === 'sheet:deleted') {
    // minden releváns lista frissítése
    if (typeof listPublic === 'function') listPublic();
    supabase.auth.getUser().then(({ data: { user } }) => { if (user) listMyFiles(user); });
    if (typeof listSheets === 'function') listSheets();
  }
});

/* ---------------- My files (profile) ---------------- */
async function listMyFiles(user) {
  if (!elMyFiles) return;
  try {
    const prefix = `uploads/${user.id}`;
    const { data, error } = await supabase.storage.from('sheets').list(prefix, { limit: 200 });
    if (error) throw error;

    if (!data?.length) { elMyFiles.innerHTML = `<div class="small">No files yet.</div>`; return; }

    elMyFiles.innerHTML = data.map(f => {
      const clean = prettyName(f.name);
      const { data: pub } = supabase.storage.from('sheets').getPublicUrl(`${prefix}/${f.name}`);
      const path = `${prefix}/${f.name}`;
      const when = new Date(f.updated_at || Date.now()).toLocaleString();
      const size = human(f.metadata?.size ?? f.size);
      return `
        <div class="card-file" data-path="${path}" data-name="${clean}">
          <div class="content">
            <div class="row">
              <div class="name" title="${clean}">${clean}</div>
            </div>
            <div>
              <div class="meta">${size} • ${when}</div>
              <div class="actions" style="margin-top:6px">
                <a class="btn-sm" target="_blank" href="${pub.publicUrl}">Open</a>
                <button class="btn-sm" data-action="make-public">Make Public</button>
                <button class="btn-sm" data-action="delete-file">Delete</button>
              </div>
            </div>
          </div>
        </div>`;
    }).join('');
  } catch (err) {
    elMyFiles.innerHTML = `<div class="small">Error: ${err.message}</div>`;
  }
}

/* ---------------- Public downloads (nyitóoldal) ---------------- */
async function listPublic() {
  if (!elDlList) return;
  try {
    const { data, error } = await supabase.storage.from('sheets').list('public', { limit: 500 });
    if (error) { elDlList.innerHTML = `<li class="small">Error: ${error.message}</li>`; return; }

    // Filter out previews folder and .emptyFolderPlaceholder
    const files = (data || []).filter(f =>
      f.name !== 'previews' &&
      !f.name.startsWith('.') &&
      f.id // Only actual files have an id
    );

    elDlList.innerHTML = (files.length ? files.map(f => {
      const { data: pub } = supabase.storage.from('sheets').getPublicUrl(`public/${f.name}`);
      return `<li><a target="_blank" href="${pub.publicUrl}">${f.name}</a> <span class="small">(${human(f.size)})</span></li>`;
    }).join('') : '<li class="small">No downloads yet.</li>');
  } catch (err) {
    elDlList.innerHTML = `<li class="small">Error: ${err.message}</li>`;
  }
}
listPublic();

/* ---------------- /sheets/ oldal: csak publikált + preview ---------------- */
async function listSheets() {
  if (!elSheetsList) return;
  try {
    const { data, error } = await supabase
      .from('sheets_meta')
      .select('id, title, slug, storage_path, preview_path, created_at')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(200);

    if (error) throw error;
    if (!data?.length) {
      elSheetsList.innerHTML = `<div class="small">No sheets yet.</div>`;
      return;
    }

    elSheetsList.innerHTML = data.map(row => {
      const title = row.title;
      const url = `/sheets/${row.slug}`;
      let preview = '';
      if (row.preview_path) {
        const { data: pubPrev } = supabase.storage.from('sheets').getPublicUrl(row.preview_path);
        preview = pubPrev?.publicUrl || '';
      }
      return `
        <div class="card-file preview" data-storage="${row.storage_path}" data-slug="${row.slug}" data-id="${row.id}">
          <a class="thumb" href="${url}" target="_blank" rel="noopener">
            ${preview ? `<img src="${preview}" alt="${title}">` : `<div class="no-thumb">No preview</div>`}
          </a>
          <div class="content">
            <div class="name"><a href="${url}" target="_blank" rel="noopener">${title}</a></div>
            <button class="btn btn-small btn-danger" data-action="report" data-sheet-id="${row.id}" data-sheet-title="${title}" title="Report inappropriate content">⚠️ Report</button>
          </div>
        </div>
      `;
    }).join('');
  } catch (err) {
    elSheetsList.innerHTML = `<div class="small">Error: ${err.message}</div>`;
  }
}
if (elSheetsList) listSheets();

/* ---------------- Make Public: copy -> preview -> meta insert ---------------- */
async function makePublic(path, cleanName) {
  // 1) másolat a public/ alá
  const fileName = cleanName || path.split('/').pop();
  const publicPath = `public/${fileName}`;

  // Download from private, upload to public (upsert allows overwriting)
  const { data: fileBlob, error: dlErr } = await supabase.storage.from('sheets').download(path);
  if (dlErr) throw dlErr;


  const { data: upData, error: upErr } = await supabase.storage.from('sheets').upload(publicPath, fileBlob, {
    upsert: true,
    contentType: fileBlob.type || 'application/octet-stream'
  });

  if (upErr) throw upErr;

  // 2) preview készítése (kép => saját fájl; PDF => első oldal PNG)
  const ext = fileName.split('.').pop().toLowerCase();
  let previewPath = null;
  if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'avif'].includes(ext)) {
    previewPath = publicPath;
  } else if (ext === 'pdf') {
    try {
      const slug = slugify(fileName.replace(/\.[^.]+$/, ''));
      const { data: blobData, error: dlErr } =
        await supabase.storage.from('sheets').download(publicPath);
      if (dlErr) throw dlErr;
      const previewBlob = await renderPdfFirstPageToPng(blobData);
      const upPath = `public/previews/${slug}.png`;
      const { error: upErr } =
        await supabase.storage.from('sheets').upload(upPath, previewBlob, { upsert: true, contentType: 'image/png' });
      if (!upErr) previewPath = upPath;
    } catch (e) {
      console.warn('PDF preview generation failed:', e);
    }
  }

  // 3) meta upsert (to handle duplicates)
  const { data: { user } } = await supabase.auth.getUser();
  const slug = slugify(fileName.replace(/\.[^.]+$/, ''));
  const row = {
    user_id: user?.id ?? null,
    slug: slug,
    title: fileName.replace(/\.[^.]+$/, ''),
    description: '',
    tags: [],
    lang: 'en',
    storage_path: publicPath,
    preview_path: previewPath,
    published: true
  };


  const { data: upsertData, error: metaErr } = await supabase.from('sheets_meta')
    .upsert(row, { onConflict: 'slug', ignoreDuplicates: false })
    .select();

  if (metaErr) throw metaErr;
}

/* ------------ PDF első oldal -> PNG Blob (preview) ------------ */
async function renderPdfFirstPageToPng(inputBlob) {
  const pdfjs = await import(PDFJS_CDN);
  if (!pdfjs.GlobalWorkerOptions?.workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs`;
  }
  const url = URL.createObjectURL(inputBlob);
  try {
    const pdf = await pdfjs.getDocument(url).promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1 });
    const targetW = 600;
    const scale = targetW / viewport.width;
    const vp = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(vp.width);
    canvas.height = Math.round(vp.height);
    const ctx = canvas.getContext('2d', { alpha: false });

    await page.render({ canvasContext: ctx, viewport: vp }).promise;
    const blob = await new Promise(res => canvas.toBlob(res, 'image/png', 0.92));
    return blob;
  } finally {
    URL.revokeObjectURL(url);
  }
}

/* ---------------- Upload helpers ---------------- */
async function uploadFile(file) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) { alert("Sign in first."); return { error: new Error("Not signed in") }; }

  // Content filter validation
  const validation = validateUpload(file);
  if (!validation.isValid) {
    const errorMsg = "Upload blocked:\n" + validation.errors.join("\n");
    alert(errorMsg);
    return { error: new Error(validation.errors[0]) };
  }

  const safe = file.name.replace(/\s+/g, '_');
  const path = `uploads/${user.id}/${Date.now()}_${safe}`;
  return await supabase.storage.from('sheets').upload(path, file, { upsert: false, contentType: file.type || undefined });
}
elUploadForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const files = Array.from(e.target.elements.file.files || []);
  if (!files.length) return;

  // Pre-validate all files
  for (const f of files) {
    const validation = validateUpload(f);
    if (!validation.isValid) {
      alert(`Cannot upload "${f.name}":\n${validation.errors.join("\n")}`);
      return;
    }
  }

  for (const f of files) {
    const { error } = await uploadFile(f);
    if (error) { alert(`Failed: ${f.name} — ${error.message}`); return; }
  }
  alert(`Uploaded ${files.length} file(s).`);
  const { data: { user } } = await supabase.auth.getUser();
  if (user) listMyFiles(user);
});

/* ---------------- Drag & drop ---------------- */
if (elDropzone) {
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evt =>
    elDropzone.addEventListener(evt, e => { e.preventDefault(); e.stopPropagation(); })
  );
  ['dragenter', 'dragover'].forEach(() => elDropzone.classList.add('is-drag'));
  ['dragleave', 'drop'].forEach(() => elDropzone.classList.remove('is-drag'));
  elDropzone.addEventListener('drop', async (e) => {
    const files = Array.from(e.dataTransfer.files || []);
    if (!files.length) return;
    for (const f of files) {
      const { error } = await uploadFile(f);
      if (error) { alert(`Failed: ${f.name} — ${error.message}`); return; }
    }
    alert(`Uploaded ${files.length} file(s).`);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) listMyFiles(user);
  });
}

/* ---------------- Click handlers ---------------- */
document.addEventListener('click', async (e) => {
  // Delete
  const del = e.target.closest('[data-action="delete-file"]');
  if (del) {
    const card = del.closest('[data-path]'); if (!card) return;
    const path = card.getAttribute('data-path');
    const cleanName = card.getAttribute('data-name'); // Use clean name like makePublic does!
    if (!confirm(`Delete this file?\n${path}`)) return;

    const fileName = cleanName || path.split('/').pop(); // Prefer clean name
    const publicPath = `public/${fileName}`;
    const slug = fileName.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const previewPath = `public/previews/${slug}.png`;


    // 1) Storage: fő fájl törlése
    try {
      const { data: removeData, error: storageErr } = await supabase.storage.from('sheets').remove([path]);
      if (storageErr) {
        alert(`Delete failed: ${storageErr.message}`);
        return;
      }
    } catch (err) {
      console.error('Unexpected storage remove error:', err);
      alert('Delete failed (storage error). Check console.');
      return;
    }

    // 2) DB meta: publik meta sor törlése (ha volt publish)
    try {
      const { data: delData, error: dbErr } = await supabase.from('sheets_meta')
        .delete()
        .eq('storage_path', publicPath)
        .select();
      if (dbErr) {
        console.warn('DB delete error:', dbErr);
        alert('Warning: metadata removal failed. Admins should check the database.');
      }
    } catch (err) {
      console.error('Unexpected DB delete failure:', err);
    }

    // 3) Public copy törlése (ha volt publish)
    try {
      const { error: publicErr } = await supabase.storage.from('sheets').remove([publicPath]);
      if (publicErr && !publicErr.message?.toLowerCase().includes('not found')) {
        console.warn('Public file remove error:', publicErr);
      }
    } catch (err) {
      console.error('Public file remove error:', err);
    }

    // 4) Preview törlés (best-effort)
    try {
      const { error: previewErr } = await supabase.storage.from('sheets').remove([previewPath]);
      if (previewErr && previewErr.message?.toLowerCase().includes('object not found') === false) {
        console.warn('Preview remove error:', previewErr);
      }
    } catch (err) {
      console.error('Unexpected preview remove error:', err);
    }

    // 4) Globális esemény + cross-tab jelzés
    try {
      const deleteEvent = new CustomEvent('sheet:deleted', {
        detail: { path, publicPath, fileName, previewPath }
      });
      window.dispatchEvent(deleteEvent);
      try { localStorage.setItem('sheet:deleted', JSON.stringify({ path, ts: Date.now() })); }
      catch (e) { console.warn('localStorage set failed', e); }
    } finally {
      // 5) Helyi kártya eltávolítása (azonnali UX)
      card.remove();
      alert('✅ Deleted successfully!');
    }
    return;
  }

  // Make Public
  const pub = e.target.closest('[data-action="make-public"]');
  if (pub) {
    const card = pub.closest('[data-path]'); if (!card) return;
    const path = card.getAttribute('data-path');
    const clean = card.getAttribute('data-name');
    try {
      await makePublic(path, clean);
      alert('Published to /sheets (public).');
      // opcionálisan /sheets/ frissítés
      if (elSheetsList) listSheets();
    } catch (err) {
      alert(`Publish failed: ${err.message}`);
    }
    return;
  }

  // Auth
  const t = e.target.closest('[data-action]');
  if (!t) return;
  const act = t.getAttribute('data-action');
  if (act === 'signin') {
    const email = prompt("Enter your email for a magic link:");
    if (!email) return;
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${location.origin}/profile/` }
      });
      if (error) throw error;
      await CyberModal.alert('Magic link sent! Check your inbox and click the link to sign in.', 'Email Sent');
    } catch (err) {
      await CyberModal.alert(`Sign in failed: ${err.message}`, 'Error');
    }
  }
  if (act === 'signout') {
    try {
      await supabase.auth.signOut();
      await updateSession();
    } catch (err) {
      console.error('Sign out error:', err);
    }
  }

  // Delete Account
  if (act === 'delete-account') {
    const confirmed = await CyberModal.danger(
      'This will permanently delete all your uploaded files, published sheets, and profile data. This action CANNOT be undone!',
      'Delete Account'
    );
    if (!confirmed) return;

    const typedValue = await CyberModal.prompt(
      'Type "DELETE" to confirm account deletion:',
      'Final Confirmation'
    );
    if (typedValue !== 'DELETE') {
      await CyberModal.alert('Account deletion cancelled.', 'Cancelled');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        await CyberModal.alert('You must be signed in to delete your account.', 'Error');
        return;
      }

      // 1. Delete user's files from storage (uploads bucket)
      const uploadsPrefix = `uploads/${user.id}`;
      const { data: uploadFiles } = await supabase.storage.from('sheets').list(uploadsPrefix);
      if (uploadFiles?.length) {
        const filesToDelete = uploadFiles.map(f => `${uploadsPrefix}/${f.name}`);
        await supabase.storage.from('sheets').remove(filesToDelete);
      }

      // 2. Delete user's public files from storage
      const publicPrefix = `public/${user.id}`;
      const { data: publicFiles } = await supabase.storage.from('sheets').list(publicPrefix);
      if (publicFiles?.length) {
        const publicFilesToDelete = publicFiles.map(f => `${publicPrefix}/${f.name}`);
        await supabase.storage.from('sheets').remove(publicFilesToDelete);
      }

      // 3. Delete user's preview images
      const previewsPrefix = `public/previews/${user.id}`;
      const { data: previewFiles } = await supabase.storage.from('sheets').list(previewsPrefix);
      if (previewFiles?.length) {
        const previewFilesToDelete = previewFiles.map(f => `${previewsPrefix}/${f.name}`);
        await supabase.storage.from('sheets').remove(previewFilesToDelete);
      }

      // 4. Delete sheets_meta entries
      await supabase.from('sheets_meta').delete().eq('user_id', user.id);

      // 5. Delete profile
      await supabase.from('profiles').delete().eq('id', user.id);

      // 6. Sign out
      await supabase.auth.signOut();

      alert('Your account and all associated data have been deleted. Thank you for using chseets.');
      window.location.href = '/';
    } catch (err) {
      alert('Failed to delete account: ' + err.message);
      console.error('Delete account error:', err);
    }
  }

  // Report content
  const reportBtn = e.target.closest('[data-action="report"]');
  if (reportBtn) {
    const sheetId = reportBtn.getAttribute('data-sheet-id');
    const sheetTitle = reportBtn.getAttribute('data-sheet-title');

    const reasons = [
      'Adult/Sexual content',
      'Violence or gore',
      'Hate speech',
      'Illegal content',
      'Harassment',
      'Copyright infringement',
      'Spam or misleading',
      'Other'
    ];

    const reason = prompt(
      `Report "${sheetTitle}"\n\nSelect reason (enter number):\n` +
      reasons.map((r, i) => `${i + 1}. ${r}`).join('\n') +
      '\n\nOr type your own reason:'
    );

    if (!reason) return;

    const reasonText = /^\d+$/.test(reason.trim())
      ? reasons[parseInt(reason) - 1] || reason
      : reason;

    try {
      await reportContent(sheetId, reasonText, supabase);
      alert('Thank you for your report. We will review it within 48 hours.\n\nFor urgent issues, email: report@chseets.com');
    } catch (err) {
      console.error('Report error:', err);
      alert('Report submitted. Thank you for helping keep chseets safe.');
    }
    return;
  }
});

/* ---------------- Auth change / Magic link ---------------- */
supabase.auth.onAuthStateChange((event, session) => {
  const user = session?.user ?? null;
  renderUser(user);
  if (user) {
    listMyFiles(user);
    if (event === 'SIGNED_IN') {
    }
  }
});

// Hash callback után biztos ami biztos
if (window.location.hash) {
  setTimeout(() => { updateSession(); }, 500);
}
