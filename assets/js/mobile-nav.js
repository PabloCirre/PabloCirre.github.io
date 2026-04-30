/**
 * Mobile Navigation - Hamburger Menu Toggle
 */

function toggleMobileMenu() {
    const hamburger = document.querySelector('.hamburger-btn');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (hamburger && mobileMenu) {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    }
}

// Create mobile menu dynamically from existing nav
document.addEventListener('DOMContentLoaded', function () {
    const nav = document.querySelector('.main-header nav');
    if (!nav) return;

    // Create mobile menu container
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';

    // Clone nav links
    const links = nav.querySelectorAll('a');
    links.forEach(link => {
        const mobileLink = link.cloneNode(true);
        mobileLink.addEventListener('click', () => {
            toggleMobileMenu();
        });
        mobileMenu.appendChild(mobileLink);
    });

    // Insert after hamburger button
    const hamburger = document.querySelector('.hamburger-btn');
    if (hamburger) {
        hamburger.after(mobileMenu);
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        const hamburger = document.querySelector('.hamburger-btn');
        const mobileMenu = document.querySelector('.mobile-menu');

        if (hamburger && mobileMenu &&
            !hamburger.contains(e.target) &&
            !mobileMenu.contains(e.target) &&
            mobileMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    });

    console.log('%c 📱 Mobile Navigation: READY ',
        'background: #ff5533; color: #fff; font-family: monospace; padding: 5px;');
});

/**
 * Mobile Navigation v2 - grouped drawer built from the desktop navigation.
 * Registered after the legacy builder so it replaces the flat cloned menu.
 */

function toggleMobileMenu(forceOpen) {
    const hamburger = document.querySelector('.hamburger-btn');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (!hamburger || !mobileMenu) return;

    const shouldOpen = typeof forceOpen === 'boolean'
        ? forceOpen
        : !mobileMenu.classList.contains('active');

    hamburger.classList.toggle('active', shouldOpen);
    hamburger.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
    mobileMenu.classList.toggle('active', shouldOpen);
    document.body.classList.toggle('mobile-menu-open', shouldOpen);
}

function directAnchor(element) {
    return Array.from(element.children).find((child) => child.tagName === 'A') || null;
}

function cleanLabel(anchor) {
    const navText = anchor.querySelector('.nav-text');
    const raw = navText ? navText.textContent : anchor.textContent;
    return raw.replace(/\s+/g, ' ').trim();
}

function cloneMobileLink(anchor, className) {
    const clone = anchor.cloneNode(true);
    clone.querySelectorAll('.nav-caret').forEach((caret) => caret.remove());
    if (className) {
        clone.className = className + (anchor.classList.contains('active') ? ' active' : '');
    }
    if (className === 'mobile-menu__primary' && anchor.dataset.mobileLabel) {
        clone.textContent = anchor.dataset.mobileLabel;
    }
    clone.removeAttribute('style');
    clone.addEventListener('click', () => toggleMobileMenu(false));
    return clone;
}

function buildMobileGroup(dropdown) {
    const trigger = directAnchor(dropdown);
    if (!trigger) return null;

    const details = document.createElement('details');
    details.className = 'mobile-menu__group';
    if (trigger.classList.contains('active')) {
        details.open = true;
    }

    const summary = document.createElement('summary');
    summary.textContent = cleanLabel(trigger);
    details.appendChild(summary);

    const body = document.createElement('div');
    body.className = 'mobile-menu__group-body';
    body.appendChild(cloneMobileLink(trigger, 'mobile-menu__primary'));

    dropdown.querySelectorAll('.mega-menu > a, .nav-dropdown-menu > a').forEach((link) => {
        body.appendChild(cloneMobileLink(link));
    });

    details.appendChild(body);
    return details;
}

document.addEventListener('DOMContentLoaded', function () {
    const nav = document.querySelector('.main-header nav');
    const hamburger = document.querySelector('.hamburger-btn');
    if (!nav || !hamburger) return;

    const existing = document.querySelector('.mobile-menu');
    if (existing) existing.remove();

    const mobileMenu = document.createElement('div');
    mobileMenu.id = 'mobile-menu';
    mobileMenu.className = 'mobile-menu';

    const panel = document.createElement('div');
    panel.className = 'mobile-menu__panel';

    const logoLink = document.querySelector('.logo a');
    if (logoLink) {
        panel.appendChild(cloneMobileLink(logoLink, 'mobile-menu__home'));
    }

    Array.from(nav.children).forEach((child) => {
        if (child.classList && child.classList.contains('nav-item-dropdown')) {
            const group = buildMobileGroup(child);
            if (group) panel.appendChild(group);
            return;
        }

        if (child.classList && child.classList.contains('language-switcher')) {
            const language = child.cloneNode(true);
            language.classList.add('mobile-menu__language');
            language.querySelectorAll('a').forEach((link) => {
                link.addEventListener('click', () => toggleMobileMenu(false));
            });
            panel.appendChild(language);
            return;
        }

        if (child.tagName === 'A') {
            panel.appendChild(cloneMobileLink(child, 'mobile-menu__link'));
        }
    });

    mobileMenu.appendChild(panel);
    hamburger.after(mobileMenu);

    mobileMenu.addEventListener('click', (event) => {
        if (event.target === mobileMenu) {
            toggleMobileMenu(false);
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            toggleMobileMenu(false);
        }
    });
});
