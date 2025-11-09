/**
 * VidX Confirmation Modal
 * Reusable custom confirmation dialog for destructive actions
 */

class ConfirmationModal {
    /**
     * Show confirmation modal
     * @param {Object} options - Modal options
     * @param {string} options.title - Modal title
     * @param {string} options.message - Confirmation message
     * @param {string} options.confirmText - Confirm button text (default: "Confirm")
     * @param {string} options.cancelText - Cancel button text (default: "Cancel")
     * @param {string} options.confirmClass - CSS classes for confirm button (default: danger style)
     * @param {string} options.icon - Feather icon name (default: "alert-circle")
     * @returns {Promise<boolean>} Resolves to true if confirmed, false if cancelled
     */
    static show(options = {}) {
        const {
            title = 'Are you sure?',
            message = 'This action cannot be undone.',
            confirmText = 'Confirm',
            cancelText = 'Cancel',
            confirmClass = 'bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600',
            icon = 'alert-circle'
        } = options;

        return new Promise((resolve) => {
            // Create modal overlay
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
            modal.innerHTML = `
                <div class="bg-white dark:bg-dark-100 rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all">
                    <div class="p-6">
                        <div class="flex items-start">
                            <div class="flex-shrink-0">
                                <i data-feather="${icon}" class="h-6 w-6 text-red-600 dark:text-red-400"></i>
                            </div>
                            <div class="ml-4 flex-1">
                                <h3 class="text-lg font-medium text-gray-900 dark:text-dark-600 mb-2">
                                    ${title}
                                </h3>
                                <p class="text-sm text-gray-500 dark:text-dark-400">
                                    ${message}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-50 dark:bg-dark-50 px-6 py-4 flex gap-3 justify-end rounded-b-lg">
                        <button id="modal-cancel" class="px-4 py-2 border border-gray-300 dark:border-dark-200 rounded-md text-sm font-medium text-gray-700 dark:text-dark-500 bg-white dark:bg-dark-100 hover:bg-gray-50 dark:hover:bg-dark-200 transition">
                            ${cancelText}
                        </button>
                        <button id="modal-confirm" class="px-4 py-2 rounded-md text-sm font-medium text-white ${confirmClass} transition">
                            ${confirmText}
                        </button>
                    </div>
                </div>
            `;

            // Add to body
            document.body.appendChild(modal);

            // Replace feather icons
            if (window.feather) {
                window.feather.replace();
            }

            // Handle confirm
            const confirmBtn = modal.querySelector('#modal-confirm');
            confirmBtn.addEventListener('click', () => {
                modal.remove();
                resolve(true);
            });

            // Handle cancel
            const cancelBtn = modal.querySelector('#modal-cancel');
            cancelBtn.addEventListener('click', () => {
                modal.remove();
                resolve(false);
            });

            // Handle click outside
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                    resolve(false);
                }
            });

            // Handle Escape key
            const handleEscape = (e) => {
                if (e.key === 'Escape') {
                    modal.remove();
                    resolve(false);
                    document.removeEventListener('keydown', handleEscape);
                }
            };
            document.addEventListener('keydown', handleEscape);
        });
    }

    /**
     * Show delete confirmation with preset styling
     * @param {string} itemName - Name of item being deleted
     * @param {string} itemType - Type of item (default: "item")
     * @returns {Promise<boolean>}
     */
    static confirmDelete(itemName = '', itemType = 'item') {
        return this.show({
            title: `Delete ${itemType}?`,
            message: itemName 
                ? `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
                : `Are you sure you want to delete this ${itemType}? This action cannot be undone.`,
            confirmText: 'Delete',
            confirmClass: 'bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600',
            icon: 'trash-2'
        });
    }

    /**
     * Show logout confirmation with preset styling
     * @returns {Promise<boolean>}
     */
    static confirmLogout() {
        return this.show({
            title: 'Logout?',
            message: 'Are you sure you want to logout? You will need to login again to access your account.',
            confirmText: 'Logout',
            confirmClass: 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600',
            icon: 'log-out'
        });
    }

    /**
     * Show discard changes confirmation
     * @returns {Promise<boolean>}
     */
    static confirmDiscard() {
        return this.show({
            title: 'Discard changes?',
            message: 'You have unsaved changes. Are you sure you want to leave this page? All changes will be lost.',
            confirmText: 'Discard',
            confirmClass: 'bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600',
            icon: 'alert-triangle'
        });
    }
}

// Make available globally
window.ConfirmationModal = ConfirmationModal;
