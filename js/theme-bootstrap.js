/**
 * Theme Bootstrap - Initialize dark mode on page load
 * This file should be loaded BEFORE other scripts that depend on theme
 * 
 * Usage: Add to <head> of HTML file:
 * <script src="/js/theme-bootstrap.js"></script>
 * 
 * This replaces the duplicate inline theme scripts in every HTML file
 */

(function() {
    'use strict';
    
    const THEME_STORAGE_KEY = 'theme';
    const DARK_CLASS = 'dark';
    
    // Get stored theme or default to dark
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    
    // Apply theme immediately to prevent flash
    if (storedTheme === 'light') {
        document.documentElement.classList.remove(DARK_CLASS);
    } else {
        // Default to dark mode
        document.documentElement.classList.add(DARK_CLASS);
    }
    
    console.log('[ThemeBootstrap] Theme applied:', storedTheme || 'dark (default)');
})();
