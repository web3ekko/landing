const signalNetworkPopovers = document.querySelectorAll('[data-signal-network-popover]');

for (const panel of signalNetworkPopovers) {
  if (!(panel instanceof HTMLElement) || typeof panel.hidePopover !== 'function') continue;

  const button = document.querySelector(`[popovertarget="${panel.id}"]`);
  if (!(button instanceof HTMLButtonElement)) continue;

  const isMobileMenu = panel.id === 'signal-network-mobile-menu';
  const syncState = () => {
    const isOpen = panel.matches(':popover-open');
    button.setAttribute('aria-expanded', String(isOpen));
    if (isMobileMenu) {
      button.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    }
    if (isOpen) {
      requestAnimationFrame(() => panel.querySelector('a')?.focus());
    }
  };

  panel.addEventListener('toggle', syncState);
  panel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (panel.matches(':popover-open')) panel.hidePopover();
    });
  });
  syncState();
}

const legacyMobileMenuButton = document.getElementById('mobile-menu-button');
const legacyMobileMenu = document.getElementById('mobile-menu');

const closeLegacyMobileMenu = (restoreFocus = false) => {
  if (!legacyMobileMenu || legacyMobileMenu.classList.contains('hidden')) return;
  legacyMobileMenu.classList.add('hidden');
  legacyMobileMenuButton?.setAttribute('aria-expanded', 'false');
  if (restoreFocus) legacyMobileMenuButton?.focus();
};

legacyMobileMenuButton?.addEventListener('click', () => {
  legacyMobileMenu?.classList.toggle('hidden');
  const isExpanded = !legacyMobileMenu?.classList.contains('hidden');
  legacyMobileMenuButton.setAttribute('aria-expanded', String(isExpanded));
});

legacyMobileMenu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => closeLegacyMobileMenu(false));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && legacyMobileMenu && !legacyMobileMenu.classList.contains('hidden')) {
    event.preventDefault();
    closeLegacyMobileMenu(true);
  }
});
