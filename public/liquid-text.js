// Palavra STUDIO do hero, desenhada em WebGL2 como matéria viscosa.
// As letras saem de um campo de distância; uma gota segue o cursor e funde-se com elas.
// Sem WebGL2, ou se algo falhar, a imagem original do hero mantém-se visível.
(() => {
  'use strict';

  const INF = 1e20;
  const PLATE_W = 2880;
  const CAP_TOP = 184;
  const BASELINE = 691.5;
  const INK_LEFT = 147;
  const INK_RIGHT = 2735;
  const BAND = 0.52; // a palavra vive só na parte de cima da placa
  const LETTERS = [
    ['S', 147, 542], ['T', 581, 995], ['U', 1058, 1481],
    ['D', 1573, 1979], ['I', 2060, 2195], ['O', 2277, 2734],
  ];
  const TRAIL = 8;
  const VISCOSITY = 0.55;

  const VERT = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0., 1.); }`;

  const FRAG = `#version 300 es
precision highp float;
precision highp sampler2D;
uniform sampler2D uSdf;
uniform vec2 uSize;
uniform float uDpr, uCanvasH;
uniform vec4 uBlob[${TRAIL}];
uniform vec2 uWarp[${TRAIL}];
uniform float uSigma, uBevel, uSpec, uShade;
uniform vec3 uInk, uHi;
out vec4 outColor;

float smin(float a, float b, float k) {
  float h = max(k - abs(a - b), 0.) / k;
  return min(a, b) - h * h * k * .25;
}
float glyph(vec2 p, float soft) {
  vec2 t = texture(uSdf, p / uSize).rg;
  return mix(t.r, t.g, soft);
}
float field(vec2 p, float soft) {
  vec2 warp = vec2(0.);
  float wsum = 0.;
  for (int i = 0; i < ${TRAIL}; i++) {
    vec2 d = p - uBlob[i].xy;
    float g = exp(-dot(d, d) / (uSigma * uSigma));
    warp += uWarp[i] * g;
    wsum += g;
  }
  warp /= max(1., wsum);
  float f = glyph(p - warp, soft);
  for (int i = 0; i < ${TRAIL}; i++) {
    float r = uBlob[i].z;
    if (r < .05) continue;
    float b = length(p - uBlob[i].xy) - r;
    f = smin(f, b, r * 1.45);
  }
  return f;
}
void main() {
  vec2 p = vec2(gl_FragCoord.x, uCanvasH - gl_FragCoord.y) / uDpr;
  float f = field(p, 0.);
  float fw = max(fwidth(f), 1e-4);
  float alpha = clamp(.5 - f / fw, 0., 1.);
  if (alpha <= 0.) { outColor = vec4(0.); return; }

  const float e = 1.;
  vec2 grad = vec2(
    field(p + vec2(e, 0.), 1.) - field(p - vec2(e, 0.), 1.),
    field(p + vec2(0., e), 1.) - field(p - vec2(0., e), 1.)
  ) / (2. * e);
  float fs = field(p, 1.);
  float gl = length(grad);
  vec2 n2 = gl > 1e-4 ? grad / gl : vec2(0.);
  float s = 1. - clamp(-min(fs, f + .5) / uBevel, 0., 1.);
  s = pow(s, 1.6);
  vec3 N = normalize(vec3(n2 * s, sqrt(max(0., 1. - s * s))));
  vec3 L = normalize(vec3(-.45, -.7, .62));
  float diff = clamp(dot(N, L), 0., 1.);
  vec3 H = normalize(L + vec3(0., 0., 1.));
  float spec = pow(max(dot(N, H), 0.), 48.);

  float near = 0.;
  for (int i = 0; i < ${TRAIL}; i++) {
    vec2 d = p - uBlob[i].xy;
    near += exp(-dot(d, d) / (uSigma * uSigma * 4.)) * clamp(uBlob[i].z * 8. / uSigma, 0., 1.);
  }
  float lit = mix(.35, 1., clamp(near, 0., 1.));
  vec3 shaded = uInk * mix(1. - uShade, 1., clamp(diff / L.z, 0., 1.));
  vec3 col = mix(uInk, shaded, lit) + uHi * spec * uSpec * lit;
  outColor = vec4(min(col, vec3(1.)) * alpha, alpha);
}`;

  // ---------- campo de distância ----------
  function edt1d(grid, offset, stride, length, f, v, z) {
    v[0] = 0; z[0] = -INF; z[1] = INF; f[0] = grid[offset];
    for (let q = 1, k = 0, s = 0; q < length; q++) {
      f[q] = grid[offset + q * stride];
      const q2 = q * q;
      do {
        const r = v[k];
        s = (f[q] - f[r] + q2 - r * r) / (q - r) / 2;
      } while (s <= z[k] && --k > -1);
      k++;
      v[k] = q; z[k] = s; z[k + 1] = INF;
    }
    for (let q = 0, k = 0; q < length; q++) {
      while (z[k + 1] < q) k++;
      const r = v[k];
      const qr = q - r;
      grid[offset + q * stride] = f[r] + qr * qr;
    }
  }

  function edt(grid, w, h, f, v, z) {
    for (let x = 0; x < w; x++) edt1d(grid, x, w, h, f, v, z);
    for (let y = 0; y < h; y++) edt1d(grid, y * w, 1, w, f, v, z);
  }

  function boxBlur(src, dst, len, lines, r, step, stride) {
    const span = 2 * r + 1;
    for (let line = 0; line < lines; line++) {
      const base = line * stride;
      let acc = 0;
      for (let k = -r; k <= r; k++) acc += src[base + Math.min(len - 1, Math.max(0, k)) * step];
      for (let i = 0; i < len; i++) {
        dst[base + i * step] = acc / span;
        const out = Math.max(0, i - r);
        const inn = Math.min(len - 1, i + r + 1);
        acc += src[base + inn * step] - src[base + out * step];
      }
    }
  }

  function buildField(width, bandH) {
    const scale = Math.min(1, 1400 / width);
    const w = Math.ceil(width * scale);
    const h = Math.ceil(bandH * scale);
    const raster = document.createElement('canvas');
    raster.width = w; raster.height = h;
    const ctx = raster.getContext('2d', { willReadFrequently: true });

    ctx.font = '900 100px "Roboto"';
    const capRatio = (ctx.measureText('T').actualBoundingBoxAscent || 71.1) / 100;
    const k = (width / PLATE_W) * scale;
    const fontPx = ((BASELINE - CAP_TOP) * k) / capRatio;
    const baseline = BASELINE * k;
    ctx.font = `900 ${fontPx}px "Roboto"`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#fff';
    for (const [ch, x0, x1] of LETTERS) {
      const m = ctx.measureText(ch);
      const inkW = m.actualBoundingBoxLeft + m.actualBoundingBoxRight;
      ctx.save();
      ctx.translate(x0 * k, baseline);
      ctx.scale(((x1 - x0) * k) / inkW, 1);
      ctx.fillText(ch, m.actualBoundingBoxLeft, 0);
      ctx.restore();
    }

    const pixels = ctx.getImageData(0, 0, w, h).data;
    const outer = new Float64Array(w * h);
    const inner = new Float64Array(w * h);
    for (let i = 0; i < w * h; i++) {
      const a = pixels[i * 4 + 3] / 255;
      if (a >= 1) { outer[i] = 0; inner[i] = INF; }
      else if (a <= 0) { outer[i] = INF; inner[i] = 0; }
      else {
        const d = 0.5 - a;
        outer[i] = d > 0 ? d * d : 0;
        inner[i] = d < 0 ? d * d : 0;
      }
    }
    const len = Math.max(w, h);
    const f = new Float64Array(len);
    const v = new Uint32Array(len);
    const z = new Float64Array(len + 1);
    edt(outer, w, h, f, v, z);
    edt(inner, w, h, f, v, z);

    const data = new Float32Array(w * h);
    for (let i = 0; i < w * h; i++) data[i] = (Math.sqrt(outer[i]) - Math.sqrt(inner[i])) / scale;

    const fontSize = fontPx / scale;
    const soft = data.slice();
    const tmp = new Float32Array(w * h);
    const radius = Math.max(1, Math.round(fontSize * 0.035 * scale));
    for (let p = 0; p < 3; p++) {
      boxBlur(soft, tmp, w, h, radius, 1, w);
      boxBlur(tmp, soft, h, w, radius, w, 1);
    }
    const packed = new Float32Array(w * h * 2);
    for (let i = 0; i < w * h; i++) { packed[i * 2] = data[i]; packed[i * 2 + 1] = soft[i]; }
    return { w, h, scale, data, packed, fontSize };
  }

  function sampleField(field, x, y) {
    const fx = Math.min(field.w - 1, Math.max(0, Math.round(x * field.scale)));
    const fy = Math.min(field.h - 1, Math.max(0, Math.round(y * field.scale)));
    return field.data[fy * field.w + fx];
  }

  function nearestInside(field, x, y, inset) {
    let px = x;
    let py = y;
    for (let i = 0; i < 10; i++) {
      const d = sampleField(field, px, py) + inset;
      if (Math.abs(d) < 0.5) break;
      const e = 1.5;
      const gx = sampleField(field, px + e, py) - sampleField(field, px - e, py);
      const gy = sampleField(field, px, py + e) - sampleField(field, px, py - e);
      const gl = Math.hypot(gx, gy) || 1;
      px -= (gx / gl) * d;
      py -= (gy / gl) * d;
    }
    return [px, py];
  }

  // ---------- WebGL ----------
  function shader(gl, type, source) {
    const s = gl.createShader(type);
    gl.shaderSource(s, source);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'shader');
    return s;
  }

  function createRenderer(gl) {
    const prog = gl.createProgram();
    gl.attachShader(prog, shader(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, shader(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.bindAttribLocation(prog, 0, 'aPos');
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) || 'link');
    gl.useProgram(prog);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    const texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.clearColor(0, 0, 0, 0);
    const u = {};
    for (const name of ['uSdf', 'uSize', 'uDpr', 'uCanvasH', 'uBlob', 'uWarp', 'uSigma', 'uBevel', 'uSpec', 'uShade', 'uInk', 'uHi']) {
      u[name] = gl.getUniformLocation(prog, name);
    }
    gl.uniform1i(u.uSdf, 0);
    gl.uniform3f(u.uInk, 236 / 255, 228 / 255, 214 / 255);
    gl.uniform3f(u.uHi, 1, 1, 1);
    gl.uniform1f(u.uSpec, 0.55);
    gl.uniform1f(u.uShade, 0.28);
    return u;
  }

  // ---------- montagem ----------
  function loadImage(attrs) {
    const img = document.createElement('img');
    Object.assign(img, attrs);
    return img;
  }

  window.mountLiquidWord = async function mountLiquidWord(heroPlate) {
    const plateIn = heroPlate.parentElement;
    const portrait = plateIn.querySelector('#heroPortrait');
    const stage = plateIn.closest('.stage') || plateIn;

    await document.fonts.load('900 100px "Roboto"', 'STUDIO');

    const canvas = document.createElement('canvas');
    canvas.className = 'plate-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    const gl = canvas.getContext('webgl2', { premultipliedAlpha: true, antialias: false, alpha: true });
    if (!gl) return false;

    const ground = loadImage({
      className: 'plate-word plate-ground',
      alt: heroPlate.alt,
      sizes: heroPlate.getAttribute('sizes') || '100vw',
      srcset: '/img/hero-ground-1440.webp 1440w, /img/hero-ground.webp 2880w',
      src: '/img/hero-ground.webp',
    });
    const brush = loadImage({ className: 'plate-brush', alt: '', src: '/img/hero-brush.webp', width: 885, height: 410 });
    await Promise.all([ground.decode(), brush.decode()]);

    let u = createRenderer(gl);
    let field = null;
    let width = 0;
    let bandH = 0;
    let fontSize = 0;
    let radius = 0;
    let inkTop = 0;
    let inkBottom = 0;
    let textWidth = 0;

    const x = new Float32Array(TRAIL);
    const y = new Float32Array(TRAIL);
    const vx = new Float32Array(TRAIL);
    const vy = new Float32Array(TRAIL);
    const blobs = new Float32Array(TRAIL * 4);
    const warps = new Float32Array(TRAIL * 2);
    let mass = 0;
    let massV = 0;
    let load = 0.5;
    let mode = 'idle';
    let tx = 0;
    let ty = 0;
    let homeX = 0;
    let homeY = 0;
    let releaseT = 0;
    let idleBlend = 1;
    let clock = 0;
    let seeded = false;
    let anchorX = 0;
    let anchorY = 0;
    let tether = 0;

    function idlePoint(t) {
      const capH = inkBottom - inkTop;
      const py = inkTop + capH * (0.04 + 0.2 * Math.sin(t * 0.53 + 1.1) + 0.08 * Math.sin(t * 1.27));
      return [width / 2 + textWidth * 0.44 * Math.sin(t * 0.21), py];
    }

    function layout() {
      const box = plateIn.getBoundingClientRect();
      if (box.width < 1) return false;
      width = box.width;
      const fullH = box.height || (width * 1608) / PLATE_W;
      bandH = fullH * BAND;
      field = buildField(width, bandH);
      fontSize = field.fontSize;
      radius = fontSize * 0.13;
      inkTop = (CAP_TOP * width) / PLATE_W;
      inkBottom = (BASELINE * width) / PLATE_W;
      textWidth = ((INK_RIGHT - INK_LEFT) * width) / PLATE_W;

      const dpr = Math.min(window.devicePixelRatio || 1, width < 700 ? 1.5 : 2, 2600 / width);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(bandH * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RG16F, field.w, field.h, 0, gl.RG, gl.FLOAT, field.packed);
      gl.uniform2f(u.uSize, width, bandH);
      gl.uniform1f(u.uDpr, canvas.width / width);
      gl.uniform1f(u.uCanvasH, canvas.height);
      gl.uniform1f(u.uSigma, radius * 1.8);
      gl.uniform1f(u.uBevel, Math.max(2, fontSize * 0.05));
      [homeX, homeY] = nearestInside(field, width / 2, (inkTop + inkBottom) / 2, fontSize * 0.03);
      seeded = false;
      return true;
    }

    function stepSim(dt) {
      if (!seeded) {
        const [sx, sy] = idlePoint(clock);
        x.fill(sx); y.fill(sy); vx.fill(0); vy.fill(0);
        seeded = true;
      }
      let massTarget = 0;
      let gx = tx;
      let gy = ty;
      if (mode === 'pointer') {
        massTarget = 1;
      } else if (mode === 'release') {
        releaseT += dt;
        gx = homeX; gy = homeY;
        if (releaseT > 2.2) { mode = 'idle'; idleBlend = 0; }
      } else {
        clock += dt;
        idleBlend = Math.min(1, idleBlend + dt / 2.4);
        const b = idleBlend * idleBlend * (3 - 2 * idleBlend);
        const [ix, iy] = idlePoint(clock);
        gx = homeX + (ix - homeX) * b;
        gy = homeY + (iy - homeY) * b;
        massTarget = 0.55 * b;
      }

      const k = 330 - 270 * VISCOSITY;
      const c = 2 * 0.62 * Math.sqrt(k);
      const kf = k * 1.25;
      const cf = 2 * 0.48 * Math.sqrt(kf);
      const km = 70;
      const cm = 2 * 0.3 * Math.sqrt(km);

      const headD = sampleField(field, x[0], y[0]);
      if (mode !== 'release') {
        if (headD < 0) {
          tether = Math.min(1, tether + dt * 8);
          [anchorX, anchorY] = nearestInside(field, x[0], y[0], fontSize * 0.04);
        } else if (tether > 0) {
          const stretch = Math.hypot(x[0] - anchorX, y[0] - anchorY);
          if (stretch > fontSize * (0.42 + 0.4 * VISCOSITY)) tether = 0;
        }
      } else {
        tether = Math.max(0, tether - dt * 3);
      }

      const steps = Math.max(1, Math.ceil(dt * 120));
      const h = dt / steps;
      for (let s = 0; s < steps; s++) {
        for (let i = 0; i < TRAIL; i++) {
          const targetX = i === 0 ? gx : x[i - 1];
          const targetY = i === 0 ? gy : y[i - 1];
          const kk = i === 0 ? k : kf;
          const cc = i === 0 ? c : cf;
          let fx = (targetX - x[i]) * kk;
          let fy = (targetY - y[i]) * kk;
          if (i > 0 && tether > 0) {
            const w = tether * Math.pow(i / (TRAIL - 1), 1.3) * 1.6;
            fx += (anchorX - x[i]) * kk * w;
            fy += (anchorY - y[i]) * kk * w;
          }
          vx[i] += (fx - vx[i] * cc) * h;
          vy[i] += (fy - vy[i] * cc) * h;
          x[i] += vx[i] * h;
          y[i] += vy[i] * h;
        }
        massV += ((massTarget - mass) * km - massV * cm) * h;
        mass += massV * h;
      }
      load = sampleField(field, x[0], y[0]) < fontSize * 0.02
        ? Math.min(1, load + dt * 5)
        : Math.max(0.4, load - dt * 0.35);
    }

    function draw() {
      const warpTime = 0.028 - VISCOSITY * 0.01;
      const maxWarp = fontSize * 0.05;
      const m = Math.max(0, mass);
      for (let i = 0; i < TRAIL; i++) {
        const taper = i === 0 ? 1 : 0.62 - 0.34 * (1 - 0.6 * tether) * ((i - 1) / Math.max(1, TRAIL - 2));
        blobs[i * 4] = x[i];
        blobs[i * 4 + 1] = y[i];
        blobs[i * 4 + 2] = radius * m * (0.45 + 0.55 * load) * taper;
        blobs[i * 4 + 3] = 0;
        const scale = warpTime * Math.min(1, m * 1.4);
        let wx = vx[i] * scale;
        let wy = vy[i] * scale;
        const wl = Math.hypot(wx, wy);
        if (wl > maxWarp) { wx *= maxWarp / wl; wy *= maxWarp / wl; }
        warps[i * 2] = wx;
        warps[i * 2 + 1] = wy;
      }
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform4fv(u.uBlob, blobs);
      gl.uniform2fv(u.uWarp, warps);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    if (!layout()) return false;
    stepSim(0);
    draw();
    if (gl.getError() !== gl.NO_ERROR) return false;

    plateIn.insertBefore(ground, portrait);
    plateIn.insertBefore(canvas, portrait);
    plateIn.insertBefore(brush, portrait);
    heroPlate.style.visibility = 'hidden';

    // ---------- ciclo ----------
    let raf = 0;
    let last = 0;
    let visible = true;
    let lost = false;

    function frame(now) {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;
      stepSim(dt);
      draw();
    }
    function sync() {
      const shouldRun = visible && !document.hidden && !lost;
      if (shouldRun && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      } else if (!shouldRun && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    }

    new IntersectionObserver((entries) => {
      visible = entries[entries.length - 1].isIntersecting;
      sync();
    }).observe(plateIn);
    document.addEventListener('visibilitychange', sync);

    let resizeTimer = 0;
    new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const box = plateIn.getBoundingClientRect();
        if (lost || Math.abs(box.width - width) < 1) return;
        layout();
        stepSim(0);
        draw();
      }, 200);
    }).observe(plateIn);

    // ---------- cursor e toque ----------
    function leave() {
      if (mode !== 'pointer') return;
      [homeX, homeY] = nearestInside(field, x[0], y[0], fontSize * 0.03);
      mode = 'release';
      releaseT = 0;
    }
    stage.addEventListener('pointermove', (e) => {
      const box = canvas.getBoundingClientRect();
      const px = e.clientX - box.left;
      const py = e.clientY - box.top;
      const pad = fontSize * 0.12;
      if (px >= 0 && px <= box.width && py >= inkTop - pad && py <= inkBottom + pad) {
        mode = 'pointer';
        tx = px;
        ty = Math.min(inkBottom, Math.max(inkTop, py));
      } else {
        leave();
      }
    }, { passive: true });
    stage.addEventListener('pointerleave', leave, { passive: true });
    stage.addEventListener('pointercancel', leave, { passive: true });
    stage.addEventListener('pointerup', (e) => { if (e.pointerType === 'touch') leave(); }, { passive: true });

    // ---------- perda de contexto ----------
    canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      lost = true;
      sync();
      heroPlate.style.visibility = '';
      ground.hidden = true;
      canvas.hidden = true;
      brush.hidden = true;
    });
    canvas.addEventListener('webglcontextrestored', () => {
      u = createRenderer(gl);
      lost = false;
      if (layout()) {
        ground.hidden = false;
        canvas.hidden = false;
        brush.hidden = false;
        heroPlate.style.visibility = 'hidden';
        stepSim(0);
        draw();
      }
      sync();
    });

    sync();
    return true;
  };
})();

