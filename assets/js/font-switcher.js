/**
 * Font Switcher - Arrow keys to change header font
 * Use < > or , . keys to cycle through fonts
 */

const fontSwitcher = {
    fonts: [
        { name: 'Plus Jakarta Sans', family: "'Plus Jakarta Sans', sans-serif" },
        { name: 'Space Grotesk', family: "'Space Grotesk', sans-serif" },
        { name: 'Inter', family: "'Inter', sans-serif" },
        { name: 'Outfit', family: "'Outfit', sans-serif" },
        { name: 'Syne', family: "'Syne', sans-serif" },
        { name: 'Bricolage Grotesque', family: "'Bricolage Grotesque', sans-serif" },
        { name: 'Unbounded', family: "'Unbounded', cursive" },
        { name: 'Bebas Neue', family: "'Bebas Neue', cursive" },
        { name: 'Abril Fatface', family: "'Abril Fatface', serif" },
        { name: 'Playfair Display', family: "'Playfair Display', serif" },
        { name: 'IBM Plex Mono', family: "'IBM Plex Mono', monospace" }
    ],
    currentIndex: 0,
    indicator: null,
    hideTimeout: null,

    init() {
        this.createIndicator();
        this.bindKeys();
        // Apply default font silently (no indicator)
        this.applyFontSilent(0);
        console.log('%c 🔤 Font Switcher: Use < > keys to change header font ',
            'background: #ff5533; color: #fff; font-family: monospace; padding: 5px;');
    },

    createIndicator() {
        this.indicator = document.createElement('div');
        this.indicator.id = 'font-indicator';
        this.indicator.style.cssText = `
            position: fixed;
            top: 90px;
            left: 40px;
            background: transparent;
            padding: 0;
            font-family: 'IBM Plex Mono', monospace;
            font-size: 0.75rem;
            color: var(--indicator-color, #00ffcc);
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
            letter-spacing: 1px;
        `;
        document.body.appendChild(this.indicator);
    },

    showIndicator(fontName) {
        this.indicator.textContent = `FONT: ${fontName}`;
        this.indicator.style.opacity = '1';
        clearTimeout(this.hideTimeout);
        this.hideTimeout = setTimeout(() => {
            this.indicator.style.opacity = '0';
        }, 1500);
    },

    // Apply font without showing indicator (for initial load)
    applyFontSilent(index) {
        const logo = document.querySelector('.logo');
        if (logo) {
            const font = this.fonts[index];
            logo.style.fontFamily = font.family;
        }
    },

    // Apply font with indicator (for user interaction)
    applyFont(index) {
        const logo = document.querySelector('.logo');
        if (logo) {
            const font = this.fonts[index];
            logo.style.fontFamily = font.family;
            this.showIndicator(font.name);
            console.log(`%c → Font: ${font.name}`, 'color: #00ffcc; font-family: monospace;');
        }
    },

    bindKeys() {
        document.addEventListener('keydown', (e) => {
            // Only trigger if not focused on input
            if (document.activeElement.tagName === 'INPUT' ||
                document.activeElement.tagName === 'TEXTAREA') return;

            // < key (comma with shift, or just comma)
            if (e.key === '<' || e.key === ',') {
                this.currentIndex = (this.currentIndex - 1 + this.fonts.length) % this.fonts.length;
                this.applyFont(this.currentIndex);
            }
            // > key (period with shift, or just period)
            else if (e.key === '>' || e.key === '.') {
                this.currentIndex = (this.currentIndex + 1) % this.fonts.length;
                this.applyFont(this.currentIndex);
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', () => fontSwitcher.init());
