'use strict';
(async function () {
  const $ = (id) => document.getElementById(id);
  const ARROW = 'M4 12h15M13 6l6 6-6 6';
  const PLUS = 'M12 4v16M4 12h16';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let C = JSON.parse($('content-data').textContent || '{}');
  if (!C.hero) {
    try { C = await (await fetch('/api/content')).json(); } catch { return; }
  }

  const read = (path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), C);

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function icon(d) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'ico');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', d);
    svg.append(p);
    return svg;
  }

  // ---------- texto e imagens editáveis ----------
  document.querySelectorAll('[data-c]').forEach((n) => {
    const v = read(n.dataset.c);
    if (typeof v === 'string') n.textContent = v;
  });
  document.querySelectorAll('[data-c-src]').forEach((n) => {
    const v = read(n.dataset.cSrc);
    if (n.id === 'heroPortrait' && v === '') { n.hidden = true; return; }
    if (typeof v === 'string' && v && n.getAttribute('src') !== v) {
      n.removeAttribute('srcset');
      n.removeAttribute('sizes');
      n.src = v;
    }
  });
  document.querySelectorAll('[data-c-alt]').forEach((n) => {
    const v = read(n.dataset.cAlt);
    if (typeof v === 'string') n.alt = v;
  });

  // a última palavra do lema leva o sublinhado no telemóvel
  const heroTag = document.querySelector('.h-tag');
  const heroTagText = heroTag.textContent.trim();
  const heroTagCut = heroTagText.search(/\S+$/);
  if (heroTagCut > 0) heroTag.replaceChildren(heroTagText.slice(0, heroTagCut), el('span', 'h-tag-last', heroTagText.slice(heroTagCut)));

  const heroList = $('heroServices');
  heroList.replaceChildren(...(C.hero.services || []).map((s) => el('li', '', s)));

  // ---------- portas homens / mulheres ----------
  const DOORS = ['homens', 'mulheres'];
  $('doorsRow').append(...DOORS.map((key) => {
    const d = C.doors[key];
    const door = el('article', `door ${key === 'homens' ? 'door-h' : 'door-m'}`);
    door.append(el('h3', 'door-word', d.word), el('p', 'door-text', d.text));
    const ul = el('ul', 'door-list');
    for (const s of d.services || []) {
      const li = el('li');
      li.append(el('span', '', s.name));
      if (s.price) li.append(el('span', 'price', s.price));
      ul.append(li);
    }
    const cta = el('a', 'btn btn-ghost door-cta');
    cta.href = '#agendar';
    cta.dataset.book = '';
    cta.append(el('span', '', d.cta), icon(ARROW));
    door.append(ul, cta);
    return door;
  }));

  // ---------- equipa ----------
  // um nome entre parênteses retos é um marcador por preencher, não uma pessoa
  const isReal = (s) => Boolean(s) && !String(s).startsWith('[');
  const members = (C.team.members || []).filter((m) => m.photo || m.name || m.role);
  if (C.team.visible === false || !members.length) {
    $('equipa').hidden = true;
    document.querySelectorAll('[data-nav="team"]').forEach((n) => { n.hidden = true; });
  } else {
    $('teamPeople').append(...members.map((m) => {
      const f = el('figure', 'member');
      const name = isReal(m.name) ? m.name : '';
      const role = isReal(m.role) ? m.role : '';
      if (m.photo) {
        const img = el('img');
        img.src = m.photo;
        img.alt = name ? `Retrato de ${name}` : `Retrato da equipa da Royal Lion Studio${role ? `: ${role}` : ''}`;
        img.loading = 'lazy';
        f.append(img);
      } else {
        // lugar à espera da fotografia
        const empty = el('div', 'member-empty');
        const star = el('img');
        star.src = '/img/asterisk.png';
        star.alt = '';
        star.loading = 'lazy';
        empty.append(star);
        f.append(empty);
      }
      if (name || role) {
        const cap = el('figcaption');
        if (name) cap.append(el('p', 'member-name', name));
        if (role) cap.append(el('p', name ? 'member-role' : 'member-name', role));
        f.append(cap);
      }
      return f;
    }));
  }

  // ---------- trabalhos ----------
  // sem fotos, a secção mostra lugares à espera; nunca imagens que não sejam da casa
  const WORK_ALT = 'Trabalho da Royal Lion Studio';
  const images = (C.gallery.images || []).filter((g) => g.src);
  if (C.gallery.visible !== false) {
    const section = $('trabalhos');
    section.hidden = false;
    section.classList.toggle('is-empty', !images.length);
    const line = images.length ? C.gallery.text : C.gallery.pending;
    if (isReal(line)) {
      $('galleryText').textContent = line;
      $('galleryText').hidden = false;
    }
    let animated = false;
    if (!reduceMotion && typeof window.mountWorks === 'function') {
      try {
        window.mountWorks({
          section, stage: $('worksStage'), layer: $('worksCards'), head: $('worksHead'), title: $('galleryTitle'),
          text: $('galleryText'), bar: $('bar'), dock: $('dock'),
          images: images.map((g) => ({ src: g.src, alt: g.alt || WORK_ALT })),
          openLabel: C.gallery.open || 'Ver foto',
        });
        animated = true;
      } catch { /* fica a grelha simples */ }
    }
    if (!animated) {
      section.classList.add('is-static');
      $('galleryGrid').append(...images.map((g) => {
        const img = el('img');
        img.src = g.src;
        img.alt = g.alt || WORK_ALT;
        img.loading = 'lazy';
        return img;
      }));
    }
  } else {
    document.querySelectorAll('[data-nav="works"]').forEach((n) => { n.hidden = true; });
  }

  // ---------- opiniões: só aparecem com conteúdo ----------
  const quotes = (C.testimonials.items || []).filter((q) => q.text);
  if (C.testimonials.visible !== false && quotes.length) {
    $('opinioes').hidden = false;
    $('quotesList').append(...quotes.map((q) => {
      const b = el('blockquote', 'quote');
      b.append(el('p', '', q.text));
      if (q.name) b.append(el('footer', '', q.name));
      return b;
    }));
  }

  // ---------- perguntas ----------
  const faqs = (C.faq.items || []).filter((f) => f.q);
  if (C.faq.visible === false || !faqs.length) {
    $('perguntas').hidden = true;
  } else {
    $('faqList').append(...faqs.map((f) => {
      const d = el('details');
      const s = el('summary');
      s.append(el('span', '', f.q), icon(PLUS));
      d.append(s, el('p', '', f.a));
      return d;
    }));
  }

  // ---------- contacto ----------
  const contact = C.contact;
  if (contact.mapsUrl) $('mapsLink').href = contact.mapsUrl; else $('mapsLink').hidden = true;
  if (/^https:\/\/www\.google\.com\/maps/i.test(contact.mapEmbed || '')) {
    // o mapa do Google só carrega quando o cartão abre
    const box = $('mapBox');
    const frame = $('mapFrame');
    const face = $('mapFace');
    const close = $('mapClose');
    const DRAW_MS = reduceMotion ? 0 : 900;
    let loaded = false;
    let openedAt = 0;
    let timer = 0;
    const reveal = () => {
      clearTimeout(timer);
      if (!loaded || box.dataset.open !== 'true') return;
      timer = setTimeout(() => { box.dataset.ready = 'true'; }, Math.max(0, DRAW_MS - (performance.now() - openedAt)));
    };
    frame.addEventListener('load', () => { if (frame.getAttribute('src')) { loaded = true; reveal(); } });
    const setOpen = (open) => {
      clearTimeout(timer);
      box.dataset.open = String(open);
      face.setAttribute('aria-expanded', String(open));
      face.inert = open;
      if (open) {
        openedAt = performance.now();
        box.style.setProperty('--rx', '0deg');
        box.style.setProperty('--ry', '0deg');
        if (!frame.getAttribute('src')) frame.src = contact.mapEmbed;
        reveal();
        close.focus({ preventScroll: true });
        setTimeout(() => box.scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' }), reduceMotion ? 0 : 560);
      } else {
        delete box.dataset.ready;
        face.focus({ preventScroll: true });
      }
    };
    face.addEventListener('click', () => setOpen(true));
    close.addEventListener('click', () => setOpen(false));
    box.addEventListener('keydown', (e) => { if (e.key === 'Escape' && box.dataset.open === 'true') setOpen(false); });
    if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
      box.addEventListener('pointermove', (e) => {
        if (box.dataset.open === 'true') return;
        const r = box.getBoundingClientRect();
        box.style.setProperty('--ry', (((e.clientX - r.left) / r.width - .5) * 8).toFixed(2) + 'deg');
        box.style.setProperty('--rx', ((.5 - (e.clientY - r.top) / r.height) * 8).toFixed(2) + 'deg');
      });
      box.addEventListener('pointerleave', () => {
        box.style.setProperty('--rx', '0deg');
        box.style.setProperty('--ry', '0deg');
      });
    }
    box.hidden = false;
  }
  const reach = [];
  const phoneDigits = (s) => String(s || '').replace(/[^\d+]/g, '');
  if (contact.phone) {
    const digits = phoneDigits(contact.phone);
    reach.push({ href: 'tel:' + (/^\d{9}$/.test(digits) ? '+351' + digits : digits), label: contact.phone });
  }
  if (contact.email) reach.push({ href: 'mailto:' + contact.email, label: contact.email });
  if (contact.whatsapp) reach.push({ href: 'https://wa.me/' + phoneDigits(contact.whatsapp).replace('+', ''), label: 'WhatsApp' });
  if (contact.instagram) {
    const handle = contact.instagram.replace(/^.*instagram\.com\//, '').replace(/^@/, '').replace(/\/.*$/, '');
    reach.push({ href: 'https://instagram.com/' + handle, label: '@' + handle });
  }
  const external = (a, href) => {
    if (!/^(tel|mailto):/.test(href)) { a.target = '_blank'; a.rel = 'noopener'; }
  };
  // sem contacto preenchido, aparece o aviso do painel; vazio ou entre [ ], nada aparece
  const reachList = reach.length
    ? reach.map(({ href, label }) => {
      const li = el('li');
      const a = el('a', '', label);
      a.href = href;
      external(a, href);
      li.append(a);
      return li;
    })
    : isReal(contact.reachPlaceholder) ? [el('li', 'is-placeholder', contact.reachPlaceholder)] : [];
  $('contactReach').hidden = !reachList.length;
  $('reachList').append(...reachList);

  // ---------- marcação ----------
  const STEP_ICONS = [
    'M6 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM6 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM20 4 8.12 15.88M14.47 14.48 20 20M8.12 8.12 12 12',
    'M8 2v4M16 2v4M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2ZM3 10h18',
    'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM12 6v6l4 2',
  ];
  const steps = (C.booking.steps || []).filter((s) => s.title);
  $('bookSteps').hidden = !steps.length;
  $('bookStepsList').append(...steps.map((s, i) => {
    const li = el('li');
    const tile = el('span', 'step-ico');
    tile.append(icon(STEP_ICONS[i % STEP_ICONS.length]));
    const body = el('div');
    body.append(el('p', 'step-name', `${String(i + 1).padStart(2, '0')} — ${s.title}`));
    if (s.text) body.append(el('p', 'step-text', s.text));
    li.append(tile, body);
    return li;
  }));

  // sem página de marcação, os botões ficam nos cartões de localização e marcação
  const bookUrl = C.booking.pageUrl || '';
  if (/^(\/(?!\/)|https:\/\/)/i.test(bookUrl)) {
    document.querySelectorAll('[data-book]').forEach((a) => { a.href = bookUrl; });
  }

  // ---------- rodapé ----------
  if (/^https:\/\//i.test(C.nav.complaintsUrl || '')) $('complaintsLink').href = C.nav.complaintsUrl;

  // ---------- palavra líquida no hero ----------
  // qualquer falha deixa a imagem original, que já lá está
  if (!reduceMotion && C.hero.image === '/img/hero-word.webp' && typeof window.mountLiquidWord === 'function') {
    window.mountLiquidWord($('heroPlate')).catch(() => {});
  }

  // ---------- doca ----------
  const dock = $('dock');
  let pastHero = false;
  let inBook = false;
  const syncDock = () => dock.classList.toggle('on', pastHero && !inBook);
  new IntersectionObserver(([e]) => {
    pastHero = !e.isIntersecting;
    syncDock();
  }, { rootMargin: '-40% 0px 0px 0px' }).observe($('inicio'));
  new IntersectionObserver(([e]) => { inBook = e.isIntersecting; syncDock(); }).observe($('agendar'));

  // ---------- entrada das secções, a mesma da equipa ----------
  // o título desce, o conteúdo sobe em sequência
  // só o script esconde, por isso sem ele tudo fica visível
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('in');
        io.unobserve(e.target);
        // o atraso é só da entrada: sem isto, o hover dos cartões ficava atrasado
        setTimeout(() => { e.target.style.transitionDelay = ''; }, 1200);
      }
    }, { threshold: 0.15 });
    const riseHead = (selector) => document.querySelectorAll(selector).forEach((h) => {
      h.classList.add('rv', 'rv-down');
      io.observe(h);
    });
    const riseItems = (selector) => document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('rv');
      // limitado, para os últimos de uma lista longa não chegarem tarde
      el.style.transitionDelay = `${Math.min(i, 5) * 0.1}s`;
      io.observe(el);
    });
    riseHead('.doors-head, #teamHead, #quotesTitle, .faq-head');
    riseItems('#doorsRow .door');
    riseItems('#teamPeople .member');
    riseItems('#quotesList .quote');
    riseItems('#agendar .panel');
    riseItems('#faqList details');
    riseItems('.foot');
    // a galeria animada já tem a sua própria entrada: isto é só para a versão estática
    riseHead('.works.is-static .works-head');
    riseItems('.works.is-static #galleryGrid > *');

    // o pincel do hero pinta-se quando aparece
    const wipeIo = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('wipe');
        wipeIo.unobserve(e.target);
      }
    }, { threshold: 0.6 });
    document.querySelectorAll('.brush').forEach((b) => wipeIo.observe(b));
  }

})();
