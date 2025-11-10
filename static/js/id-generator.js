/**
 * ID Generation System for VidX Platform
 * Generates unique, sequential IDs for ads/videos and tracks them in localStorage
 */

class IDGenerator {
    constructor() {
        this.storageKey = 'vidx_id_counter';
        this.adsStorageKey = 'vidx_ads_registry';
        this.initializeStorage();
    }

    /**
     * Initialize storage with default values if not exists
     */
    initializeStorage() {
        if (!localStorage.getItem(this.storageKey)) {
            localStorage.setItem(this.storageKey, '1000'); // Start from 1000
        }
        if (!localStorage.getItem(this.adsStorageKey)) {
            localStorage.setItem(this.adsStorageKey, '{}');
        }
    }

    /**
     * Generate a new unique ID
     * @param {string} prefix - Optional prefix (e.g., 'auto', 'fashion', 'home')
     * @returns {string} Unique ID (e.g., 'auto-1001' or just '1001')
     */
    generateID(prefix = '') {
        let counter = parseInt(localStorage.getItem(this.storageKey));
        counter++;
        localStorage.setItem(this.storageKey, counter.toString());
        
        return prefix ? `${prefix}-${counter}` : counter.toString();
    }

    /**
     * Generate ID from title (slug-based)
     * @param {string} title - Ad title
     * @param {string} category - Category prefix (optional)
     * @returns {string} Slug-based ID (e.g., 'auto-vw-transporter-2021')
     */
    generateFromTitle(title, category = '') {
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
        
        const base = category ? `${category}-${slug}` : slug;
        
        // Check if ID exists, if so append counter
        const registry = this.getRegistry();
        if (registry[base]) {
            let counter = 2;
            while (registry[`${base}-${counter}`]) {
                counter++;
            }
            return `${base}-${counter}`;
        }
        
        return base;
    }

    /**
     * Register an ad with its metadata
     * @param {string} id - Ad ID
     * @param {Object} metadata - Ad metadata (title, category, price, etc.)
     */
    registerAd(id, metadata) {
        const registry = this.getRegistry();
        registry[id] = {
            ...metadata,
            createdAt: new Date().toISOString(),
            id: id
        };
        localStorage.setItem(this.adsStorageKey, JSON.stringify(registry));
    }

    /**
     * Get ad metadata by ID
     * @param {string} id - Ad ID
     * @returns {Object|null} Ad metadata or null if not found
     */
    getAd(id) {
        const registry = this.getRegistry();
        return registry[id] || null;
    }

    /**
     * Get all registered ads
     * @returns {Object} Registry object with all ads
     */
    getRegistry() {
        return JSON.parse(localStorage.getItem(this.adsStorageKey) || '{}');
    }

    /**
     * Get all ads as an array
     * @returns {Array} Array of ad objects
     */
    getAllAds() {
        const registry = this.getRegistry();
        return Object.values(registry);
    }

    /**
     * Get ads by category
     * @param {string} category - Category name
     * @returns {Array} Array of ads in that category
     */
    getAdsByCategory(category) {
        return this.getAllAds().filter(ad => ad.category === category);
    }

    /**
     * Check if an ID exists
     * @param {string} id - ID to check
     * @returns {boolean} True if ID exists
     */
    idExists(id) {
        const registry = this.getRegistry();
        return !!registry[id];
    }

    /**
     * Update ad metadata
     * @param {string} id - Ad ID
     * @param {Object} updates - Fields to update
     * @returns {boolean} True if successful, false if ad not found
     */
    updateAd(id, updates) {
        const registry = this.getRegistry();
        if (!registry[id]) {
            return false;
        }
        
        registry[id] = {
            ...registry[id],
            ...updates,
            updatedAt: new Date().toISOString()
        };
        
        localStorage.setItem(this.adsStorageKey, JSON.stringify(registry));
        return true;
    }

    /**
     * Delete an ad
     * @param {string} id - Ad ID to delete
     * @returns {boolean} True if successful, false if ad not found
     */
    deleteAd(id) {
        const registry = this.getRegistry();
        if (!registry[id]) {
            return false;
        }
        
        delete registry[id];
        localStorage.setItem(this.adsStorageKey, JSON.stringify(registry));
        return true;
    }

    /**
     * Reset the entire system (use with caution!)
     */
    reset() {
        localStorage.setItem(this.storageKey, '1000');
        localStorage.setItem(this.adsStorageKey, '{}');
    }

    /**
     * Get current counter value
     * @returns {number} Current counter
     */
    getCurrentCounter() {
        return parseInt(localStorage.getItem(this.storageKey));
    }
}

// Initialize global instance
const idGenerator = new IDGenerator();

// Export for global use
window.IDGenerator = IDGenerator;
window.idGenerator = idGenerator;
