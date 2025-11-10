/**
 * VidX Storage Manager - IndexedDB wrapper for upload flow
 * Provides persistent storage for upload drafts with automatic cleanup
 */

class StorageManager {
    constructor() {
        this.dbName = 'VidXUploadDrafts';
        this.storeName = 'drafts';
        this.version = 1;
        this.db = null;
        this.DRAFT_EXPIRY_DAYS = 7; // Delete drafts older than 7 days
    }

    /**
     * Initialize IndexedDB connection
     * @returns {Promise<void>}
     */
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);
            
            request.onerror = () => {
                console.error('[StorageManager] Failed to open database:', request.error);
                reject(request.error);
            };
            
            request.onsuccess = () => {
                this.db = request.result;
                console.log('[StorageManager] Database opened successfully');
                
                // Clean up old drafts on initialization
                this.cleanupOldDrafts().catch(err => {
                    console.warn('[StorageManager] Failed to cleanup old drafts:', err);
                });
                
                resolve();
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Create drafts store if it doesn't exist
                if (!db.objectStoreNames.contains(this.storeName)) {
                    const objectStore = db.createObjectStore(this.storeName, { keyPath: 'id' });
                    
                    // Create index on timestamp for cleanup queries
                    objectStore.createIndex('timestamp', 'timestamp', { unique: false });
                    
                    console.log('[StorageManager] Object store created');
                }
            };
        });
    }

    /**
     * Save upload draft to IndexedDB
     * @param {Object} data - Draft data to save
     * @param {string} draftId - Optional draft ID (defaults to 'current-upload')
     * @returns {Promise<void>}
     */
    async saveDraft(data, draftId = 'current-upload') {
        if (!this.db) {
            await this.init();
        }

        const draft = {
            id: draftId,
            data: data,
            timestamp: Date.now(),
            userEmail: localStorage.getItem('userEmail') || 'anonymous'
        };
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.put(draft);
            
            request.onsuccess = () => {
                console.log('[StorageManager] Draft saved successfully:', draftId);
                resolve();
            };
            
            request.onerror = () => {
                console.error('[StorageManager] Failed to save draft:', request.error);
                reject(request.error);
            };
        });
    }

    /**
     * Get upload draft from IndexedDB
     * @param {string} draftId - Draft ID to retrieve
     * @returns {Promise<Object|null>} Draft data with metadata (timestamp, userEmail) or null if not found
     */
    async getDraft(draftId = 'current-upload') {
        if (!this.db) {
            await this.init();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get(draftId);
            
            request.onsuccess = () => {
                if (request.result) {
                    console.log('[StorageManager] Draft retrieved:', draftId);
                    // Return merged object: data properties + metadata (timestamp, userEmail, id)
                    // This ensures upload.html can access both draft.timestamp and draft.files, etc.
                    resolve({
                        ...request.result.data,           // Spread image/video files and other data
                        timestamp: request.result.timestamp,  // Add timestamp for resume banner
                        userEmail: request.result.userEmail   // Add email for logging
                    });
                } else {
                    console.log('[StorageManager] No draft found:', draftId);
                    resolve(null);
                }
            };
            
            request.onerror = () => {
                console.error('[StorageManager] Failed to retrieve draft:', request.error);
                reject(request.error);
            };
        });
    }

    /**
     * Check if a draft exists
     * @param {string} draftId - Draft ID to check
     * @returns {Promise<boolean>} True if draft exists
     */
    async hasDraft(draftId = 'current-upload') {
        const draft = await this.getDraft(draftId);
        return draft !== null;
    }

    /**
     * Delete upload draft
     * @param {string} draftId - Draft ID to delete
     * @returns {Promise<void>}
     */
    async clearDraft(draftId = 'current-upload') {
        if (!this.db) {
            await this.init();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.delete(draftId);
            
            request.onsuccess = () => {
                console.log('[StorageManager] Draft deleted:', draftId);
                resolve();
            };
            
            request.onerror = () => {
                console.error('[StorageManager] Failed to delete draft:', request.error);
                reject(request.error);
            };
        });
    }

    /**
     * Delete all drafts (for testing/cleanup)
     * @returns {Promise<void>}
     */
    async clearAllDrafts() {
        if (!this.db) {
            await this.init();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.clear();
            
            request.onsuccess = () => {
                console.log('[StorageManager] All drafts cleared');
                resolve();
            };
            
            request.onerror = () => {
                console.error('[StorageManager] Failed to clear drafts:', request.error);
                reject(request.error);
            };
        });
    }

    /**
     * Get all drafts (for listing saved uploads)
     * @returns {Promise<Array>} Array of all drafts
     */
    async getAllDrafts() {
        if (!this.db) {
            await this.init();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.getAll();
            
            request.onsuccess = () => {
                console.log('[StorageManager] Retrieved all drafts:', request.result.length);
                resolve(request.result);
            };
            
            request.onerror = () => {
                console.error('[StorageManager] Failed to retrieve all drafts:', request.error);
                reject(request.error);
            };
        });
    }

    /**
     * Delete drafts older than DRAFT_EXPIRY_DAYS
     * @returns {Promise<number>} Number of drafts deleted
     */
    async cleanupOldDrafts() {
        if (!this.db) {
            await this.init();
        }

        const expiryTimestamp = Date.now() - (this.DRAFT_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const index = store.index('timestamp');
            const range = IDBKeyRange.upperBound(expiryTimestamp);
            const request = index.openCursor(range);
            
            let deletedCount = 0;
            
            request.onsuccess = (event) => {
                const cursor = event.target.result;
                
                if (cursor) {
                    cursor.delete();
                    deletedCount++;
                    cursor.continue();
                } else {
                    if (deletedCount > 0) {
                        console.log(`[StorageManager] Cleaned up ${deletedCount} old draft(s)`);
                    }
                    resolve(deletedCount);
                }
            };
            
            request.onerror = () => {
                console.error('[StorageManager] Failed to cleanup old drafts:', request.error);
                reject(request.error);
            };
        });
    }

    /**
     * Get storage usage info
     * @returns {Promise<Object>} Storage statistics
     */
    async getStorageInfo() {
        if (!this.db) {
            await this.init();
        }

        const drafts = await this.getAllDrafts();
        
        // Estimate storage size (rough calculation)
        let totalSize = 0;
        drafts.forEach(draft => {
            const jsonSize = JSON.stringify(draft).length;
            totalSize += jsonSize;
        });

        return {
            draftCount: drafts.length,
            estimatedSize: totalSize,
            estimatedSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
            oldestDraft: drafts.length > 0 
                ? new Date(Math.min(...drafts.map(d => d.timestamp)))
                : null,
            newestDraft: drafts.length > 0
                ? new Date(Math.max(...drafts.map(d => d.timestamp)))
                : null
        };
    }
}

// Create global singleton instance
window.storageManager = new StorageManager();

// Auto-initialize on load
window.storageManager.init().catch(err => {
    console.error('[StorageManager] Failed to initialize:', err);
    // Fallback to sessionStorage will be handled by calling code
});

// Export for module usage (optional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorageManager;
}

