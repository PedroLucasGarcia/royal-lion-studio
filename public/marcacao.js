// A mesma entrada da equipa: o título desce, o resto sobe. Só o script esconde, por isso sem ele tudo fica visível.
if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add('in');
      io.unobserve(e.target);
      setTimeout(() => { e.target.style.transitionDelay = ''; }, 1200);
    }
  }, { threshold: 0.15 });

  document.querySelector('.book-head').classList.add('rv-down');
  document.querySelector('.book-help').style.transitionDelay = '.1s';
  document.querySelectorAll('[data-rise]').forEach((el) => {
    el.classList.add('rv');
    io.observe(el);
  });
}
