'use strict';

/* Painel Royal Lion Studio.
   Cada secção é descrita em SECTIONS; o formulário é gerado a partir daí. */

const $ = (id) => document.getElementById(id);

const ICONS = {
  up: 'M12 19V5M6 11l6-6 6 6',
  down: 'M12 5v14M6 13l6 6 6-6',
  remove: 'M6 6l12 12M18 6 6 18',
  plus: 'M12 5v14M5 12h14',
  upload: 'M12 16V5M7 10l5-5 5 5M5 20h14',
};

const WEEKDAYS = [[1, 'Segunda'], [2, 'Terça'], [3, 'Quarta'], [4, 'Quinta'], [5, 'Sexta'], [6, 'Sábado'], [0, 'Domingo']];

const serviceRow = [
  { key: 'name', label: 'Serviço', type: 'text' },
  { key: 'price', label: 'Preço', type: 'text', placeholder: 'ex. 15 €', narrow: true },
];

const doorFields = (who) => [
  { path: `doors.${who}.word`, label: 'Palavra grande', type: 'text' },
  { path: `doors.${who}.cta`, label: 'Texto do botão', type: 'text' },
  { path: `doors.${who}.text`, label: 'Frase', type: 'text', wide: true },
  { path: `doors.${who}.services`, label: 'Serviços', type: 'list', item: serviceRow, addLabel: 'Adicionar serviço', blank: { name: '', price: '' }, cols: 2, wide: true, hint: 'Sem preço, o site mostra só o nome do serviço.' },
];

const SECTIONS = [
  {
    id: 'inicio', label: 'Início', groups: [
      {
        title: 'Imagem principal',
        fields: [
          { path: 'hero.image', label: 'Imagem de fundo', type: 'image', hint: 'O efeito líquido só funciona com a imagem original.' },
          { path: 'hero.portrait', label: 'Retrato', type: 'image', hint: 'PNG ou WebP com fundo transparente, com a pessoa a chegar ao fundo da imagem. Se removeres o retrato, fica só a palavra.' },
          { path: 'hero.portraitAlt', label: 'Descrição do retrato', type: 'text', wide: true, hint: 'Lida por quem usa leitor de ecrã. Atualiza-a quando trocares o retrato.' },
        ],
      },
      {
        title: 'Textos',
        fields: [
          { path: 'hero.topLeft', label: 'Canto superior esquerdo', type: 'area' },
          { path: 'hero.topCenter', label: 'Topo ao centro', type: 'text' },
          { path: 'hero.topRight', label: 'Canto superior direito', type: 'area' },
          { path: 'hero.tagline', label: 'Frase', type: 'area' },
          { path: 'hero.servicesTitle', label: 'Título dos serviços', type: 'text' },
          { path: 'hero.services', label: 'Lista de serviços', type: 'strings', itemLabel: 'Serviço', addLabel: 'Adicionar serviço', wide: true },
          { path: 'hero.cta', label: 'Texto do botão', type: 'text' },
          { path: 'hero.hoursTitle', label: 'Título do horário', type: 'text' },
          { path: 'hero.hours', label: 'Horário', type: 'text' },
          { path: 'hero.address', label: 'Morada', type: 'text' },
        ],
      },
    ],
  },
  {
    id: 'servicos', label: 'Serviços', groups: [
      { title: 'Título da secção', fields: [{ path: 'doors.title', label: 'Título', type: 'text', wide: true }] },
      { title: 'Homens', fields: doorFields('homens') },
      { title: 'Mulheres', fields: doorFields('mulheres') },
    ],
  },
  {
    id: 'equipa', label: 'Equipa', groups: [
      {
        title: 'Secção',
        fields: [
          { path: 'team.visible', label: 'Mostrar a equipa no site', type: 'toggle', wide: true },
          { path: 'team.title', label: 'Título', type: 'text' },
          { path: 'team.text', label: 'Frase', type: 'area', wide: true },
        ],
      },
      {
        title: 'Pessoas',
        note: 'Nomes entre [ ] são provisórios e não aparecem no site: substitui-os pelos verdadeiros. Sem foto, fica o lugar reservado.',
        fields: [{
          path: 'team.members', label: 'Pessoas', hideLabel: true, type: 'list', addLabel: 'Adicionar pessoa', blank: { photo: '', name: '', role: '' }, cols: 2, wide: true,
          item: [
            { key: 'photo', label: 'Foto', type: 'image', frame: 'photo', wide: true },
            { key: 'name', label: 'Nome', type: 'text' },
            { key: 'role', label: 'Função', type: 'text', placeholder: 'ex. Barbeiro' },
          ],
        }],
      },
    ],
  },
  {
    id: 'galeria', label: 'Galeria e opiniões', groups: [
      {
        title: 'Galeria de trabalhos',
        note: 'As fotos aparecem na animação de cartões, por esta ordem. Enquanto não houver fotos, a secção mostra lugares vazios com o aviso abaixo.',
        fields: [
          { path: 'gallery.visible', label: 'Mostrar a galeria no site', type: 'toggle', wide: true },
          { path: 'gallery.title', label: 'Título', type: 'text', wide: true },
          { path: 'gallery.text', label: 'Frase com fotos', type: 'text', hint: 'Vazio ou entre [ ], não aparece no site.' },
          { path: 'gallery.pending', label: 'Aviso sem fotos', type: 'text', hint: 'Vazio ou entre [ ], não aparece no site.' },
          { path: 'gallery.open', label: 'Texto no verso do cartão', type: 'text', placeholder: 'ex. Ver foto' },
          {
            path: 'gallery.images', label: 'Fotos', hideLabel: true, type: 'list', addLabel: 'Adicionar foto', blank: { src: '', alt: '' }, cols: 1, wide: true,
            item: [
              { key: 'src', label: 'Foto', type: 'image', frame: 'photo', wide: true },
              { key: 'alt', label: 'O que se vê na foto', type: 'text', placeholder: 'ex. Corte curto com degradé', hint: 'Ajuda quem usa leitor de ecrã e os motores de busca.' },
            ],
          },
        ],
      },
      {
        title: 'Opiniões de clientes',
        note: 'A secção só aparece no site quando tiver pelo menos uma opinião. Usa apenas opiniões reais.',
        fields: [
          { path: 'testimonials.visible', label: 'Mostrar as opiniões no site', type: 'toggle', wide: true },
          { path: 'testimonials.title', label: 'Título', type: 'text', wide: true },
          {
            path: 'testimonials.items', label: 'Opiniões', hideLabel: true, type: 'list', addLabel: 'Adicionar opinião', blank: { text: '', name: '' }, cols: 1, wide: true,
            item: [
              { key: 'text', label: 'Opinião', type: 'area' },
              { key: 'name', label: 'Nome de quem escreveu', type: 'text' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'perguntas', label: 'Perguntas', groups: [
      {
        title: 'Perguntas frequentes',
        fields: [
          { path: 'faq.visible', label: 'Mostrar as perguntas no site', type: 'toggle', wide: true },
          { path: 'faq.title', label: 'Título', type: 'text', wide: true },
          {
            path: 'faq.items', label: 'Perguntas', hideLabel: true, type: 'list', addLabel: 'Adicionar pergunta', blank: { q: '', a: '' }, cols: 1, wide: true,
            item: [
              { key: 'q', label: 'Pergunta', type: 'text' },
              { key: 'a', label: 'Resposta', type: 'area' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'agendamento', label: 'Marcação', groups: [
      {
        title: 'Marcação',
        note: 'Todos os botões de agendar do site levam à página de marcação.',
        fields: [
          { path: 'booking.pageUrl', label: 'Página de marcação', type: 'text', wide: true, placeholder: 'ex. /marcacao', hint: 'Começa por / ou https://. Enquanto estiver vazio, os botões levam aos cartões de localização e marcação.' },
          { path: 'booking.noonaUrl', label: 'Link da Noona', type: 'url', wide: true, hint: 'Apenas para referência. A agenda da página /marcacao usa o endereço fixado em marcacao.html.' },
          { path: 'booking.title', label: 'Título', type: 'text', wide: true },
          { path: 'booking.text', label: 'Texto', type: 'area', wide: true },
          { path: 'booking.cta', label: 'Botão', type: 'text' },
          { path: 'booking.stepsTitle', label: 'Título dos passos', type: 'text', wide: true },
        ],
      },
    ],
  },
  {
    id: 'contacto', label: 'Contacto', groups: [
      {
        title: 'Morada e horário',
        note: 'Cada linha que escreveres aqui é uma linha no site.',
        fields: [
          { path: 'contact.title', label: 'Título', type: 'text', wide: true },
          { path: 'contact.headAddress', label: 'Título da morada', type: 'text' },
          { path: 'contact.headHours', label: 'Título do horário', type: 'text' },
          { path: 'contact.addressLines', label: 'Morada', type: 'area' },
          { path: 'contact.hoursLines', label: 'Horário', type: 'area' },
          { path: 'contact.mapsUrl', label: 'Ligação do mapa', type: 'url' },
          { path: 'contact.mapsLabel', label: 'Texto da ligação do mapa', type: 'text' },
          { path: 'contact.mapEmbed', label: 'Mapa no cartão', type: 'url', wide: true, hint: 'Tem de começar por https://www.google.com/maps. Vazio, o mapa não aparece.' },
          { path: 'contact.mapTitle', label: 'Título do cartão do mapa', type: 'text' },
          { path: 'contact.mapPlace', label: 'Etiqueta do cartão do mapa', type: 'text' },
          { path: 'contact.mapHint', label: 'Indicação para abrir o mapa', type: 'text' },
        ],
      },
      {
        title: 'Como falar connosco',
        note: 'Os campos vazios não aparecem no site.',
        fields: [
          { path: 'contact.headReach', label: 'Título', type: 'text' },
          { path: 'contact.reachPlaceholder', label: 'Aviso provisório', type: 'text', hint: 'Aparece enquanto não houver contacto preenchido. Vazio ou entre [ ], não aparece no site.' },
          { path: 'contact.phone', label: 'Telefone', type: 'tel', placeholder: 'ex. 254 000 000' },
          { path: 'contact.whatsapp', label: 'WhatsApp', type: 'tel', placeholder: 'ex. 351912345678', hint: 'Com o indicativo do país e sem espaços.' },
          { path: 'contact.email', label: 'Email', type: 'text', placeholder: 'ex. geral@royallion.pt' },
          { path: 'contact.instagram', label: 'Instagram', type: 'text', placeholder: 'ex. royallionstudio' },
        ],
      },
    ],
  },
  {
    id: 'marca', label: 'Marca e pesquisa', groups: [
      {
        title: 'Marca',
        fields: [{ path: 'brand.logo', label: 'Brasão', type: 'image', hint: 'Fica melhor um PNG claro com fundo transparente.' }],
      },
      {
        title: 'Menu e rodapé',
        fields: [
          { path: 'nav.home', label: 'Menu: Início', type: 'text' },
          { path: 'nav.services', label: 'Menu: Serviços', type: 'text' },
          { path: 'nav.works', label: 'Menu: Trabalhos', type: 'text' },
          { path: 'nav.team', label: 'Menu: Equipa', type: 'text' },
          { path: 'nav.contact', label: 'Menu: Contacto', type: 'text' },
          { path: 'nav.cta', label: 'Botão do menu', type: 'text' },
          { path: 'nav.dock', label: 'Botão fixo no telemóvel', type: 'text' },
          { path: 'nav.footer', label: 'Linha do rodapé', type: 'text' },
          { path: 'nav.complaintsLabel', label: 'Livro de Reclamações: texto', type: 'text' },
          { path: 'nav.complaintsUrl', label: 'Livro de Reclamações: link', type: 'url' },
        ],
      },
      {
        title: 'Resultados no Google',
        fields: [
          { path: 'seo.title', label: 'Título', type: 'text', wide: true, hint: 'Até cerca de 60 caracteres.' },
          { path: 'seo.description', label: 'Descrição', type: 'area', wide: true, hint: 'Até cerca de 155 caracteres.' },
        ],
      },
      {
        title: 'Horário no Google',
        note: 'Estes dias e períodos são o que o Google recebe. Os horários que se leem no site escrevem-se em Início e em Contacto.',
        fields: [
          { path: 'schedule.openDays', label: 'Dias abertos', type: 'days', wide: true },
          { path: 'schedule.blocks', label: 'Períodos de trabalho', type: 'list', addLabel: 'Adicionar período', blank: { from: '09:00', to: '12:00' }, cols: 2, compact: true, wide: true, item: [{ key: 'from', label: 'Das', type: 'time', narrow: true }, { key: 'to', label: 'Às', type: 'time', narrow: true }] },
        ],
      },
    ],
  },
  { id: 'conta', label: 'Conta', kind: 'account' },
];

/* Estado */
let content = null;
let savedJSON = '';
let current = 'inicio';
let saving = false;
let uid = 0;

/* Utilitários */
function el(tag, props, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (k === 'class') node.className = v;
    else if (k === 'text') node.textContent = v;
    else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
    else if (v === true) node.setAttribute(k, '');
    else if (v !== false && v != null) node.setAttribute(k, v);
  }
  node.append(...children.filter((c) => c != null));
  return node;
}

function icon(name) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'ico');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', ICONS[name]);
  svg.append(path);
  return svg;
}

const getPath = (path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), content);
function setPath(path, value) {
  const keys = path.split('.');
  const last = keys.pop();
  let o = content;
  for (const k of keys) {
    if (o[k] == null || typeof o[k] !== 'object') o[k] = {};
    o = o[k];
  }
  o[last] = value;
  touched();
}

async function api(method, url, body, raw) {
  const opts = { method, headers: {} };
  if (raw) {
    opts.body = body;
    opts.headers['Content-Type'] = body.type || 'application/octet-stream';
  } else if (body !== undefined) {
    opts.body = JSON.stringify(body);
    opts.headers['Content-Type'] = 'application/json';
  }
  let res;
  try {
    res = await fetch(url, opts);
  } catch {
    throw Object.assign(new Error('Sem ligação ao servidor. Verifica a internet e tenta de novo.'), { status: 0 });
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.error || 'Algo correu mal no servidor. Tenta de novo.'), { status: res.status, data });
  return data;
}

function sessionLost(err) {
  if (err.status !== 401) return false;
  showGate('login', 'A sessão terminou. Entra de novo; o que ainda não guardaste continua nesta página.');
  return true;
}

/* Estado de guardar */
const isDirty = () => content != null && JSON.stringify(content) !== savedJSON;

function touched() {
  setStatus('');
  paintSave();
}

function paintSave() {
  const dirty = isDirty();
  const section = SECTIONS.find((s) => s.id === current);
  const hasForm = !section.kind;
  // A barra fica sempre: é nela que se lê o resultado da conta e dos envios.
  $('saveBtn').hidden = !hasForm && !dirty;
  $('savebar').dataset.clean = String(!dirty);
  $('saveBtn').disabled = !dirty || saving;
  $('saveBtn').textContent = saving ? 'A guardar…' : 'Guardar';
  $('discardBtn').hidden = !dirty;
  if (dirty && !$('saveStatus').textContent) setStatus('Tens alterações por guardar.');
  if (!dirty && $('saveStatus').dataset.kind === 'dirty') setStatus('');
}

function setStatus(message, kind) {
  const status = $('saveStatus');
  status.textContent = message === 'Tens alterações por guardar.' ? message : '';
  status.dataset.kind = message === 'Tens alterações por guardar.' ? 'dirty' : (kind || '');
  status.classList.toggle('is-error', kind === 'error');
  if (kind === 'saved') {
    status.append(`${message} `, el('a', { href: '/', target: '_blank', rel: 'noopener', text: 'Ver no site' }));
  } else if (message && !status.textContent) {
    status.textContent = message;
  }
}

/* Linhas vazias não vão para o site */
function tidy(c) {
  const clean = JSON.parse(JSON.stringify(c));
  for (const who of ['homens', 'mulheres']) clean.doors[who].services = clean.doors[who].services.filter((s) => s.name.trim());
  clean.team.members = clean.team.members.filter((m) => m.photo || m.name.trim());
  clean.gallery.images = clean.gallery.images.filter((g) => g.src);
  clean.testimonials.items = clean.testimonials.items.filter((t) => t.text.trim());
  clean.faq.items = clean.faq.items.filter((f) => f.q.trim() && f.a.trim());
  return clean;
}

function scheduleProblem(c) {
  if (!c.schedule.openDays.length) return 'Escolhe pelo menos um dia aberto em Horário no Google.';
  if (!c.schedule.blocks.length) return 'Adiciona pelo menos um período de trabalho em Horário no Google.';
  if (c.schedule.blocks.some((b) => !b.from || !b.to || b.from >= b.to)) return 'Em Horário no Google, cada período tem de acabar depois de começar.';
  return '';
}

async function save() {
  const problem = scheduleProblem(content);
  if (problem) {
    setStatus(problem, 'error');
    return;
  }
  saving = true;
  paintSave();
  const body = tidy(content);
  try {
    await api('PUT', '/api/admin/content', body);
    content = body;
    savedJSON = JSON.stringify(content);
    saving = false;
    renderView();
    const now = new Date();
    setStatus(`Guardado às ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}.`, 'saved');
    paintSave();
  } catch (err) {
    saving = false;
    paintSave();
    if (!sessionLost(err)) setStatus(`Não foi guardado. ${err.message}`, 'error');
  }
}

function discard() {
  content = JSON.parse(savedJSON);
  renderView();
  setStatus('Alterações descartadas.');
  paintSave();
}

/* Campos */
function fieldShell(def, control, id) {
  const wrap = el('div', { class: `field${def.wide ? ' field-wide' : ''}${def.narrow ? ' is-narrow' : ''}` });
  if (!def.hideLabel) wrap.append(el(id ? 'label' : 'p', { class: 'field-label', for: id || null, text: def.label }));
  wrap.append(control);
  if (def.hint) wrap.append(el('p', { class: 'field-hint', text: def.hint }));
  return wrap;
}

function buildField(def, get, set) {
  const id = `f${++uid}`;
  switch (def.type) {
    case 'toggle': {
      const box = el('input', { type: 'checkbox', id, onchange: (e) => set(e.target.checked) });
      box.checked = get() !== false;
      return el('div', { class: 'field field-wide' }, el('label', { class: 'toggle', for: id }, box, def.label));
    }
    case 'area': {
      const input = el('textarea', { class: 'input', id, placeholder: def.placeholder, rows: 3, oninput: (e) => set(e.target.value) });
      input.value = get() ?? '';
      return fieldShell(def, input, id);
    }
    case 'number': {
      const input = el('input', {
        class: 'input input-short', id, type: 'number', inputmode: 'numeric', min: def.min, max: def.max, step: def.step || 1,
        onchange: (e) => {
          const n = Number(e.target.value);
          const fixed = Number.isFinite(n) && e.target.value !== '' ? Math.min(def.max, Math.max(def.min, Math.round(n))) : get();
          e.target.value = fixed;
          set(fixed);
        },
      });
      input.value = get() ?? '';
      return fieldShell(def, input, id);
    }
    case 'image': return imageField(def, get, set, id);
    case 'strings': return stringsField(def, get, set);
    case 'list': return listField(def, get, set);
    case 'days': return daysField(def, get, set);
    default: {
      const input = el('input', { class: `input${def.type === 'time' ? ' input-short' : ''}`, id, type: def.type === 'text' ? 'text' : def.type, placeholder: def.placeholder, oninput: (e) => set(e.target.value) });
      input.value = get() ?? '';
      return fieldShell(def, input, id);
    }
  }
}

function imageField(def, get, set, id) {
  const frame = el('div', { class: `image-frame${def.frame === 'wide' ? ' is-wide' : ''}${def.frame === 'photo' ? ' is-photo' : ''}` });
  const error = el('p', { class: 'field-error', role: 'alert', hidden: true });
  const removeBtn = el('button', { class: 'btn btn-quiet', type: 'button', text: 'Remover' });
  const fileLabelText = el('span');
  const file = el('input', { type: 'file', id, accept: 'image/png,image/jpeg,image/webp,image/avif' });
  const fileLabel = el('label', { class: 'btn btn-file' }, icon('upload'), fileLabelText, file);

  const paint = () => {
    const src = get();
    frame.replaceChildren(src ? el('img', { src, alt: '' }) : el('span', { text: 'Sem imagem' }));
    fileLabelText.textContent = src ? 'Trocar imagem' : 'Escolher imagem';
    removeBtn.hidden = !src || def.frame === 'wide' || def.path === 'brand.logo';
  };
  removeBtn.addEventListener('click', () => { set(''); paint(); });
  file.addEventListener('change', async () => {
    const chosen = file.files[0];
    if (!chosen) return;
    if (chosen.size > 8 * 1024 * 1024) {
      error.textContent = 'Essa imagem passa dos 8 MB. Escolhe uma mais leve.';
      error.hidden = false;
      file.value = '';
      return;
    }
    error.hidden = true;
    fileLabel.classList.add('is-busy');
    fileLabelText.textContent = 'A enviar…';
    file.disabled = true;
    try {
      const { url } = await api('POST', '/api/admin/upload', chosen, true);
      set(url);
    } catch (err) {
      if (!sessionLost(err)) {
        error.textContent = err.status === 413 ? 'Essa imagem passa dos 8 MB. Escolhe uma mais leve.'
          : err.status === 415 ? 'Esse ficheiro não é uma imagem aceite. Usa PNG, JPG, WebP ou AVIF.'
          : err.message;
        error.hidden = false;
      }
    } finally {
      fileLabel.classList.remove('is-busy');
      file.disabled = false;
      file.value = '';
      paint();
    }
  });
  paint();

  const hint = def.hint ? el('p', { class: 'field-hint', text: def.hint }) : null;
  const wrap = el('div', { class: `field${def.wide !== false ? ' field-wide' : ''}` },
    el('p', { class: 'field-label', text: def.label }),
    el('div', { class: 'image' }, frame,
      el('div', { class: 'image-side' }, el('div', { class: 'image-actions' }, fileLabel, removeBtn), hint, error)));
  return wrap;
}

function moveButtons(items, i, rerender, noun) {
  const shift = (delta) => () => {
    const [moved] = items.splice(i, 1);
    items.splice(i + delta, 0, moved);
    touched();
    rerender(i + delta, delta < 0 ? 'up' : 'down');
  };
  return [
    el('button', { class: 'btn btn-icon', type: 'button', 'data-move': 'up', 'aria-label': `Subir ${noun} ${i + 1}`, title: 'Subir', disabled: i === 0, onclick: shift(-1) }, icon('up')),
    el('button', { class: 'btn btn-icon', type: 'button', 'data-move': 'down', 'aria-label': `Descer ${noun} ${i + 1}`, title: 'Descer', disabled: i === items.length - 1, onclick: shift(1) }, icon('down')),
    el('button', {
      class: 'btn btn-icon', type: 'button', 'aria-label': `Remover ${noun} ${i + 1}`, title: 'Remover',
      onclick: () => { items.splice(i, 1); touched(); rerender(Math.min(i, items.length - 1), 'add'); },
    }, icon('remove')),
  ];
}

function focusRow(host, index, target) {
  const row = host.querySelectorAll('.row')[index];
  const focusable = target === 'field'
    ? row && row.querySelector('input:not([type=file]), textarea')
    : row && (row.querySelector(`[data-move="${target}"]:not(:disabled)`) || row.querySelector('button:not(:disabled)'));
  (focusable || host.querySelector('.list-add')).focus();
}

function stringsField(def, get) {
  const host = el('div');
  const items = get();
  const noun = (def.itemLabel || 'linha').toLowerCase();
  const render = (focusIndex, target) => {
    const rows = el('div', { class: 'rows' });
    items.forEach((value, i) => {
      const input = el('input', { class: 'input', 'aria-label': `${def.itemLabel} ${i + 1}`, oninput: (e) => { items[i] = e.target.value; touched(); } });
      input.value = value;
      rows.append(el('div', { class: 'row is-compact' }, el('div', { class: 'row-fields' }, input), el('div', { class: 'row-tools' }, ...moveButtons(items, i, render, noun))));
    });
    const add = el('button', {
      class: 'btn list-add', type: 'button',
      onclick: () => { items.push(''); touched(); render(items.length - 1, 'field'); },
    }, icon('plus'), def.addLabel);
    host.replaceChildren(rows, add);
    if (focusIndex != null) focusRow(host, focusIndex, target === 'add' ? 'field' : target);
  };
  render();
  return fieldShell(def, host);
}

function listField(def, get) {
  const host = el('div');
  const items = get();
  const noun = def.addLabel.replace('Adicionar ', '');
  const render = (focusIndex, target) => {
    const rows = el('div', { class: 'rows' });
    if (!items.length) rows.append(el('p', { class: 'empty-line', text: 'Ainda não há nada aqui.' }));
    items.forEach((item, i) => {
      const fields = el('div', { class: `row-fields cols-${def.cols || 1}` });
      for (const sub of def.item) {
        fields.append(buildField(sub, () => item[sub.key], (v) => { item[sub.key] = v; touched(); }));
      }
      rows.append(el('div', { class: `row${def.compact ? ' is-compact' : ''}` }, fields, el('div', { class: 'row-tools' }, ...moveButtons(items, i, render, noun))));
    });
    const add = el('button', {
      class: 'btn list-add', type: 'button',
      onclick: () => { items.push({ ...def.blank }); touched(); render(items.length - 1, 'field'); },
    }, icon('plus'), def.addLabel);
    host.replaceChildren(rows, add);
    if (focusIndex != null && items.length) focusRow(host, focusIndex, target === 'add' ? 'field' : target);
    else if (focusIndex != null) add.focus();
  };
  render();
  return fieldShell(def, host);
}

function daysField(def, get, set) {
  const set_ = new Set(get());
  const group = el('div', { class: 'days', role: 'group', 'aria-label': def.label });
  for (const [value, name] of WEEKDAYS) {
    const box = el('input', {
      type: 'checkbox',
      onchange: (e) => {
        if (e.target.checked) set_.add(value); else set_.delete(value);
        set([...set_].sort((a, b) => a - b));
      },
    });
    box.checked = set_.has(value);
    group.append(el('label', { class: 'day' }, box, name));
  }
  return fieldShell(def, group);
}

function renderForm(section) {
  const frag = document.createDocumentFragment();
  for (const group of section.groups) {
    const fields = el('div', { class: 'fields' });
    for (const def of group.fields) {
      fields.append(buildField(def, () => getPath(def.path), (v) => setPath(def.path, v)));
    }
    frag.append(el('section', { class: 'group' },
      el('h2', { class: 'group-title', text: group.title }),
      group.note ? el('p', { class: 'group-note', text: group.note }) : null,
      fields));
  }
  return frag;
}

/* Conta */
function renderAccount(view) {
  const message = el('p', { class: 'form-message', role: 'status' });
  const cur = el('input', { class: 'input', id: 'pwCurrent', type: 'password', autocomplete: 'current-password', required: true });
  const next = el('input', { class: 'input', id: 'pwNext', type: 'password', autocomplete: 'new-password', required: true, minlength: 8 });
  const submit = el('button', { class: 'btn', type: 'submit', text: 'Mudar palavra-passe' });
  const form = el('form', {
    class: 'account', novalidate: true,
    onsubmit: async (e) => {
      e.preventDefault();
      if (next.value.length < 8) {
        message.textContent = 'A palavra-passe nova precisa de pelo menos 8 caracteres.';
        next.focus();
        return;
      }
      submit.disabled = true;
      try {
        await api('POST', '/api/admin/password', { current: cur.value, next: next.value });
        message.textContent = 'Palavra-passe mudada.';
        form.reset();
      } catch (err) {
        if (!sessionLost(err)) message.textContent = err.message;
      } finally {
        submit.disabled = false;
      }
    },
  },
  el('div', { class: 'field' }, el('label', { class: 'field-label', for: 'pwCurrent', text: 'Palavra-passe atual' }), cur),
  el('div', { class: 'field' }, el('label', { class: 'field-label', for: 'pwNext', text: 'Palavra-passe nova' }), next,
    el('p', { class: 'field-hint', text: 'Pelo menos 8 caracteres.' })),
  submit, message);

  view.replaceChildren(
    el('section', { class: 'group' }, el('h2', { class: 'group-title', text: 'Palavra-passe' }), form),
    el('section', { class: 'group' },
      el('h2', { class: 'group-title', text: 'Sessão' }),
      el('button', {
        class: 'btn list-add', type: 'button', text: 'Sair do painel',
        onclick: async () => {
          if (isDirty() && !window.confirm('Tens alterações por guardar. Sair na mesma?')) return;
          await api('POST', '/api/admin/logout').catch(() => {});
          content = null;
          savedJSON = '';
          window.location.reload();
        },
      })));
}

/* Navegação */
function renderNav() {
  $('nav').replaceChildren(...SECTIONS.map((s) => el('button', {
    class: 'nav-item', type: 'button', 'aria-current': s.id === current ? 'page' : null,
    onclick: () => go(s.id),
  }, el('span', { class: 'nav-label', text: s.label }))));
}

function renderView() {
  const section = SECTIONS.find((s) => s.id === current);
  const view = $('view');
  $('sectionTitle').textContent = section.label;
  document.title = `${section.label} | Painel Royal Lion Studio`;
  if (section.kind === 'account') {
    renderAccount(view);
  } else {
    view.replaceChildren(renderForm(section));
  }
  paintSave();
}

function go(id) {
  current = id;
  history.replaceState(null, '', `#${id}`);
  renderNav();
  renderView();
  if (saveBarStatusIsTransient()) setStatus('');
  paintSave();
  window.scrollTo(0, 0);
  $('view').focus({ preventScroll: true });
  const active = $('nav').querySelector('[aria-current="page"]');
  if (active && window.matchMedia('(max-width: 860px)').matches) active.scrollIntoView({ inline: 'center', block: 'nearest' });
}

const saveBarStatusIsTransient = () => $('saveStatus').dataset.kind !== 'dirty';

/* Entrada */
function showGate(mode, message) {
  $('app').hidden = true;
  $('gate').hidden = false;
  const form = $('gateForm');
  const pw = $('gatePassword');
  $('gateError').textContent = '';
  pw.value = '';
  form.hidden = mode === 'blocked';
  form.dataset.mode = mode;
  if (mode === 'setup') {
    $('gateTitle').textContent = 'Criar acesso';
    $('gateText').textContent = 'Escolhe a palavra-passe do painel. Pelo menos 8 caracteres.';
    $('gateSubmit').textContent = 'Criar e entrar';
    pw.autocomplete = 'new-password';
  } else if (mode === 'blocked') {
    $('gateTitle').textContent = 'Painel por ativar';
    $('gateText').textContent = 'Por segurança, a primeira palavra-passe só se cria no próprio computador do servidor, ou definindo a variável ADMIN_PASSWORD no alojamento.';
  } else {
    $('gateTitle').textContent = 'Painel';
    $('gateText').textContent = message || 'Entra para atualizar o site.';
    $('gateSubmit').textContent = 'Entrar';
    pw.autocomplete = 'current-password';
  }
  if (!form.hidden) pw.focus();
}

async function enter() {
  if (content === null) {
    content = await api('GET', '/api/content');
    savedJSON = JSON.stringify(content);
  }
  $('gate').hidden = true;
  $('app').hidden = false;
  const hash = window.location.hash.slice(1);
  if (SECTIONS.some((s) => s.id === hash)) current = hash;
  renderNav();
  renderView();
}

$('gateForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const mode = e.target.dataset.mode;
  const password = $('gatePassword').value;
  const error = $('gateError');
  if (password.length < (mode === 'setup' ? 8 : 1)) {
    error.textContent = mode === 'setup' ? 'A palavra-passe precisa de pelo menos 8 caracteres.' : 'Escreve a palavra-passe.';
    $('gatePassword').focus();
    return;
  }
  const submit = $('gateSubmit');
  submit.disabled = true;
  error.textContent = '';
  try {
    await api('POST', mode === 'setup' ? '/api/admin/setup' : '/api/admin/login', { password });
    await enter();
  } catch (err) {
    error.textContent = err.status === 401 ? 'Palavra-passe errada. Tenta de novo.' : err.message;
    $('gatePassword').select();
  } finally {
    submit.disabled = false;
  }
});

$('saveBtn').addEventListener('click', save);
$('discardBtn').addEventListener('click', discard);

// Um link direto para outra secção (#contacto, por exemplo) muda de secção sem recarregar.
window.addEventListener('hashchange', () => {
  const hash = window.location.hash.slice(1);
  if (!$('app').hidden && hash !== current && SECTIONS.some((s) => s.id === hash)) go(hash);
});

document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's' && !$('app').hidden) {
    e.preventDefault();
    if (isDirty() && !saving) save();
  }
});

window.addEventListener('beforeunload', (e) => {
  if (isDirty()) {
    e.preventDefault();
    e.returnValue = '';
  }
});

(async function start() {
  try {
    const status = await api('GET', '/api/admin/status');
    if (status.authed) await enter();
    else if (status.configured) showGate('login');
    else showGate(status.canSetup ? 'setup' : 'blocked');
  } catch (err) {
    $('gate').hidden = false;
    $('gateForm').hidden = true;
    $('gateTitle').textContent = 'Painel indisponível';
    $('gateText').textContent = err.message;
  }
})();
