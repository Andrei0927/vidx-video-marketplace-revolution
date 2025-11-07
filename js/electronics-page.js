import { filterManager } from './filter-manager.js';
import { electronicsListings, electronicsCategories, electronicsConditions } from './electronics-data.js';

const videoGrid = document.getElementById('video-grid');
const noResults = document.getElementById('no-results');
const noResultsResetBtn = document.getElementById('no-results-reset');
const floatingBadge = document.getElementById('floating-badge');
const brandList = document.getElementById('brand-list');
const brandSearch = document.getElementById('brand-search');
const categoryList = document.getElementById('category-list');
const conditionList = document.getElementById('condition-list');
const locationList = document.getElementById('location-list');
const locationSearch = document.getElementById('location-search');
const priceMinInput = document.getElementById('price-min');
const priceMaxInput = document.getElementById('price-max');
const priceApplyBtn = document.getElementById('price-apply');
const priceResetBtn = document.getElementById('price-reset');
const resetFiltersBtn = document.getElementById('reset-filters');
const categoryMenu = document.getElementById('category-filter-menu');
const conditionMenu = document.getElementById('condition-filter-menu');
const brandMenu = document.getElementById('brand-filter-menu');
const priceMenu = document.getElementById('price-filter-menu');
const locationMenu = document.getElementById('location-filter-menu');

const listingMap = new Map();
let cleanupVideoHandlers = [];
let brandSearchTerm = '';
let locationSearchTerm = '';

const escapeHtml = (value) => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const formatPrice = (value) => `€${Number(value).toLocaleString('en-US')}`;

const applyFeatherIcons = () => {
    if (window.feather && typeof window.feather.replace === 'function') {
        window.feather.replace();
    }
};

const updateFilterBadges = (filters) => {
    const count = Object.entries(filters).reduce((total, [key, value]) => {
        if (key === 'priceRange' || key === 'yearRange') {
            const range = value || {};
            return total + (range.min !== null && range.min !== undefined || range.max !== null && range.max !== undefined ? 1 : 0);
        }

        if (Array.isArray(value)) {
            return total + (value.length > 0 ? 1 : 0);
        }

        return total + (value ? 1 : 0);
    }, 0);

    const headerBadge = document.getElementById('filter-badge');

    if (headerBadge) {
        if (count > 0) {
            headerBadge.textContent = `${count} filter${count > 1 ? 's' : ''}`;
            headerBadge.classList.remove('hidden');
        } else {
            headerBadge.classList.add('hidden');
        }
    }

    if (floatingBadge) {
        if (count > 0) {
            floatingBadge.textContent = String(count);
            floatingBadge.classList.remove('hidden');
        } else {
            floatingBadge.classList.add('hidden');
        }
    }
};

const computeBrandStats = () => {
    const buckets = new Map();
    electronicsListings.forEach(listing => {
        buckets.set(listing.make, (buckets.get(listing.make) || 0) + 1);
    });

    return Array.from(buckets.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
};

const computeCategoryStats = () => {
    const buckets = new Map();
    electronicsListings.forEach(listing => {
        buckets.set(listing.type, (buckets.get(listing.type) || 0) + 1);
    });

    electronicsCategories.forEach(category => {
        if (!buckets.has(category)) {
            buckets.set(category, 0);
        }
    });

    return Array.from(buckets.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
};

const computeLocationStats = () => {
    const buckets = new Map();
    electronicsListings.forEach(listing => {
        buckets.set(listing.location, (buckets.get(listing.location) || 0) + 1);
    });

    return Array.from(buckets.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
};

const brandStats = computeBrandStats();
const categoryStats = computeCategoryStats();
const locationStats = computeLocationStats();

const renderBrandOptions = () => {
    if (!brandList) return;

    const active = new Set(filterManager.filters.make || []);
    const items = brandStats.filter(item => item.name.toLowerCase().includes(brandSearchTerm));

    brandList.innerHTML = items.map(({ name, count }) => (
        `<label class="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-dark-200 cursor-pointer">
            <input type="checkbox" value="${escapeHtml(name)}" class="rounded text-indigo-600 dark:text-indigo-400" ${active.has(name) ? 'checked' : ''}>
            <span class="ml-2 text-gray-700 dark:text-dark-500">${escapeHtml(name)}</span>
            <span class="ml-auto text-gray-500 dark:text-dark-400 text-sm">${count}</span>
        </label>`
    )).join('');

    brandList.querySelectorAll('input[type="checkbox"]').forEach(input => {
        input.addEventListener('change', () => {
            const selected = Array.from(brandList.querySelectorAll('input[type="checkbox"]:checked'))
                .map(el => el.value);
            filterManager.setFilter('make', selected);
        });
    });
};

const renderCategoryOptions = () => {
    if (!categoryList) return;

    const active = new Set(filterManager.filters.type || []);
    categoryList.innerHTML = categoryStats.map(({ name, count }) => (
        `<label class="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-dark-200 cursor-pointer">
            <input type="checkbox" value="${escapeHtml(name)}" class="rounded text-indigo-600 dark:text-indigo-400" ${active.has(name) ? 'checked' : ''}>
            <span class="ml-2 text-gray-700 dark:text-dark-500">${escapeHtml(name)}</span>
            <span class="ml-auto text-gray-500 dark:text-dark-400 text-sm">${count}</span>
        </label>`
    )).join('');

    categoryList.querySelectorAll('input[type="checkbox"]').forEach(input => {
        input.addEventListener('change', () => {
            const selected = Array.from(categoryList.querySelectorAll('input[type="checkbox"]:checked'))
                .map(el => el.value);
            filterManager.setFilter('type', selected);
        });
    });
};

const renderConditionOptions = () => {
    if (!conditionList) return;

    const active = new Set(filterManager.filters.condition || []);
    conditionList.innerHTML = electronicsConditions.map(condition => (
        `<label class="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-dark-200 cursor-pointer">
            <input type="checkbox" value="${escapeHtml(condition)}" class="rounded text-indigo-600 dark:text-indigo-400" ${active.has(condition) ? 'checked' : ''}>
            <span class="ml-2 text-gray-700 dark:text-dark-500">${escapeHtml(condition)}</span>
        </label>`
    )).join('');

    conditionList.querySelectorAll('input[type="checkbox"]').forEach(input => {
        input.addEventListener('change', () => {
            const selected = Array.from(conditionList.querySelectorAll('input[type="checkbox"]:checked'))
                .map(el => el.value);
            filterManager.setFilter('condition', selected);
        });
    });
};

const renderLocationOptions = () => {
    if (!locationList) return;

    const active = filterManager.filters.location || null;
    const items = locationStats.filter(item => item.name.toLowerCase().includes(locationSearchTerm));

    const anyOption = `<label class="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-dark-200 cursor-pointer">
        <input type="radio" name="location-filter" value="" class="text-indigo-600" ${active ? '' : 'checked'}>
        <span class="ml-2 text-gray-700 dark:text-dark-500">Any location</span>
    </label>`;

    const optionsMarkup = items.map(({ name, count }) => (
        `<label class="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-dark-200 cursor-pointer">
            <input type="radio" name="location-filter" value="${escapeHtml(name)}" class="text-indigo-600" ${active === name ? 'checked' : ''}>
            <span class="ml-2 text-gray-700 dark:text-dark-500">${escapeHtml(name)}</span>
            <span class="ml-auto text-gray-500 dark:text-dark-400 text-sm">${count}</span>
        </label>`
    )).join('');

    locationList.innerHTML = anyOption + optionsMarkup;

    locationList.querySelectorAll('input[type="radio"]').forEach(input => {
        input.addEventListener('change', () => {
            const value = input.value;
            filterManager.setFilter('location', value || null);
        });
    });
};

const syncPriceInputs = (filters) => {
    if (priceMinInput instanceof HTMLInputElement) {
        priceMinInput.value = filters.priceRange.min !== null && filters.priceRange.min !== undefined ? String(filters.priceRange.min) : '';
    }
    if (priceMaxInput instanceof HTMLInputElement) {
        priceMaxInput.value = filters.priceRange.max !== null && filters.priceRange.max !== undefined ? String(filters.priceRange.max) : '';
    }
};

const refreshFilterInputs = () => {
    renderBrandOptions();
    renderCategoryOptions();
    renderConditionOptions();
    renderLocationOptions();
    syncPriceInputs(filterManager.filters);
};

const registerServiceWorker = () => {
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('/service-worker.js').catch(error => console.error('Service Worker registration failed:', error));
};

const setupFilterMenus = () => {
    const buttons = Array.from(document.querySelectorAll('[id$="-filter-btn"]'))
        .filter(btn => btn.id !== 'vertical-filter-btn');
    const menus = [brandMenu, categoryMenu, conditionMenu, priceMenu, locationMenu];

    const closeAll = (exception) => {
        menus.forEach(menu => {
            if (!menu) return;
            if (exception && menu === exception) return;
            menu.classList.add('hidden');
            menu.style.display = 'none';
        });
    };

    buttons.forEach(btn => {
        btn.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();

            const menuId = btn.id.replace('-btn', '-menu');
            const menu = document.getElementById(menuId);
            if (!menu) return;

            const shouldOpen = menu.classList.contains('hidden') || getComputedStyle(menu).display === 'none';
            closeAll(menu);

            if (shouldOpen) {
                menu.classList.remove('hidden');
                menu.style.display = 'block';
            } else {
                menu.classList.add('hidden');
                menu.style.display = 'none';
            }
        });
    });

    menus.forEach(menu => {
        if (!menu) return;
        menu.classList.add('hidden');
        menu.style.display = 'none';
        menu.addEventListener('click', event => event.stopPropagation());
    });

    document.addEventListener('click', () => closeAll());
};

const renderListings = () => {
    if (!videoGrid) return;

    const markup = electronicsListings.map(listing => {
        listingMap.set(listing.id, listing);
        return `
            <div class="video-card" data-listing-id="${escapeHtml(listing.id)}" data-details-url="${escapeHtml(listing.detailsUrl)}">
                <video loop playsinline preload="auto">
                    <source src="${escapeHtml(listing.videoUrl)}" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div class="volume-indicator">
                    <i data-feather="volume-x" class="h-5 w-5 text-white volume-off"></i>
                    <i data-feather="volume-2" class="h-5 w-5 text-white volume-on" style="display: none;"></i>
                </div>
                <div class="video-overlay">
                    <div class="flex items-center mb-3">
                        <img class="h-10 w-10 rounded-full" src="${escapeHtml(listing.seller.avatar)}" alt="${escapeHtml(listing.seller.name)}">
                        <div class="ml-3">
                            <h3 class="text-white font-medium">${escapeHtml(listing.seller.name)}</h3>
                            <p class="text-gray-300 text-sm">${escapeHtml(listing.seller.posted)} · ${escapeHtml(listing.seller.location)}</p>
                        </div>
                    </div>
                    <a href="${escapeHtml(listing.detailsUrl)}" class="block group">
                        <h2 class="text-lg font-bold text-white group-hover:text-indigo-400 transition">${escapeHtml(listing.title)}</h2>
                    </a>
                    <p class="mt-1 text-gray-300 text-sm">${escapeHtml(listing.specs)}</p>
                    <div class="mt-3 flex items-center justify-between">
                        <span class="text-xl font-bold text-white">${formatPrice(listing.price)}</span>
                        <div class="flex space-x-3">
                            <button class="flex items-center text-white group">
                                <i data-feather="heart" class="h-5 w-5 group-hover:text-pink-500 transition"></i>
                                <span class="ml-1 text-sm">${escapeHtml(listing.likes)}</span>
                            </button>
                            <button class="flex items-center text-white group">
                                <i data-feather="message-square" class="h-5 w-5 group-hover:text-blue-500 transition"></i>
                                <span class="ml-1 text-sm">${escapeHtml(listing.comments)}</span>
                            </button>
                            <button class="flex items-center text-white group">
                                <i data-feather="share-2" class="h-5 w-5 group-hover:text-green-500 transition"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>`;
    }).join('');

    videoGrid.innerHTML = markup;
};

const initVideos = () => {
    cleanupVideoHandlers.forEach(cleanup => cleanup());
    cleanupVideoHandlers = [];

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 1024;
    const cards = document.querySelectorAll('[data-listing-id]');

    cards.forEach((card, index) => {
        const video = card.querySelector('video');
        const volumeIndicator = card.querySelector('.volume-indicator');
        const detailsUrl = card.dataset.detailsUrl;
        if (!video || !volumeIndicator) return;

        const volumeOff = volumeIndicator.querySelector('.volume-off');
        const volumeOn = volumeIndicator.querySelector('.volume-on');
        let volumeTimeout;
        let userMutedPreference = true;

        const updateVolumeIcon = (muted) => {
            if (!volumeOff || !volumeOn) return;
            volumeOff.style.display = muted ? 'block' : 'none';
            volumeOn.style.display = muted ? 'none' : 'block';
        };

        const flashVolumeIndicator = () => {
            volumeIndicator.classList.remove('fade-out');
            if (volumeTimeout) window.clearTimeout(volumeTimeout);
            volumeTimeout = window.setTimeout(() => {
                volumeIndicator.classList.add('fade-out');
            }, 1500);
        };

        const ensureFirstFrame = () => {
            video.muted = true;
            video.setAttribute('playsinline', '');
            video.setAttribute('webkit-playsinline', '');
            const playPromise = video.play();
            if (playPromise && typeof playPromise.then === 'function') {
                playPromise.then(() => {
                    window.setTimeout(() => {
                        if (!isMobile || index !== 0) {
                            video.pause();
                            video.currentTime = 0;
                        }
                    }, 120);
                }).catch(() => {
                    video.currentTime = 0.1;
                });
            }
        };

        if (video.readyState >= 2) {
            ensureFirstFrame();
        } else {
            video.addEventListener('loadeddata', ensureFirstFrame, { once: true });
        }

        const applyMuteState = (muted) => {
            video.muted = muted;
            userMutedPreference = muted;
            updateVolumeIcon(muted);
            flashVolumeIndicator();
        };

        const toggleAudio = () => {
            applyMuteState(!video.muted);
            if (!video.muted && video.paused) {
                video.play().catch(() => applyMuteState(true));
            }
        };

        if (isMobile) {
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && entry.intersectionRatio >= 0.75) {
                        video.muted = userMutedPreference;
                        video.play().then(() => {
                            updateVolumeIcon(video.muted);
                            flashVolumeIndicator();
                        }).catch(() => {
                            applyMuteState(true);
                        });
                    } else {
                        video.pause();
                        video.currentTime = 0;
                    }
                });
            }, { threshold: [0.75] });

            observer.observe(card);
            cleanupVideoHandlers.push(() => observer.disconnect());
        } else {
            const onMouseEnter = () => {
                video.muted = userMutedPreference;
                video.play().then(() => {
                    updateVolumeIcon(video.muted);
                    flashVolumeIndicator();
                }).catch(() => applyMuteState(true));
            };

            const onMouseLeave = () => {
                video.pause();
                video.currentTime = 0;
                flashVolumeIndicator();
            };

            card.addEventListener('mouseenter', onMouseEnter);
            card.addEventListener('mouseleave', onMouseLeave);
            cleanupVideoHandlers.push(() => {
                card.removeEventListener('mouseenter', onMouseEnter);
                card.removeEventListener('mouseleave', onMouseLeave);
            });
        }

        volumeIndicator.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();
            toggleAudio();
        });

        if (detailsUrl) {
            card.addEventListener('click', event => {
                if (event.target.closest('a, button, .volume-indicator')) return;
                try {
                    sessionStorage.setItem('detailsScrollTarget', 'description');
                } catch (error) {
                    console.warn('Unable to persist details preference', error);
                }
                window.location.href = detailsUrl;
            });
        }

        updateVolumeIcon(video.muted);
        window.setTimeout(() => volumeIndicator.classList.add('fade-out'), 2000);
    });
};

const applyFilters = (filters) => {
    const cards = document.querySelectorAll('[data-listing-id]');
    let visibleCount = 0;

    cards.forEach(card => {
        const listing = listingMap.get(card.dataset.listingId || '');
        if (!listing) return;
        const matches = filterManager.isVideoMatching(listing);
        card.style.display = matches ? '' : 'none';
        if (matches) visibleCount += 1;
    });

    const showNoResults = visibleCount === 0;
    if (noResults) noResults.classList.toggle('hidden', !showNoResults);
    if (videoGrid) videoGrid.classList.toggle('hidden', showNoResults);

    updateFilterBadges(filters);

    if (showNoResults) {
        applyFeatherIcons();
    }
};

const applySavedFilters = () => {
    const saved = localStorage.getItem('electronicsFilters');
    if (!saved) return;

    try {
        const parsed = JSON.parse(saved);
        if (parsed.make) filterManager.setFilter('make', parsed.make);
        if (parsed.type) filterManager.setFilter('type', parsed.type);
        if (parsed.condition) filterManager.setFilter('condition', parsed.condition);
        if (parsed.priceRange) filterManager.setFilter('priceRange', parsed.priceRange);
        if (Object.prototype.hasOwnProperty.call(parsed, 'location')) {
            filterManager.setFilter('location', parsed.location);
        }
    } catch (error) {
        console.error('Failed to apply saved filters', error);
    } finally {
        localStorage.removeItem('electronicsFilters');
    }
};

const setupPriceFilter = () => {
    if (priceApplyBtn) {
        priceApplyBtn.addEventListener('click', event => {
            event.preventDefault();
            const min = priceMinInput instanceof HTMLInputElement && priceMinInput.value ? Number(priceMinInput.value) : null;
            const max = priceMaxInput instanceof HTMLInputElement && priceMaxInput.value ? Number(priceMaxInput.value) : null;
            filterManager.setFilter('priceRange', { min, max });
            if (priceMenu) {
                priceMenu.classList.add('hidden');
                priceMenu.style.display = 'none';
            }
        });
    }

    if (priceResetBtn) {
        priceResetBtn.addEventListener('click', event => {
            event.preventDefault();
            if (priceMinInput instanceof HTMLInputElement) priceMinInput.value = '';
            if (priceMaxInput instanceof HTMLInputElement) priceMaxInput.value = '';
            filterManager.setFilter('priceRange', { min: null, max: null });
        });
    }
};

const setupLocationSearch = () => {
    if (!locationSearch) return;

    locationSearch.addEventListener('input', () => {
        locationSearchTerm = locationSearch.value.trim().toLowerCase();
        renderLocationOptions();
    });
};

const setupBrandSearch = () => {
    if (!brandSearch) return;

    brandSearch.addEventListener('input', () => {
        brandSearchTerm = brandSearch.value.trim().toLowerCase();
        renderBrandOptions();
    });
};

const setupGlobalReset = () => {
    const handleReset = () => {
        filterManager.resetFilters();
        brandSearchTerm = '';
        locationSearchTerm = '';
        if (brandSearch instanceof HTMLInputElement) brandSearch.value = '';
        if (locationSearch instanceof HTMLInputElement) locationSearch.value = '';
        refreshFilterInputs();
    };

    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', event => {
            event.preventDefault();
            handleReset();
        });
    }

    if (noResultsResetBtn) {
        noResultsResetBtn.addEventListener('click', event => {
            event.preventDefault();
            handleReset();
        });
    }
};

const setupThemeToggle = () => {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        applyFeatherIcons();
    });
};

const bindUserButton = () => {
    const userBtn = document.getElementById('user-btn');
    if (!userBtn) return;

    userBtn.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();

        const authToken = localStorage.getItem('authToken');
        const sessionToken = localStorage.getItem('sessionToken');

        if (!authToken && !sessionToken) {
            const authModal = document.createElement('auth-modal');
            document.body.appendChild(authModal);
            return;
        }

        if (!customElements.get('user-dropdown')) {
            import('../components/user-dropdown.js').catch(() => {});
        }

        const dropdown = document.createElement('user-dropdown');
        const rect = userBtn.getBoundingClientRect();
        dropdown.style.position = 'fixed';
        dropdown.style.top = `${rect.bottom + window.scrollY}px`;
        dropdown.style.right = `${window.innerWidth - rect.right}px`;
        document.body.appendChild(dropdown);
    });
};

const updateNavAuthUI = () => {
    const avatarUrl = localStorage.getItem('userAvatar');
    const username = localStorage.getItem('userName');
    const sessionToken = localStorage.getItem('sessionToken') || localStorage.getItem('authToken');
    const avatarEl = document.getElementById('nav-avatar');
    const nameEl = document.getElementById('nav-username');
    const userBtn = document.getElementById('user-btn');
    const iconSvg = userBtn ? userBtn.querySelector('svg') : null;

    if (sessionToken && avatarUrl && avatarEl instanceof HTMLImageElement) {
        avatarEl.src = avatarUrl;
        avatarEl.classList.remove('hidden');
        if (iconSvg) iconSvg.classList.add('hidden');
    } else if (avatarEl instanceof HTMLImageElement) {
        avatarEl.classList.add('hidden');
        if (iconSvg) iconSvg.classList.remove('hidden');
    }

    if (sessionToken && username && nameEl) {
        nameEl.textContent = username;
        nameEl.classList.remove('hidden');
    } else if (nameEl) {
        nameEl.classList.add('hidden');
    }
};

const init = () => {
    if (!videoGrid) return;

    filterManager.resetFilters();

    renderListings();
    setupFilterMenus();
    setupBrandSearch();
    setupLocationSearch();
    setupPriceFilter();
    setupGlobalReset();
    setupThemeToggle();
    bindUserButton();
    updateNavAuthUI();

    const unsubscribe = filterManager.subscribe(filters => {
        applyFilters(filters);
    });

    refreshFilterInputs();
    applyFeatherIcons();
    window.setTimeout(applyFeatherIcons, 100);
    initVideos();
    applySavedFilters();
    refreshFilterInputs();
    applyFilters(filterManager.filters);

    window.addEventListener('load', registerServiceWorker, { once: true });
    window.addEventListener('beforeunload', unsubscribe);
};

document.addEventListener('DOMContentLoaded', init);
