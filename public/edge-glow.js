// Brilho na borda da página: segue o ponteiro. Partilhado pela página principal e pela marcação.
(() => {
  const glow = document.getElementById('edgeGlow');
  if (!glow) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  document.addEventListener('pointermove', (e) => {
    glow.style.setProperty('--x', `${e.clientX}px`);
    glow.style.setProperty('--y', `${e.clientY}px`);
    glow.classList.add('on');
  }, { passive: true });
  document.documentElement.addEventListener('mouseleave', () => glow.classList.remove('on'));

  // Dentro de um iframe a página deixa de receber o ponteiro: apaga em vez de ficar parado.
  document.addEventListener('pointerover', (e) => {
    if (e.target.tagName === 'IFRAME') glow.classList.remove('on');
  }, { passive: true });
})();
