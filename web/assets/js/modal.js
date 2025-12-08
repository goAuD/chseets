// /assets/js/modal.js
// Cyberpunk Modal System - Custom alert/confirm/prompt replacement

/**
 * CyberModal - A Promise-based modal system with cyberpunk styling
 * Usage:
 *   await CyberModal.alert('Message', 'Title');
 *   const confirmed = await CyberModal.confirm('Are you sure?', 'Confirm');
 *   const value = await CyberModal.prompt('Enter value:', 'Input', 'default');
 *   const confirmed = await CyberModal.danger('Delete everything?', 'Warning');
 */

const CyberModal = {
    overlay: null,

    // Create the overlay container (once)
    init() {
        if (this.overlay) return;

        this.overlay = document.createElement('div');
        this.overlay.className = 'cyber-modal-overlay';
        this.overlay.innerHTML = `
      <div class="cyber-modal-wrapper neon-frame">
        <div class="cyber-modal" role="dialog" aria-modal="true">
          <div class="cyber-modal-header">
            <h3 class="cyber-modal-title"></h3>
            <button class="cyber-modal-close" aria-label="Close">×</button>
          </div>
          <div class="cyber-modal-body">
            <p class="cyber-modal-message"></p>
            <input type="text" class="cyber-modal-input" style="display: none;">
          </div>
          <div class="cyber-modal-footer"></div>
        </div>
      </div>
    `;
        document.body.appendChild(this.overlay);

        // Close on overlay click
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.close(null);
            }
        });

        // Close button
        this.overlay.querySelector('.cyber-modal-close').addEventListener('click', () => {
            this.close(null);
        });

        // ESC to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.overlay.classList.contains('active')) {
                this.close(null);
            }
        });
    },

    // Internal resolver
    _resolve: null,

    // Show the modal
    show({ title, message, input = false, inputValue = '', buttons = [], isDanger = false }) {
        this.init();

        const modal = this.overlay.querySelector('.cyber-modal');
        const titleEl = modal.querySelector('.cyber-modal-title');
        const messageEl = modal.querySelector('.cyber-modal-message');
        const inputEl = modal.querySelector('.cyber-modal-input');
        const footerEl = modal.querySelector('.cyber-modal-footer');

        // Update content
        titleEl.textContent = title;
        messageEl.textContent = message;

        // Handle input field
        if (input) {
            inputEl.style.display = 'block';
            inputEl.value = inputValue;
            messageEl.style.marginBottom = '16px';
        } else {
            inputEl.style.display = 'none';
            messageEl.style.marginBottom = '0';
        }

        // Update title color for danger modals (border is on wrapper via neon-frame)
        if (isDanger) {
            titleEl.style.color = 'var(--pulse)';
        } else {
            titleEl.style.color = 'var(--accent)';
        }

        // Generate buttons
        footerEl.innerHTML = buttons.map(btn => `
      <button class="cyber-modal-btn cyber-modal-btn-${btn.type}" data-value="${btn.value}">
        ${btn.label}
      </button>
    `).join('');

        // Button event listeners
        footerEl.querySelectorAll('.cyber-modal-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const value = btn.dataset.value;
                if (input && value === 'true') {
                    this.close(inputEl.value);
                } else if (value === 'true') {
                    this.close(true);
                } else if (value === 'false') {
                    this.close(false);
                } else {
                    this.close(null);
                }
            });
        });

        // Show overlay
        this.overlay.classList.add('active');

        // Focus input or first button
        setTimeout(() => {
            if (input) {
                inputEl.focus();
                inputEl.select();
            } else {
                footerEl.querySelector('.cyber-modal-btn-primary, .cyber-modal-btn-danger')?.focus();
            }
        }, 100);

        return new Promise(resolve => {
            this._resolve = resolve;
        });
    },

    // Close the modal
    close(value) {
        this.overlay.classList.remove('active');
        if (this._resolve) {
            this._resolve(value);
            this._resolve = null;
        }
    },

    // Alert - Simple message with OK button
    alert(message, title = 'Notice') {
        return this.show({
            title,
            message,
            buttons: [
                { label: 'OK', type: 'primary', value: 'true' }
            ]
        });
    },

    // Confirm - Yes/No question
    confirm(message, title = 'Confirm') {
        return this.show({
            title,
            message,
            buttons: [
                { label: 'Cancel', type: 'secondary', value: 'false' },
                { label: 'Confirm', type: 'primary', value: 'true' }
            ]
        });
    },

    // Prompt - Input with OK/Cancel
    prompt(message, title = 'Input', defaultValue = '') {
        return this.show({
            title,
            message,
            input: true,
            inputValue: defaultValue,
            buttons: [
                { label: 'Cancel', type: 'secondary', value: 'false' },
                { label: 'OK', type: 'primary', value: 'true' }
            ]
        });
    },

    // Danger - Destructive action confirmation
    danger(message, title = 'Warning') {
        return this.show({
            title,
            message,
            isDanger: true,
            buttons: [
                { label: 'Cancel', type: 'secondary', value: 'false' },
                { label: 'Delete', type: 'danger', value: 'true' }
            ]
        });
    }
};

// Export for ES modules
export { CyberModal };

// Also make available globally for inline scripts
window.CyberModal = CyberModal;
