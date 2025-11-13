/**
 * Video Card Renderer
 * Dynamically creates video cards with hover-to-play functionality
 * Compatible with AI-generated videos from the pipeline
 */

class VideoCardRenderer {
    constructor(container, options = {}) {
        this.container = container;
        this.cards = [];
        this.options = {
            enableSound: options.enableSound || false, // Enable sound on hover
            autoplayFirst: options.autoplayFirst || false, // Autoplay first video
            ...options
        };
        this.currentlyPlaying = null; // Track currently playing video
        this.userInteracted = false; // Track if user has interacted
        
        // Debug log
        console.log('🎬 VideoCardRenderer initialized:', {
            enableSound: this.options.enableSound,
            autoplayFirst: this.options.autoplayFirst
        });
        
        // Listen for any user interaction to enable sound
        if (this.options.enableSound) {
            const enableSound = () => {
                this.userInteracted = true;
                console.log('✅ User interaction detected - sound enabled');
            };
            
            // These events indicate user interaction
            document.addEventListener('click', enableSound, { once: true });
            document.addEventListener('touchstart', enableSound, { once: true });
            document.addEventListener('keydown', enableSound, { once: true });
        }
        
        this.setupHoverEffects();
    }

    /**
     * Render a video card from ad data
     * @param {Object} ad - Ad listing data
     * @param {string} ad.id - Unique ad ID
     * @param {string} ad.title - Ad title
     * @param {string} ad.video_url - Video URL (from R2 or other source)
     * @param {number} ad.price - Price in EUR
     * @param {string} ad.category - Category
     * @param {string} ad.location - Location
     * @param {number} ad.favorites - Favorite count
     * @param {number} ad.views - View count
     */
    renderCard(ad) {
        const card = document.createElement('div');
        card.className = 'video-card bg-white dark:bg-dark-100 rounded-lg overflow-hidden shadow-md dark:shadow-dark-200 hover:shadow-xl transition-shadow cursor-pointer';
        card.dataset.adId = ad.id;
        
        // Generate a unique ID for this video element
        const videoId = `video-${ad.id}`;
        
        card.innerHTML = `
            <!-- Video Container -->
            <div class="relative aspect-[9/16] bg-gray-900 group">
                <!-- Video Element -->
                <video 
                    id="${videoId}"
                    class="w-full h-full object-cover"
                    loop
                    playsinline
                    webkit-playsinline
                    ${this.options.enableSound ? '' : 'muted'}
                    preload="metadata"
                    poster="${ad.thumbnail_url || ad.video_url}"
                    data-src="${ad.video_url}">
                    <source src="${ad.video_url}" type="video/mp4">
                </video>
                
                <!-- Play Icon Overlay (shows on hover, hides when playing) -->
                <div class="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none play-overlay">
                    <div class="bg-white/90 rounded-full p-4 transform scale-90 group-hover:scale-100 transition-transform">
                        <i data-feather="play" class="h-8 w-8 text-indigo-600"></i>
                    </div>
                </div>
                
                <!-- Video Overlay with Info -->
                <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                    <!-- Title and Price -->
                    <h3 class="text-white font-semibold text-lg line-clamp-2 mb-1">${this.escapeHtml(ad.title)}</h3>
                    <p class="text-white/90 text-xl font-bold mb-2">€${ad.price.toLocaleString()}</p>
                    
                    <!-- Meta Info -->
                    <div class="flex items-center gap-2 text-white/80 text-xs mb-3">
                        <span class="capitalize">${this.escapeHtml(ad.category)}</span>
                        <span class="text-white/60">•</span>
                        <span>${this.escapeHtml(ad.location || 'Romania')}</span>
                        ${ad.metadata?.duration ? `
                        <span class="text-white/60">•</span>
                        <span>${ad.metadata.duration}s</span>
                        ` : ''}
                    </div>
                    
                    <!-- Action Buttons -->
                    <div class="flex items-center gap-3">
                        <!-- Like Button -->
                        <button 
                            data-like-btn
                            data-ad-id="${ad.id}"
                            class="flex items-center gap-1 text-white/90 hover:text-indigo-400 transition-colors"
                            onclick="event.stopPropagation();">
                            <i data-feather="thumbs-up" class="h-5 w-5"></i>
                        </button>
                        
                        <!-- Favorite Button -->
                        <button 
                            data-favorite-btn
                            data-ad-id="${ad.id}"
                            data-favorite-count="${ad.favorites || 0}"
                            class="flex items-center gap-1 text-white/90 hover:text-pink-500 transition-colors"
                            onclick="event.stopPropagation();">
                            <i data-feather="heart" class="h-5 w-5"></i>
                            <span data-count-display class="text-sm">${ad.favorites || 0}</span>
                        </button>
                        
                        <!-- Share Button -->
                        <button 
                            data-share-btn
                            data-ad-id="${ad.id}"
                            data-ad-title="${this.escapeHtml(ad.title)}"
                            data-ad-price="€${ad.price}"
                            class="flex items-center gap-1 text-white/90 hover:text-blue-400 transition-colors ml-auto"
                            onclick="event.stopPropagation();">
                            <i data-feather="share-2" class="h-5 w-5"></i>
                        </button>
                    </div>
                </div>
                
                <!-- Views Counter (Top Right) -->
                <div class="absolute top-3 right-3 bg-black/60 rounded-full px-3 py-1 flex items-center gap-1">
                    <i data-feather="eye" class="h-4 w-4 text-white"></i>
                    <span class="text-white text-xs font-medium">${this.formatViews(ad.views || 0)}</span>
                </div>
                
                <!-- AI Generated Badge (if applicable) -->
                ${ad.metadata?.cost ? `
                <div class="absolute top-3 left-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full px-3 py-1 flex items-center gap-1">
                    <i data-feather="zap" class="h-3 w-3 text-white"></i>
                    <span class="text-white text-xs font-medium">AI Generated</span>
                </div>
                ` : ''}
                
                <!-- Sound Indicator (if sound enabled) - Top Right, Auto-fade -->
                ${this.options.enableSound ? `
                <div class="sound-indicator absolute top-3 right-3 bg-black/60 rounded-full p-2 transition-opacity duration-300 cursor-pointer z-10">
                    <i data-feather="volume-2" class="h-5 w-5 text-white volume-on"></i>
                    <i data-feather="volume-x" class="h-5 w-5 text-white volume-off" style="display: none;"></i>
                </div>
                <!-- Tap to Unmute Badge (Mobile) -->
                <div class="tap-to-unmute absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/80 text-white px-6 py-3 rounded-full font-medium flex items-center gap-2 cursor-pointer z-10 transition-opacity duration-300" style="display: none;">
                    <i data-feather="volume-2" class="h-5 w-5"></i>
                    <span>Tap to unmute</span>
                </div>
                ` : ''}
            </div>
        `;
        
        // Replace feather icons
        if (window.feather) {
            window.feather.replace();
        }
        
        // Setup video hover effects
        this.setupVideoHover(card, videoId);
        
        // Add volume toggle and tap-to-unmute for mobile
        if (this.options.enableSound) {
            const soundIndicator = card.querySelector('.sound-indicator');
            const tapToUnmute = card.querySelector('.tap-to-unmute');
            const video = card.querySelector('video');
            
            if (soundIndicator && video) {
                const volumeOn = soundIndicator.querySelector('.volume-on');
                const volumeOff = soundIndicator.querySelector('.volume-off');
                
                // Sound indicator click handler
                soundIndicator.addEventListener('click', (e) => {
                    e.stopPropagation();
                    
                    video.muted = !video.muted;
                    if (volumeOn && volumeOff) {
                        volumeOn.style.display = video.muted ? 'none' : 'block';
                        volumeOff.style.display = video.muted ? 'block' : 'none';
                    }
                    
                    // Hide tap-to-unmute if shown
                    if (tapToUnmute && !video.muted) {
                        tapToUnmute.style.display = 'none';
                    }
                    
                    // Show indicator when toggled, then fade out
                    soundIndicator.style.opacity = '1';
                    setTimeout(() => {
                        soundIndicator.style.opacity = '0';
                    }, 1500);
                    
                    console.log('🔊 Volume toggled:', video.muted ? 'muted' : 'unmuted');
                });
            }
            
            // Tap-to-unmute badge click handler
            if (tapToUnmute && video) {
                tapToUnmute.addEventListener('click', (e) => {
                    e.stopPropagation();
                    video.muted = false;
                    
                    const volumeOn = soundIndicator?.querySelector('.volume-on');
                    const volumeOff = soundIndicator?.querySelector('.volume-off');
                    if (volumeOn && volumeOff) {
                        volumeOn.style.display = 'block';
                        volumeOff.style.display = 'none';
                    }
                    
                    tapToUnmute.style.display = 'none';
                    console.log('🔊 User tapped to unmute');
                });
            }
        }
        
        // Click to navigate to details
        card.addEventListener('click', (e) => {
            // Don't navigate if clicking action buttons, sound indicator, or tap-to-unmute
            if (e.target.closest('[data-like-btn], [data-favorite-btn], [data-share-btn], .sound-indicator, .tap-to-unmute')) {
                return;
            }
            // Navigate to product details page with scroll to description
            window.location.href = `/product/${ad.id}?scroll=description`;
        });
        
        this.cards.push({ element: card, ad, videoId });
        return card;
    }

    /**
     * Setup hover-to-play functionality for a video card
     */
    setupVideoHover(card, videoId) {
        // Use querySelector with attribute selector to avoid issues with dots in IDs
        const video = card.querySelector(`video[id="${videoId}"]`);
        const playOverlay = card.querySelector('.play-overlay');
        
        if (!video) return;
        
        let hoverTimeout;
        let isPlaying = false;
        
        // Lazy load video source
        const loadVideo = () => {
            if (!video.src && video.dataset.src) {
                video.src = video.dataset.src;
                video.load();
            }
        };
        
        // Play video with optional sound
        const playVideo = () => {
            // Pause currently playing video if exists
            if (this.currentlyPlaying && this.currentlyPlaying !== video) {
                this.currentlyPlaying.pause();
                this.currentlyPlaying.currentTime = 0;
            }
            
            // Unmute if sound is enabled
            if (this.options.enableSound) {
                video.muted = false;
            }
            
            video.play().then(() => {
                isPlaying = true;
                this.currentlyPlaying = video;
                if (playOverlay) {
                    playOverlay.style.opacity = '0';
                }
            }).catch(err => {
                console.log('Video play failed (trying muted):', err);
                // Fallback to muted if unmuted fails
                video.muted = true;
                video.play().catch(e => console.log('Even muted play failed:', e));
            });
        };
        
        // Pause video
        const pauseVideo = () => {
            if (isPlaying) {
                video.pause();
                video.currentTime = 0; // Reset to start
                video.muted = !this.options.enableSound; // Reset mute state
                isPlaying = false;
                
                if (this.currentlyPlaying === video) {
                    this.currentlyPlaying = null;
                }
                
                if (playOverlay) {
                    playOverlay.style.opacity = '';
                }
            }
        };
        
        card.addEventListener('mouseenter', () => {
            loadVideo();
            
            // Start playing after brief hover delay (300ms)
            hoverTimeout = setTimeout(() => {
                playVideo();
            }, 300);
        });
        
        card.addEventListener('mouseleave', () => {
            clearTimeout(hoverTimeout);
            pauseVideo();
        });
        
        // Handle video end - loop
        video.addEventListener('ended', () => {
            if (isPlaying) {
                video.currentTime = 0;
                video.play();
            }
        });
        
        // Store pause method for external control
        video._pauseMethod = pauseVideo;
    }

    /**
     * Setup intersection observer for lazy loading
     */
    setupHoverEffects() {
        // Intersection Observer for viewport detection
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const video = entry.target.querySelector('video');
                        if (video && !video.src && video.dataset.src) {
                            // Preload video when in viewport
                            video.src = video.dataset.src;
                            video.load();
                        }
                    }
                });
            }, {
                rootMargin: '50px' // Start loading 50px before entering viewport
            });
            
            // Observe future cards
            this.observer = observer;
        }
    }

    /**
     * Add a card to the container
     */
    addCard(ad) {
        const card = this.renderCard(ad);
        this.container.appendChild(card);
        
        // Observe for lazy loading
        if (this.observer) {
            this.observer.observe(card);
        }
        
        // Refresh engagement buttons
        if (window.videoCardEngagement) {
            window.videoCardEngagement.refreshButtonStates();
        }
        
        return card;
    }

    /**
     * Add multiple cards
     */
    addCards(ads) {
        ads.forEach((ad, index) => {
            const card = this.addCard(ad);
            
            // Autoplay first video if enabled
            if (index === 0 && this.options.autoplayFirst) {
                setTimeout(() => {
                    const video = card.querySelector('video');
                    const soundIndicator = card.querySelector('.sound-indicator');
                    const tapToUnmute = card.querySelector('.tap-to-unmute');
                    
                    if (video) {
                        video.src = video.dataset.src;
                        video.load();
                        
                        // FIRST ATTEMPT: Try with sound (if enabled)
                        video.muted = !this.options.enableSound;
                        
                        console.log('🎬 Autoplay attempt 1:', {
                            muted: video.muted,
                            enableSound: this.options.enableSound
                        });
                        
                        const updateVolumeIndicator = (muted) => {
                            if (soundIndicator) {
                                const volumeOn = soundIndicator.querySelector('.volume-on');
                                const volumeOff = soundIndicator.querySelector('.volume-off');
                                if (volumeOn && volumeOff) {
                                    volumeOn.style.display = muted ? 'none' : 'block';
                                    volumeOff.style.display = muted ? 'block' : 'none';
                                }
                                // Show, then fade out
                                soundIndicator.style.opacity = '1';
                                setTimeout(() => {
                                    soundIndicator.style.opacity = '0';
                                }, 2000);
                            }
                        };
                        
                        const showTapToUnmute = () => {
                            if (tapToUnmute && video.muted) {
                                tapToUnmute.style.display = 'flex';
                                tapToUnmute.style.opacity = '1';
                                setTimeout(() => {
                                    tapToUnmute.style.opacity = '0';
                                    setTimeout(() => {
                                        tapToUnmute.style.display = 'none';
                                    }, 300);
                                }, 3000); // Show for 3 seconds
                            }
                        };
                        
                        video.play().then(() => {
                            this.currentlyPlaying = video;
                            const playOverlay = card.querySelector('.play-overlay');
                            if (playOverlay) {
                                playOverlay.style.opacity = '0';
                            }
                            console.log('✅ Autoplay successful (muted=' + video.muted + ')');
                            updateVolumeIndicator(video.muted);
                            
                            // If muted, show tap-to-unmute badge
                            if (video.muted) {
                                showTapToUnmute();
                            }
                        }).catch(err => {
                            console.log('❌ Autoplay attempt 1 failed:', err.message);
                            
                            // SECOND ATTEMPT: Try muted
                            video.muted = true;
                            console.log('🎬 Autoplay attempt 2: muted');
                            
                            video.play().then(() => {
                                this.currentlyPlaying = video;
                                console.log('✅ Muted autoplay successful');
                                updateVolumeIndicator(true);
                                showTapToUnmute(); // Show tap-to-unmute on mobile
                            }).catch(e => {
                                console.log('❌ Even muted autoplay failed:', e.message);
                            });
                        });
                    }
                }, 500);
            }
        });
    }

    /**
     * Clear all cards
     */
    clear() {
        this.container.innerHTML = '';
        this.cards = [];
    }

    /**
     * Helper: Escape HTML
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Helper: Format view count (1.2K, 1.5M, etc.)
     */
    formatViews(views) {
        if (views >= 1000000) {
            return (views / 1000000).toFixed(1) + 'M';
        } else if (views >= 1000) {
            return (views / 1000).toFixed(1) + 'K';
        }
        return views.toString();
    }
}

// Export for global use
window.VideoCardRenderer = VideoCardRenderer;
