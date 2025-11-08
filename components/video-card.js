/**
 * Global Video Card Component
 * Generates consistent video card HTML structure across the entire platform
 * Works with the video-card-engagement.js system for likes, favorites, and shares
 */

class VideoCard {
    /**
     * Generate a complete video card HTML structure
     * @param {Object} data - Video card data
     * @param {string} data.id - Unique video/ad ID (required)
     * @param {string} data.videoUrl - Video source URL (required)
     * @param {string} data.title - Ad title (required)
     * @param {string} data.price - Price string (required)
     * @param {string} data.seller - Seller name (required)
     * @param {string} data.sellerAvatar - Seller avatar URL (required)
     * @param {string} data.location - Location string (required)
     * @param {string} data.timeAgo - Time posted (e.g., "2 days ago") (required)
     * @param {string} data.description - Item description/specs (required)
     * @param {string} data.detailsUrl - Link to details page (optional, defaults to details.html?ad={id})
     * @param {number} data.favoriteCount - Initial favorite count (optional, defaults to 0)
     * @param {number} data.messageCount - Message count (optional, defaults to 0)
     * @param {Object} data.attributes - Custom data attributes for filtering (optional)
     * @returns {string} Complete HTML for video card
     */
    static generate(data) {
        // Validate required fields
        const required = ['id', 'videoUrl', 'title', 'price', 'seller', 'sellerAvatar', 'location', 'timeAgo', 'description'];
        for (const field of required) {
            if (!data[field]) {
                console.error(`VideoCard.generate: Missing required field "${field}"`, data);
                throw new Error(`Missing required field: ${field}`);
            }
        }

        const {
            id,
            videoUrl,
            title,
            price,
            seller,
            sellerAvatar,
            location,
            timeAgo,
            description,
            detailsUrl = `details.html?ad=${id}`,
            favoriteCount = 0,
            messageCount = 0,
            attributes = {}
        } = data;

        // Build custom data attributes string
        let customAttrs = '';
        for (const [key, value] of Object.entries(attributes)) {
            customAttrs += ` data-${key}="${this.escapeHtml(value)}"`;
        }

        return `
    <div class="video-card" data-video-card data-details-url="${this.escapeHtml(detailsUrl)}"${customAttrs}>
        <video loop playsinline preload="metadata">
            <source src="${this.escapeHtml(videoUrl)}" type="video/mp4" />
            Your browser does not support the video tag.
        </video>
        
        <!-- Volume Indicator -->
        <div class="volume-indicator">
            <i data-feather="volume-x" class="h-5 w-5 text-white volume-off"></i>
            <i data-feather="volume-2" class="h-5 w-5 text-white volume-on" style="display: none;"></i>
        </div>
        
        <div class="video-overlay">
            <div class="flex items-center mb-3">
                <img class="h-10 w-10 rounded-full" src="${this.escapeHtml(sellerAvatar)}" alt="${this.escapeHtml(seller)}">
                <div class="ml-3">
                    <h3 class="text-white font-medium">${this.escapeHtml(seller)}</h3>
                    <p class="text-gray-300 text-sm">${this.escapeHtml(timeAgo)} · ${this.escapeHtml(location)}</p>
                </div>
            </div>
            <a href="${this.escapeHtml(detailsUrl)}" class="block group">
                <h2 class="text-lg font-bold text-white group-hover:text-indigo-400 transition">${this.escapeHtml(title)}</h2>
            </a>
            <p class="mt-1 text-gray-300 text-sm">${this.escapeHtml(description)}</p>
            <div class="mt-3 flex items-center justify-between">
                <span class="text-xl font-bold text-white">${this.escapeHtml(price)}</span>
                <div class="flex space-x-3">
                    <!-- Like Button (Thumbs Up) -->
                    <button class="flex items-center text-white group" data-like-btn data-ad-id="${this.escapeHtml(id)}">
                        <i data-feather="thumbs-up" class="h-5 w-5 group-hover:text-indigo-400 transition"></i>
                    </button>
                    
                    <!-- Favorite Button (Heart) -->
                    <button class="flex items-center text-white group" data-favorite-btn data-ad-id="${this.escapeHtml(id)}" data-favorite-count="${favoriteCount}">
                        <i data-feather="heart" class="h-5 w-5 group-hover:text-pink-500 transition"></i>
                        <span class="ml-1 text-sm" data-count-display>${favoriteCount}</span>
                    </button>
                    
                    <!-- Message Button -->
                    <button class="flex items-center text-white group">
                        <i data-feather="message-square" class="h-5 w-5 group-hover:text-blue-500 transition"></i>
                        <span class="ml-1 text-sm">${messageCount}</span>
                    </button>
                    
                    <!-- Share Button -->
                    <button class="flex items-center text-white group" data-share-btn data-ad-id="${this.escapeHtml(id)}" data-ad-title="${this.escapeHtml(title)}" data-ad-price="${this.escapeHtml(price)}">
                        <i data-feather="share-2" class="h-5 w-5 group-hover:text-green-500 transition"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>`;
    }

    /**
     * Generate multiple video cards from an array of data
     * @param {Array} dataArray - Array of video card data objects
     * @returns {string} HTML string of all video cards
     */
    static generateMultiple(dataArray) {
        return dataArray.map(data => this.generate(data)).join('\n');
    }

    /**
     * Escape HTML to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    static escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Render video cards into a container and initialize engagement buttons
     * @param {string|HTMLElement} container - Container selector or element
     * @param {Array} dataArray - Array of video card data
     */
    static render(container, dataArray) {
        const element = typeof container === 'string' 
            ? document.querySelector(container) 
            : container;

        if (!element) {
            console.error('VideoCard.render: Container not found', container);
            return;
        }

        // Generate and insert HTML
        element.innerHTML = this.generateMultiple(dataArray);

        // Replace feather icons
        if (window.feather) {
            feather.replace();
        }

        // Reinitialize engagement buttons if available
        if (window.videoCardEngagement) {
            window.videoCardEngagement.refreshButtonStates();
        }
    }
}

// Export for global use
window.VideoCard = VideoCard;
