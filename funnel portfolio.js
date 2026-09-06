/* Native details elements handle the accordions, even without JavaScript. */
document.querySelectorAll('[data-copy]').forEach((button) => {
  let timer;
  const defaultLabel = button.getAttribute('aria-label');
  button.innerHTML = `
    <svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect width="14" height="14" x="8" y="8" rx="2"></rect>
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
    </svg>
    <svg class="copy-success-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5"></path>
    </svg>
    <span class="copy-status" aria-live="polite">${defaultLabel}</span>`;
  button.addEventListener('click', async () => {
    clearTimeout(timer);
    const label = button.querySelector('.copy-status');
    try {
      if (!navigator.clipboard) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(button.dataset.copy);
      label.textContent = 'Copied';
      button.setAttribute('aria-label', 'Copied');
      button.dataset.state = 'success';
    } catch {
      label.textContent = 'Select to copy';
      button.setAttribute('aria-label', 'Select the text to copy');
      button.dataset.state = 'error';
      const text = button.previousElementSibling;
      const range = document.createRange();
      range.selectNodeContents(text);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
    timer = setTimeout(() => {
      label.textContent = defaultLabel;
      button.setAttribute('aria-label', defaultLabel);
      delete button.dataset.state;
    }, 2200);
  });
});

document.querySelectorAll('.faq-list details').forEach((details) => {
  const summary = details.querySelector('summary');
  const content = details.querySelector('.details-content');

  if (!summary || !content) return;

  summary.addEventListener('click', (event) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (details.dataset.animating === 'true') {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    const opening = !details.open;
    const startHeight = details.offsetHeight;

    if (opening) details.open = true;
    if (!opening) details.dataset.closing = 'true';

    const endHeight = opening
      ? summary.offsetHeight + content.offsetHeight
      : summary.offsetHeight;

    details.dataset.animating = 'true';
    details.style.overflow = 'hidden';

    const panelAnimation = content.animate(
      opening
        ? [
            { opacity: 0, transform: 'translateY(-8px)' },
            { opacity: 1, transform: 'translateY(0)' },
          ]
        : [
            { opacity: 1, transform: 'translateY(0)' },
            { opacity: 0, transform: 'translateY(-6px)' },
          ],
      {
        duration: opening ? 300 : 220,
        easing: 'cubic-bezier(.2, .7, .2, 1)',
        fill: 'both',
      },
    );

    const heightAnimation = details.animate(
      { height: [`${startHeight}px`, `${endHeight}px`] },
      {
        duration: opening ? 320 : 240,
        easing: 'cubic-bezier(.2, .7, .2, 1)',
      },
    );

    heightAnimation.addEventListener('finish', () => {
      if (!opening) details.open = false;
      delete details.dataset.animating;
      delete details.dataset.closing;
      details.style.removeProperty('overflow');
      panelAnimation.cancel();
    }, { once: true });
  });
});
