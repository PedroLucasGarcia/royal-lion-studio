'use strict';
// Trabalhos: os cartões espalham-se, formam uma linha e um círculo à volta do título;
// o scroll abre o círculo num arco que percorre as fotos. O scroll da página nunca é retido.
(function () {
  const MORPH_END = 0.22;
  const TO_LINE_MS = 300;
  const TO_CIRCLE_MS = 1500;
  const INTRO_END_MS = 2700;
  const SVG_NS = 'http://www.w3.org/2000/svg';

  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const rad = (d) => (d * Math.PI) / 180;
  const deg = (r) => (r * 180) / Math.PI;

  function spring(s, key, velKey, target, k, d, dt) {
    s[velKey] += (k * (target - s[key]) - d * s[velKey]) * dt;
    s[key] += s[velKey] * dt;
    if (Math.abs(target - s[key]) < 0.01 && Math.abs(s[velKey]) < 0.01) {
      s[key] = target;
      s[velKey] = 0;
      return true;
    }
    return false;
  }

  function makeViewer() {
    const dialog = document.createElement('dialog');
    dialog.className = 'works-view';
    const img = document.createElement('img');
    img.alt = '';
    const close = document.createElement('button');
    close.className = 'works-close';
    close.type = 'button';
    close.setAttribute('aria-label', 'Fechar');
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', 'ico');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', 'M5 5l14 14M19 5 5 19');
    svg.append(path);
    close.append(svg);
    dialog.append(img, close);
    close.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
    document.body.append(dialog);
    return (photo) => {
      img.src = photo.src;
      img.alt = photo.alt;
      dialog.showModal();
    };
  }

  function makeCard(photo, isOriginal, openLabel, view) {
    const face = document.createElement('span');
    face.className = 'work-face work-front';
    const img = document.createElement('img');
    img.alt = '';
    img.decoding = 'async';
    face.append(img);

    if (!photo) {
      const box = document.createElement('div');
      box.className = 'work-card';
      box.setAttribute('aria-hidden', 'true');
      const flip = document.createElement('span');
      flip.className = 'work-flip';
      img.className = 'work-star';
      flip.append(face);
      box.append(flip);
      return { node: box, img, src: '/img/asterisk.png' };
    }

    const btn = document.createElement('button');
    btn.className = 'work-card';
    btn.type = 'button';
    btn.setAttribute('aria-label', `${openLabel}: ${photo.alt}`);
    if (!isOriginal) {
      btn.setAttribute('aria-hidden', 'true');
      btn.tabIndex = -1;
    }
    const flip = document.createElement('span');
    flip.className = 'work-flip';
    const back = document.createElement('span');
    back.className = 'work-face work-back';
    back.textContent = openLabel;
    flip.append(face, back);
    btn.append(flip);
    btn.addEventListener('click', () => view(photo));
    return { node: btn, img, src: photo.src };
  }

  window.mountWorks = function mountWorks({ section, stage, layer, head, title, text, bar, dock, images, openLabel }) {
    const n = images.length
      ? Math.min(36, Math.max(images.length, window.innerWidth < 700 ? 14 : 24))
      : (window.innerWidth < 700 ? 14 : 24);
    const view = images.length ? makeViewer() : null;

    const cards = [];
    for (let i = 0; i < n; i += 1) {
      const photo = images.length ? images[i % images.length] : null;
      const card = makeCard(photo, i < images.length, openLabel, view);
      Object.assign(card, {
        i,
        rx: Math.random(), ry: Math.random(), rr: Math.random(),
        x: 0, y: 0, r: 0, s: 0.6, o: 0,
        vx: 0, vy: 0, vr: 0, vs: 0, vo: 0,
      });
      cards.push(card);
    }
    layer.append(...cards.map((c) => c.node));

    let w = 0; let h = 0; let cardW = 0; let cardH = 0; let circleR = 0; let circleS = 0.3;
    let stepPx = 0; let stepAng = 0; let arcR = 0; let cStart = 0; let cEnd = 0;
    let headFrom = 0; let headTo = 0; let apexY = 0;

    function measure() {
      w = stage.clientWidth;
      h = stage.clientHeight;
      const narrow = w < 700;
      cardH = clamp(h * (narrow ? 0.3 : 0.34), 180, 320);
      cardW = cardH * 0.71;
      layer.style.setProperty('--card-w', `${cardW}px`);
      layer.style.setProperty('--card-h', `${cardH}px`);
      circleR = Math.min(Math.min(w, h) * 0.35, 350);
      circleS = Math.min(0.5, ((2 * Math.PI * circleR) / n) * 0.8 / cardW);
      stepPx = cardW + (narrow ? 12 : 16);
      arcR = Math.min(w, h * 1.5) * (narrow ? 1.4 : 1.1);
      stepAng = 2 * Math.asin(Math.min(1, stepPx / (2 * arcR)));
      // o arco começa e acaba cheio: o centro nunca chega às pontas da fila
      const halfVisible = Math.ceil(w / 2 / stepPx);
      cStart = Math.min(halfVisible, (n - 1) / 2);
      cEnd = Math.max(n - 1 - halfVisible, (n - 1) / 2);
      headFrom = h / 2 - title.offsetHeight / 2;
      headTo = bar.offsetHeight + 16;
      const headBottom = headTo + head.offsetHeight;
      const floor = h - dock.offsetHeight;
      apexY = Math.max((headBottom + floor) / 2, headBottom + cardH / 2 + 24);
    }

    function progress() {
      const rect = section.getBoundingClientRect();
      return clamp(-rect.top / Math.max(1, rect.height - stage.offsetHeight));
    }

    const morph = { x: 0, v: 0 };
    const spin = { x: 0, v: 0 };
    const mouse = { x: 0, v: 0 };
    let mouseTarget = 0;
    let phase = 'scatter';
    let introDone = false;
    let near = false;
    let started = false;
    let raf = 0;
    let last = 0;
    let focusT = null;

    function targetOf(c, m, t, out) {
      if (phase === 'scatter') {
        out.x = w / 2 + (c.rx - 0.5) * w * 1.5;
        out.y = h / 2 + (c.ry - 0.5) * h * 1.5;
        out.r = (c.rr - 0.5) * 180;
        out.s = 0.6;
        out.o = 0;
        return;
      }
      if (phase === 'line') {
        out.x = w / 2 + (c.i - (n - 1) / 2) * (cardW * circleS + 8);
        out.y = h / 2;
        out.r = 0;
        out.s = circleS;
        out.o = 1;
        return;
      }
      const angle = -90 + (c.i / n) * 360;
      let cr = angle + 90;
      if (cr > 180) cr -= 360;
      const circleX = w / 2 + circleR * Math.cos(rad(angle));
      const circleY = h / 2 + circleR * Math.sin(rad(angle));
      const theta = (c.i - lerp(cStart, cEnd, t)) * stepAng;
      const arcX = w / 2 + arcR * Math.sin(theta) + mouse.x;
      const arcY = apexY + arcR * (1 - Math.cos(theta));
      out.x = lerp(circleX, arcX, m);
      out.y = lerp(circleY, arcY, m);
      out.r = lerp(cr, deg(theta), m);
      out.s = lerp(circleS, 1, m);
      out.o = 1;
    }

    const paint = (c) => {
      c.node.style.transform = `translate3d(${(c.x - cardW / 2).toFixed(2)}px,${(c.y - cardH / 2).toFixed(2)}px,0) rotate(${c.r.toFixed(2)}deg) scale(${c.s.toFixed(4)})`;
      c.node.style.opacity = c.o.toFixed(3);
    };

    function paintHead(m) {
      head.style.transform = `translate3d(0,${lerp(headFrom, headTo, m).toFixed(2)}px,0)`;
      text.style.opacity = clamp((m - 0.6) / 0.4).toFixed(3);
      stage.classList.toggle('is-open', m > 0.5);
    }

    function frame(now) {
      raf = 0;
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      const p = progress();
      let settled = spring(morph, 'x', 'v', clamp(p / MORPH_END), 60, 20, dt);
      const spinTarget = focusT !== null ? focusT : clamp((p - MORPH_END) / (1 - MORPH_END));
      settled = spring(spin, 'x', 'v', spinTarget, 60, 20, dt) && settled;
      settled = spring(mouse, 'x', 'v', mouseTarget, 30, 20, dt) && settled;

      const k = introDone ? 180 : 70;
      const d = introDone ? 27 : 16;
      const out = {};
      for (const c of cards) {
        targetOf(c, morph.x, spin.x, out);
        settled = spring(c, 'x', 'vx', out.x, k, d, dt) && settled;
        settled = spring(c, 'y', 'vy', out.y, k, d, dt) && settled;
        settled = spring(c, 'r', 'vr', out.r, k, d, dt) && settled;
        settled = spring(c, 's', 'vs', out.s, k, d, dt) && settled;
        settled = spring(c, 'o', 'vo', out.o, k, d, dt) && settled;
        paint(c);
      }
      paintHead(morph.x);
      if (!settled && near) raf = requestAnimationFrame(frame);
    }

    function wake() {
      if (raf || !near) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }

    function snapToScroll() {
      phase = 'circle';
      introDone = true;
      stage.classList.add('is-circle');
      const p = progress();
      morph.x = clamp(p / MORPH_END);
      spin.x = clamp((p - MORPH_END) / (1 - MORPH_END));
      const out = {};
      for (const c of cards) {
        targetOf(c, morph.x, spin.x, out);
        Object.assign(c, { x: out.x, y: out.y, r: out.r, s: out.s, o: out.o });
        paint(c);
      }
      paintHead(morph.x);
    }

    function start() {
      if (started) return;
      started = true;
      if (progress() > 0.05) { snapToScroll(); return; }
      // o título aparece só no círculo, para a linha não lhe passar por cima
      const setPhase = (next) => { phase = next; wake(); };
      setTimeout(() => setPhase('line'), TO_LINE_MS);
      setTimeout(() => { stage.classList.add('is-circle'); setPhase('circle'); }, TO_CIRCLE_MS);
      setTimeout(() => { introDone = true; wake(); }, INTRO_END_MS);
      wake();
    }

    measure();
    const seed = {};
    for (const c of cards) {
      targetOf(c, 0, 0, seed);
      Object.assign(c, { x: seed.x, y: seed.y, r: seed.r, s: seed.s, o: seed.o });
      paint(c);
    }
    paintHead(0);

    new IntersectionObserver(([e]) => {
      near = e.isIntersecting;
      if (near) {
        for (const c of cards) {
          if (!c.img.src) c.img.src = c.src;
        }
        wake();
      }
    }, { rootMargin: '100% 0px' }).observe(section);

    new IntersectionObserver(([e]) => { if (e.isIntersecting) start(); }, { threshold: 0.4 }).observe(stage);

    window.addEventListener('scroll', wake, { passive: true });
    new ResizeObserver(() => { measure(); wake(); }).observe(stage);

    if (window.matchMedia('(pointer: fine)').matches) {
      stage.addEventListener('pointermove', (e) => {
        mouseTarget = (e.clientX / w - 0.5) * 200;
        wake();
      });
      stage.addEventListener('pointerleave', () => { mouseTarget = 0; wake(); });
    }

    // quem navega por teclado leva o cartão focado ao centro do arco
    layer.addEventListener('focusin', (e) => {
      const node = e.target.closest('button.work-card');
      if (!node || !node.matches(':focus-visible')) return;
      const card = cards.find((c) => c.node === node);
      const span = cEnd - cStart;
      // sem limitar: as originais ficam antes do início do percurso de scroll
      focusT = span > 0 ? (card.i - cStart) / span : 0;
      const p = clamp(progress(), MORPH_END, 1);
      const top = section.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top + p * (section.offsetHeight - stage.offsetHeight), behavior: 'instant' });
      wake();
    });
    layer.addEventListener('focusout', () => { focusT = null; wake(); });
  };
})();
