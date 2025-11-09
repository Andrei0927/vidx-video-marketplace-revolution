/**
 * Centralized Feather Icons Manager
 * 
 * Consolidates all feather.replace() calls into a single batched system
 * using requestAnimationFrame for optimal performance.
 * 
 * Usage:
 *   - Automatically runs on DOMContentLoaded
 *   - Call window.replaceFeatherIcons() after dynamically adding content
 *   - Debounced to prevent excessive re-renders
 */

(function() {
    let replaceScheduled = false;
    let lastReplaceTime = 0;
    const DEBOUNCE_MS = 50; // Minimum time between replacements

    /**
     * Batched icon replacement using requestAnimationFrame
     * Multiple calls within same frame are deduplicated
     */
    window.replaceFeatherIcons = function() {
        // Skip if already scheduled
        if (replaceScheduled) {
            return;
        }

        // Check if feather library is loaded
        if (!window.feather) {
            console.warn('[Icons] Feather library not loaded yet');
            return;
        }

        const now = Date.now();
        const timeSinceLastReplace = now - lastReplaceTime;

        // Debounce to prevent excessive replacements
        if (timeSinceLastReplace < DEBOUNCE_MS) {
            setTimeout(() => {
                replaceScheduled = false;
                window.replaceFeatherIcons();
            }, DEBOUNCE_MS - timeSinceLastReplace);
            return;
        }

        replaceScheduled = true;
        
        requestAnimationFrame(() => {
            try {
                feather.replace();
                lastReplaceTime = Date.now();
            } catch (error) {
                console.error('[Icons] Error replacing feather icons:', error);
            } finally {
                replaceScheduled = false;
            }
        });
    };

    /**
     * Initialize on DOM ready
     */
    function initializeIcons() {
        if (window.feather) {
            window.replaceFeatherIcons();
        } else {
            // Wait for feather to load
            const checkFeather = setInterval(() => {
                if (window.feather) {
                    clearInterval(checkFeather);
                    window.replaceFeatherIcons();
                }
            }, 100);

            // Timeout after 5 seconds
            setTimeout(() => {
                clearInterval(checkFeather);
                if (!window.feather) {
                    console.error('[Icons] Feather library failed to load');
                }
            }, 5000);
        }
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeIcons);
    } else {
        initializeIcons();
    }

    /**
     * Observer for dynamically added content
     * Automatically replaces icons when new elements are added
     */
    const observer = new MutationObserver((mutations) => {
        let shouldReplace = false;

        for (const mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Check if any added nodes contain feather icons
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) { // Element node
                        if (node.querySelector && (
                            node.querySelector('[data-feather]') ||
                            node.hasAttribute?.('data-feather')
                        )) {
                            shouldReplace = true;
                            break;
                        }
                    }
                }
            }
            if (shouldReplace) break;
        }

        if (shouldReplace) {
            window.replaceFeatherIcons();
        }
    });

    // Start observing after DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    } else {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
})();
