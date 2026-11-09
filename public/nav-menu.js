// Menu hambúrguer da barra: partilhado pela página principal e pela marcação.
(() => {
  const bar = document.querySelector('.bar');
  const burger = bar && bar.querySelector('.bar-burger');
  const nav = bar && bar.querySelector('.bar-nav');
  if (!burger || !nav) return;

  const root = document.documentElement;
  const small = matchMedia('(max-width: 720px)');
  const others = [...document.body.children].filter((el) => el !== bar);

  const setOpen = (open) => {
    bar.classList.toggle('menu-open', open);
    root.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    // Com o painel aberto, o teclado e os leitores de ecrã ficam só na barra.
    others.forEach((el) => { el.inert = open; });
  };

  burger.addEventListener('click', () => {
    const open = !bar.classList.contains('menu-open');
    setOpen(open);
    if (open) nav.querySelector('a:not([hidden])')?.focus({ preventScroll: true });
  });

  // Fecha antes de o navegador seguir a ligação, para a página já poder deslizar.
  nav.addEventListener('click', (e) => {
    if (e.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || !bar.classList.contains('menu-open')) return;
    setOpen(false);
    burger.focus();
  });

  small.addEventListener('change', () => setOpen(false));
})();
