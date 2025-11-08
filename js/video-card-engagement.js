/**
 * Video Card Engagement Component
 * Handles Like, Favorite, and Share functionality for all video cards across the platform
 * Works with both static cards and dynamically loaded cards (from Revid API)
 */

class VideoCardEngagement {
    constructor() {
        this.initializeStorage();
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
        // Query for both <i> and <svg> (after feather.replace())
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
        // Query for both <i> and <svg> (after feather.replace())
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
                // Fallback: Copy to clipboard
                await navigator.clipboard.writeText(shareData.url);

                // Show feedback
                const originalIcon = btn.innerHTML;
                btn.innerHTML = '<i data-feather="check" class="h-5 w-5 text-green-500"></i>';
                if (window.feather) {
                    feather.replace();
                }

                setTimeout(() => {
                    btn.innerHTML = originalIcon;
                    if (window.feather) {
                        feather.replace();
                    }
                }, 2000);

                console.log('Link copied to clipboard');
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
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
            // Query for both <i> and <svg> (after feather.replace())
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
            // Query for both <i> and <svg> (after feather.replace())
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
     * Call this after dynamically loading new video cards (e.g., from Revid API)
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
        feather.replace();
    }
    
    // Small delay to ensure icons are fully rendered
    setTimeout(() => {
        videoCardEngagement = new VideoCardEngagement();
    }, 100);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeEngagement);
} else {
    initializeEngagement();
}

// Export for use in other scripts
window.VideoCardEngagement = VideoCardEngagement;
window.videoCardEngagement = videoCardEngagement;
