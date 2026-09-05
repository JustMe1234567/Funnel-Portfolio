/* Native details elements handle the accordions, even without JavaScript. */
document.querySelectorAll('[data-copy]').forEach((button) => {
  let timer;
  button.addEventListener('click', async () => {
    clearTimeout(timer);
    const label = button.querySelector('span');
    try {
      if (!navigator.clipboard) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(button.dataset.copy);
      label.textContent = 'Copied';
      button.dataset.state = 'success';
    } catch {
      label.textContent = 'Select to copy';
      button.dataset.state = 'error';
      const text = button.previousElementSibling;
      const range = document.createRange();
      range.selectNodeContents(text);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
    timer = setTimeout(() => {
      label.textContent = 'Copy';
      delete button.dataset.state;
    }, 2200);
  });
});
