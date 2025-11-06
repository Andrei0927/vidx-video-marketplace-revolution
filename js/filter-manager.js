// Filter state management
export class FilterManager {
    constructor() {
        this.filters = {
            make: [],
            type: [],
            priceRange: { min: null, max: null },
            yearRange: { min: null, max: null },
            condition: [],
            location: null
        };
        
        this.subscribers = [];
    }

    subscribe(callback) {
        this.subscribers.push(callback);
        return () => {
            this.subscribers = this.subscribers.filter(cb => cb !== callback);
        };
    }

    notify() {
        this.subscribers.forEach(callback => callback(this.filters));
    }

    setFilter(key, value) {
        if (typeof this.filters[key] === 'undefined') {
            console.warn(`Invalid filter key: ${key}`);
            return;
        }

        this.filters[key] = value;
        this.notify();
    }

    resetFilters() {
        this.filters = {
            make: [],
            type: [],
            priceRange: { min: null, max: null },
            yearRange: { min: null, max: null },
            condition: [],
            location: null
        };
        this.notify();
    }

    getActiveFilters() {
        const active = {};
        Object.entries(this.filters).forEach(([key, value]) => {
            if (Array.isArray(value) && value.length > 0) {
                active[key] = value;
            } else if (value && typeof value === 'object') {
                if (value.min !== null || value.max !== null) {
                    active[key] = value;
                }
            } else if (value !== null) {
                active[key] = value;
            }
        });
        return active;
    }

    isVideoMatching(video) {
        const active = this.getActiveFilters();
        
        // Check make
        if (active.make?.length > 0 && !active.make.includes(video.make)) {
            return false;
        }

        // Check type
        if (active.type?.length > 0 && !active.type.includes(video.type)) {
            return false;
        }

        // Check price range
        if (active.priceRange) {
            const { min, max } = active.priceRange;
            if (min !== null && video.price < min) return false;
            if (max !== null && video.price > max) return false;
        }

        // Check year range
        if (active.yearRange) {
            const { min, max } = active.yearRange;
            if (min !== null && video.year < min) return false;
            if (max !== null && video.year > max) return false;
        }

        // Check condition
        if (active.condition?.length > 0 && !active.condition.includes(video.condition)) {
            return false;
        }

        // Check location
        if (active.location && video.location !== active.location) {
            return false;
        }

        return true;
    }
}

export const filterManager = new FilterManager();