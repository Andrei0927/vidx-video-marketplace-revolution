/**
 * Video Card Engagement Component
 * Handles Like, Favorite, and Share functionality for all video cards across the platform
 * Works with both static cards and dynamically loaded cards (from API or video generation)
 */

class VideoCardEngagement {
    constructor() {
        this.initializeStorage();
        this.migrateOldIDs(); // Migrate old IDs to new format
        this.attachEventListeners();
        this.initializeButtonStates();
    }

    // ============= STORAGE HELPERS =============
    
    initializeStorage() {
        // Ensure storage objects exist
        if (!localStorage.getItem('userLikes')) {
            localStorage.setItem('userLikes', '{}');
        }
        if (!localStorage.getItem('userFavorites')) {
            localStorage.setItem('userFavorites', '{}');
        }
        if (!localStorage.getItem('globalFavoriteCounts')) {
            localStorage.setItem('globalFavoriteCounts', '{}');
        }
    }

    /**
     * Migrate old ad IDs to new format
     * Old: vw-transporter, audi-a5
     * New: auto-vw-transporter-2021, auto-audi-a5-sportback-2020
     */
    migrateOldIDs() {
        const idMappings = {
            'vw-transporter': 'auto-vw-transporter-2021',
            'audi-a5': 'auto-audi-a5-sportback-2020'
        };

        const userEmail = this.getUserEmail();
        if (!userEmail) return;

        let migrated = false;

        // Migrate favorites
        const allFavorites = JSON.parse(localStorage.getItem('userFavorites') || '{}');
        if (allFavorites[userEmail]) {
            const userFavorites = allFavorites[userEmail];
            const updatedFavorites = userFavorites.map(id => idMappings[id] || id);
            
            if (JSON.stringify(userFavorites) !== JSON.stringify(updatedFavorites)) {
                allFavorites[userEmail] = updatedFavorites;
                localStorage.setItem('userFavorites', JSON.stringify(allFavorites));
                migrated = true;
                console.log('[ID MIGRATION] Updated favorites:', userFavorites, '→', updatedFavorites);
            }
        }

        // Migrate likes
        const allLikes = JSON.parse(localStorage.getItem('userLikes') || '{}');
        if (allLikes[userEmail]) {
            const userLikes = allLikes[userEmail];
            const updatedLikes = userLikes.map(id => idMappings[id] || id);
            
            if (JSON.stringify(userLikes) !== JSON.stringify(updatedLikes)) {
                allLikes[userEmail] = updatedLikes;
                localStorage.setItem('userLikes', JSON.stringify(allLikes));
                migrated = true;
                console.log('[ID MIGRATION] Updated likes:', userLikes, '→', updatedLikes);
            }
        }

        // Migrate global favorite counts
        const globalCounts = JSON.parse(localStorage.getItem('globalFavoriteCounts') || '{}');
        let countsUpdated = false;
        for (const [oldId, newId] of Object.entries(idMappings)) {
            if (globalCounts[oldId] !== undefined && globalCounts[newId] === undefined) {
                globalCounts[newId] = globalCounts[oldId];
                delete globalCounts[oldId];
                countsUpdated = true;
            }
        }
        if (countsUpdated) {
            localStorage.setItem('globalFavoriteCounts', JSON.stringify(globalCounts));
            migrated = true;
            console.log('[ID MIGRATION] Updated global favorite counts');
        }

        if (migrated) {
            console.log('[ID MIGRATION] ✅ Migration complete! Old IDs have been updated to new format.');
        }
    }

    getUserEmail() {
        return localStorage.getItem('userEmail');
    }

    isLoggedIn() {
        return !!(localStorage.getItem('authToken') || localStorage.getItem('sessionToken'));
    }

    getUserLikes() {
        const userEmail = this.getUserEmail();
        if (!userEmail) return [];
        
        const allLikes = JSON.parse(localStorage.getItem('userLikes') || '{}');
        return allLikes[userEmail] || [];
    }

    saveUserLikes(likes) {
        const userEmail = this.getUserEmail();
        if (!userEmail) return;
        
        const allLikes = JSON.parse(localStorage.getItem('userLikes') || '{}');
        allLikes[userEmail] = likes;
        localStorage.setItem('userLikes', JSON.stringify(allLikes));
    }

    getUserFavorites() {
        const userEmail = this.getUserEmail();
        if (!userEmail) return [];
        
        const allFavorites = JSON.parse(localStorage.getItem('userFavorites') || '{}');
        return allFavorites[userEmail] || [];
    }

    saveUserFavorites(favorites) {
        const userEmail = this.getUserEmail();
        if (!userEmail) return;
        
        const allFavorites = JSON.parse(localStorage.getItem('userFavorites') || '{}');
        allFavorites[userEmail] = favorites;
        localStorage.setItem('userFavorites', JSON.stringify(allFavorites));
    }

    getGlobalFavoriteCounts() {
        return JSON.parse(localStorage.getItem('globalFavoriteCounts') || '{}');
    }

    saveGlobalFavoriteCounts(counts) {
        localStorage.setItem('globalFavoriteCounts', JSON.stringify(counts));
    }

    // ============= EVENT LISTENERS =============

    attachEventListeners() {
        // Use event delegation for dynamically loaded content
        document.addEventListener('click', (e) => {
            // Like button handler
            const likeBtn = e.target.closest('[data-like-btn]');
            if (likeBtn) {
                e.stopPropagation();
                this.handleLikeClick(likeBtn);
                return;
            }

            // Favorite button handler
            const favoriteBtn = e.target.closest('[data-favorite-btn]');
            if (favoriteBtn) {
                e.stopPropagation();
                this.handleFavoriteClick(favoriteBtn);
                return;
            }

            // Share button handler
            const shareBtn = e.target.closest('[data-share-btn]');
            if (shareBtn) {
                e.stopPropagation();
                this.handleShareClick(shareBtn);
                return;
            }
        });
    }

    // ============= LIKE HANDLING =============

    handleLikeClick(btn) {
        const adId = btn.dataset.adId;
        // Query for both <i> and <svg> (after window.replaceFeatherIcons())
        const icon = btn.querySelector('i, svg');

        if (!icon) {
            console.error('Like button icon not found for ad:', adId);
            return;
        }

        // Check if user is logged in
        if (!this.isLoggedIn() || !this.getUserEmail()) {
            window.location.href = 'index.html#register';
            return;
        }

        const likedAds = this.getUserLikes();
        const isLiked = likedAds.includes(adId);

        if (isLiked) {
            // Unlike
            const index = likedAds.indexOf(adId);
            likedAds.splice(index, 1);
            icon.classList.remove('fill-indigo-400');
        } else {
            // Like
            likedAds.push(adId);
            icon.classList.add('fill-indigo-400');
        }

        this.saveUserLikes(likedAds);

        // TODO: Send to backend API when available
        console.log('Like toggled:', adId, 'Liked:', !isLiked, 'User:', this.getUserEmail());
    }

    // ============= FAVORITE HANDLING =============

    handleFavoriteClick(btn) {
        const adId = btn.dataset.adId;
        // Query for both <i> and <svg> (after window.replaceFeatherIcons())
        const icon = btn.querySelector('i, svg');
        const countDisplay = btn.querySelector('[data-count-display]');

        console.log('[FAVORITE] Button clicked for ad:', adId);
        console.log('[FAVORITE] Icon found:', !!icon);

        if (!icon) {
            console.error('Favorite button icon not found for ad:', adId);
            return;
        }

        // Check if user is logged in
        const isLoggedIn = this.isLoggedIn();
        const userEmail = this.getUserEmail();
        
        console.log('[FAVORITE] isLoggedIn:', isLoggedIn);
        console.log('[FAVORITE] userEmail:', userEmail);
        
        if (!isLoggedIn || !userEmail) {
            console.log('[FAVORITE] Not logged in, redirecting to register');
            window.location.href = 'index.html#register';
            return;
        }

        const favoritedAds = this.getUserFavorites();
        const isFavorited = favoritedAds.includes(adId);

        console.log('[FAVORITE] Current favorites for user:', favoritedAds);
        console.log('[FAVORITE] Is currently favorited:', isFavorited);

        // Get global counts
        const globalCounts = this.getGlobalFavoriteCounts();
        const currentCount = globalCounts[adId] || parseInt(btn.dataset.favoriteCount) || 0;

        if (isFavorited) {
            // Remove from favorites
            const index = favoritedAds.indexOf(adId);
            favoritedAds.splice(index, 1);
            icon.classList.remove('fill-pink-500');

            // Decrement global count
            globalCounts[adId] = Math.max(0, currentCount - 1);
            console.log('[FAVORITE] Removed from favorites');
        } else {
            // Add to favorites
            favoritedAds.push(adId);
            icon.classList.add('fill-pink-500');

            // Increment global count
            globalCounts[adId] = currentCount + 1;
            console.log('[FAVORITE] Added to favorites');
        }

        // Update display
        if (countDisplay) {
            countDisplay.textContent = globalCounts[adId];
        }

        this.saveUserFavorites(favoritedAds);
        this.saveGlobalFavoriteCounts(globalCounts);

        console.log('[FAVORITE] Saved favorites:', favoritedAds);
        console.log('[FAVORITE] localStorage userFavorites:', localStorage.getItem('userFavorites'));

        // TODO: Send to backend API when available
        console.log('Favorite toggled:', adId, 'Favorited:', !isFavorited, 'User:', this.getUserEmail(), 'Global count:', globalCounts[adId]);
    }

    // ============= SHARE HANDLING =============

    async handleShareClick(btn) {
        const adId = btn.dataset.adId;
        const adTitle = btn.dataset.adTitle || 'Check out this ad';
        const adPrice = btn.dataset.adPrice || '';

        const shareData = {
            title: `${adTitle} - ${adPrice}`,
            text: `${adTitle} - ${adPrice} on VidX`,
            url: `${window.location.origin}/details.html?ad=${adId}`
        };

        try {
            if (navigator.share) {
                // Use native share on supported devices
                await navigator.share(shareData);
                console.log('Shared successfully');
            } else {
                // Try clipboard API first
                try {
                    await navigator.clipboard.writeText(shareData.url);
                    this.showCopyFeedback(btn);
                    console.log('Link copied to clipboard');
                } catch (clipboardErr) {
                    // Clipboard API failed (HTTP, iOS, permissions) - show fallback modal
                    console.log('Clipboard API failed, showing fallback modal:', clipboardErr);
                    this.showShareModal(shareData.url, adTitle, adPrice);
                }
            }
        } catch (err) {
            console.error('Error sharing:', err);
            // If native share fails, try clipboard
            try {
                await navigator.clipboard.writeText(shareData.url);
                this.showCopyFeedback(btn);
            } catch (clipboardErr) {
                // Show fallback modal as last resort
                this.showShareModal(shareData.url, adTitle, adPrice);
            }
        }
    }

    showCopyFeedback(btn) {
        const originalIcon = btn.innerHTML;
        btn.innerHTML = '<i data-feather="check" class="h-5 w-5 text-green-500"></i>';
        if (window.feather) {
            window.replaceFeatherIcons();
        }

        setTimeout(() => {
            btn.innerHTML = originalIcon;
            if (window.feather) {
                window.replaceFeatherIcons();
            }
        }, 2000);
    }

    showShareModal(url, title, price) {
        // Create modal overlay
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn';
        modal.style.animation = 'fadeIn 0.2s ease-out';
        
        modal.innerHTML = `
            <div class="bg-white dark:bg-dark-100 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl transform scale-95 animate-scaleIn" style="animation: scaleIn 0.2s ease-out forwards;">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-bold text-gray-900 dark:text-dark-600">Share this listing</h3>
                    <button id="close-share-modal" class="text-gray-400 hover:text-gray-600 dark:hover:text-dark-500 transition-colors">
                        <i data-feather="x" class="h-6 w-6"></i>
                    </button>
                </div>
                
                <div class="mb-4">
                    <p class="text-sm text-gray-600 dark:text-dark-400 mb-2">
                        ${title} - ${price}
                    </p>
                    <div class="relative">
                        <input type="text" readonly value="${url}" 
                               id="share-url-input"
                               class="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-dark-300 rounded-lg bg-gray-50 dark:bg-dark-200 text-gray-900 dark:text-dark-600 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 select-all">
                        <button id="copy-icon-btn" class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors">
                            <i data-feather="copy" class="h-5 w-5"></i>
                        </button>
                    </div>
                </div>
                
                <div class="flex gap-2">
                    <button id="copy-share-url" class="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center gap-2">
                        <i data-feather="clipboard" class="h-4 w-4"></i>
                        Copy Link
                    </button>
                    <button id="close-share-modal-btn" class="px-4 py-2 border border-gray-300 dark:border-dark-300 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-200 transition-colors text-gray-700 dark:text-dark-500 font-medium">
                        Close
                    </button>
                </div>
            </div>
        `;
        
        // Add CSS animations if not already present
        if (!document.getElementById('share-modal-animations')) {
            const style = document.createElement('style');
            style.id = 'share-modal-animations';
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleIn {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .select-all { user-select: all; }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(modal);
        
        // Replace feather icons
        if (window.feather) {
            window.replaceFeatherIcons();
        }
        
        // Focus and select the input
        const input = document.getElementById('share-url-input');
        setTimeout(() => {
            input.focus();
            input.select();
        }, 100);
        
        // Copy button handler (using document.execCommand as fallback)
        const copyBtn = document.getElementById('copy-share-url');
        const copyIconBtn = document.getElementById('copy-icon-btn');
        
        const handleCopy = () => {
            input.select();
            input.setSelectionRange(0, 99999); // For mobile devices
            
            try {
                // Try modern clipboard API first
                navigator.clipboard.writeText(url).then(() => {
                    this.showCopySuccess(copyBtn);
                }).catch(() => {
                    // Fallback to execCommand
                    const success = document.execCommand('copy');
                    if (success) {
                        this.showCopySuccess(copyBtn);
                    }
                });
            } catch (err) {
                // Last resort: execCommand
                const success = document.execCommand('copy');
                if (success) {
                    this.showCopySuccess(copyBtn);
                }
            }
        };
        
        copyBtn.addEventListener('click', handleCopy);
        copyIconBtn.addEventListener('click', handleCopy);
        
        // Close button handlers
        const closeModal = () => {
            modal.style.animation = 'fadeIn 0.2s ease-out reverse';
            setTimeout(() => modal.remove(), 200);
        };
        
        document.getElementById('close-share-modal').addEventListener('click', closeModal);
        document.getElementById('close-share-modal-btn').addEventListener('click', closeModal);
        
        // Click outside to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        
        // Escape key to close
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }
    
    showCopySuccess(btn) {
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i data-feather="check" class="h-4 w-4"></i> Copied!';
        btn.classList.remove('bg-indigo-600', 'hover:bg-indigo-700');
        btn.classList.add('bg-green-600', 'hover:bg-green-700');
        
        if (window.feather) {
            window.replaceFeatherIcons();
        }
        
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.classList.remove('bg-green-600', 'hover:bg-green-700');
            btn.classList.add('bg-indigo-600', 'hover:bg-indigo-700');
            if (window.feather) {
                window.replaceFeatherIcons();
            }
        }, 2000);
    }

    // ============= INITIALIZATION =============

    initializeButtonStates() {
        // Initialize all like buttons
        this.initializeLikeButtons();
        
        // Initialize all favorite buttons
        this.initializeFavoriteButtons();
    }

    initializeLikeButtons() {
        const likedAds = this.getUserLikes();
        
        document.querySelectorAll('[data-like-btn]').forEach(btn => {
            const adId = btn.dataset.adId;
            // Query for both <i> and <svg> (after window.replaceFeatherIcons())
            const icon = btn.querySelector('i, svg');
            
            if (!icon) {
                console.warn('Like button missing icon for ad:', adId);
                return;
            }
            
            if (likedAds.includes(adId)) {
                icon.classList.add('fill-indigo-400');
            }
        });
    }

    initializeFavoriteButtons() {
        const favoritedAds = this.getUserFavorites();
        const globalCounts = this.getGlobalFavoriteCounts();
        
        document.querySelectorAll('[data-favorite-btn]').forEach(btn => {
            const adId = btn.dataset.adId;
            // Query for both <i> and <svg> (after window.replaceFeatherIcons())
            const icon = btn.querySelector('i, svg');
            const countDisplay = btn.querySelector('[data-count-display]');
            
            if (!icon) {
                console.warn('Favorite button missing icon for ad:', adId);
                return;
            }
            
            // Set user-specific heart state
            if (favoritedAds.includes(adId)) {
                icon.classList.add('fill-pink-500');
            }
            
            // Set global count
            if (globalCounts[adId] !== undefined && countDisplay) {
                countDisplay.textContent = globalCounts[adId];
            }
        });
    }

    // ============= PUBLIC API FOR DYNAMIC CONTENT =============

    /**
     * Call this after dynamically loading new video cards (e.g., from API or video generation)
     * to reinitialize button states for the new content
     */
    refreshButtonStates() {
        this.initializeButtonStates();
    }

    /**
     * Get favorite status for a specific ad (useful for rendering)
     */
    isFavorited(adId) {
        return this.getUserFavorites().includes(adId);
    }

    /**
     * Get like status for a specific ad (useful for rendering)
     */
    isLiked(adId) {
        return this.getUserLikes().includes(adId);
    }

    /**
     * Get global favorite count for a specific ad
     */
    getFavoriteCount(adId) {
        const globalCounts = this.getGlobalFavoriteCounts();
        return globalCounts[adId] || 0;
    }
}

// Initialize globally when DOM is ready
let videoCardEngagement;

// Wait for both DOM and feather icons to be ready
function initializeEngagement() {
    // Ensure feather icons are rendered first
    if (window.feather) {
        window.replaceFeatherIcons();
    }
    
    // Small delay to ensure icons are fully rendered
    setTimeout(() => {
        videoCardEngagement = new VideoCardEngagement();
        // Export singleton instance after creation
        window.videoCardEngagement = videoCardEngagement;
    }, 100);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeEngagement);
} else {
    initializeEngagement();
}

// Export class for manual instantiation if needed
window.VideoCardEngagement = VideoCardEngagement;
