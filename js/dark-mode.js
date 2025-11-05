// Dark mode configuration
const darkModeConfig = {
    init() {
        this.setupTailwindDarkMode();
        this.initTheme();
        this.setupThemeToggle();
    },

    setupTailwindDarkMode() {
        if (window.tailwind && window.tailwind.config) {
            tailwind.config = {
                darkMode: 'class',
                theme: {
                    extend: {
                        colors: {
                            dark: {
                                50: '#18191A',
                                100: '#242526',
                                200: '#3A3B3C',
                                300: '#4E4F50',
                                400: '#6B6C6D',
                                500: '#B0B3B8',
                                600: '#E4E6EB',
                                700: '#F5F6F7'
                            }
                        }
                    }
                }
            };
        }
    },

    initTheme() {
        // Check for saved theme preference or system preference
        const savedTheme = localStorage.getItem('theme');
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && systemTheme)) {
            document.documentElement.classList.add('dark');
            this.updateVantaBackground?.(true);
        } else {
            this.updateVantaBackground?.(false);
        }

        // Add transition class after initial load
        setTimeout(() => {
            document.body.classList.add('dark-mode-transition');
        }, 100);
    },

    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const isDark = document.documentElement.classList.toggle('dark');
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
                this.updateVantaBackground?.(isDark);
            });
        }
    },

    updateVantaBackground(isDark) {
        if (window.VANTA && document.getElementById('vanta-bg')) {
            VANTA.NET({
                el: "#vanta-bg",
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 1.00,
                scaleMobile: 1.00,
                color: 0x6366f1,
                backgroundColor: isDark ? 0x18191A : 0xf8fafc,
                points: 10.00,
                maxDistance: 20.00,
                spacing: 15.00
            });
        }
    }
};

// Initialize dark mode
document.addEventListener('DOMContentLoaded', () => darkModeConfig.init());