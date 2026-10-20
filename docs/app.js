// Interfaz de la demo web. Replica la barra de botones y las vistas de la app PyQt5.
const COMPUERTAS = ['H', 'X', 'Y', 'Z', 'S', 'T', 'RX', 'RY', 'RZ', 'CX'];
const COLORES = {
  H: '#ff5f5f', X: '#3366cc', Y: '#cc33cc', Z: '#3366cc',
  S: '#4aa8d8', T: '#4aa8d8', RX: '#cc6699', RY: '#cc6699',
  RZ: '#3fa5a5', CX: '#003366'
};
const MAX_QUBITS = 5;
const SHOTS = 1024;

const app = { n: 1, ops: [], qubit: 0, estado: null, cuentas: null };
const $ = id => document.getElementById(id);

// ---------- Controles ----------

function opcionesQubits(select, seleccionado) {
  select.innerHTML = '';
  for (let i = 0; i < app.n; i++) {
    const op = document.createElement('option');
    op.value = i;
    op.textContent = `Qubit ${i}`;
    select.appendChild(op);
  }
  select.value = Math.min(seleccionado, app.n - 1);
}

function crearBotonesCompuertas() {
  const rejilla = $('rejilla-compuertas');
  for (const nombre of COMPUERTAS) {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'compuerta';
    boton.textContent = nombre;
    boton.style.background = COLORES[nombre];
    boton.dataset.puerta = nombre;
    boton.addEventListener('click', () => aplicarCompuerta(nombre));
    rejilla.appendChild(boton);
  }
}

function actualizarControles() {
  opcionesQubits($('selector-qubit'), app.qubit);
  opcionesQubits($('cx-control'), Number($('cx-control').value) || 0);
  opcionesQubits($('cx-objetivo'), Number($('cx-objetivo').value) || 0);
  if (app.n > 1 && $('cx-control').value === $('cx-objetivo').value) {
    $('cx-objetivo').value = (Number($('cx-control').value) + 1) % app.n;
  }

  const sinCx = app.n < 2;
  document.querySelector('[data-puerta="CX"]').disabled = sinCx;
  $('cx-control').disabled = sinCx;
  $('cx-objetivo').disabled = sinCx;
  $('cx-nota').textContent = sinCx ? 'Agrega otro qubit para usar CX.' : '';

  $('agregar-qubit').disabled = app.n >= MAX_QUBITS;
  $('eliminar-qubit').disabled = app.n <= 1;
  $('deshacer').disabled = app.ops.length === 0;
  $('reiniciar').disabled = app.ops.length === 0;
}

function aplicarCompuerta(nombre) {
  if (nombre === 'CX') {
    const control = Number($('cx-control').value);
    const objetivo = Number($('cx-objetivo').value);
    if (control === objetivo) {
      $('cx-nota').textContent = 'El control y el objetivo deben ser qubits distintos.';
      return;
    }
    app.ops.push({ puerta: 'CX', control, objetivo });
  } else {
    app.ops.push({ puerta: nombre, qubit: app.qubit });
  }
  actualizar();
}

function agregarQubit() {
  if (app.n >= MAX_QUBITS) return;
  app.n++;
  actualizar();
}

function eliminarQubit() {
  if (app.n <= 1) return;
  app.n--;
  // Se descartan las compuertas que tocaban el qubit eliminado
  app.ops = app.ops.filter(op => op.puerta === 'CX'
    ? op.control < app.n && op.objetivo < app.n
    : op.qubit < app.n);
  app.qubit = Math.min(app.qubit, app.n - 1);
  actualizar();
}

const EJEMPLOS = {
  superposicion: { n: 1, ops: [{ puerta: 'H', qubit: 0 }] },
  bell: { n: 2, ops: [{ puerta: 'H', qubit: 0 }, { puerta: 'CX', control: 0, objetivo: 1 }] },
  ghz: {
    n: 3,
    ops: [
      { puerta: 'H', qubit: 0 },
      { puerta: 'CX', control: 0, objetivo: 1 },
      { puerta: 'CX', control: 1, objetivo: 2 }
    ]
  }
};

function cargarEjemplo(nombre) {
  const ej = EJEMPLOS[nombre];
  app.n = ej.n;
  app.ops = ej.ops.map(op => ({ ...op }));
  app.qubit = 0;
  actualizar();
}

// ---------- Circuito ----------

function dibujarCircuito() {
  const svg = $('circuito');
  const FILA = 56, COL = 58, IZQ = 56, ARRIBA = 30;

  // Coloca cada compuerta en la primera columna libre de los qubits que ocupa
  const ocupado = new Array(app.n).fill(0);
  const colocadas = app.ops.map(op => {
    const qs = op.puerta === 'CX' ? [op.control, op.objetivo] : [op.qubit];
    const desde = Math.min(...qs), hasta = Math.max(...qs);
    let col = 0;
    for (let q = desde; q <= hasta; q++) col = Math.max(col, ocupado[q]);
    for (let q = desde; q <= hasta; q++) ocupado[q] = col + 1;
    return { op, col };
  });

  const columnas = Math.max(6, ...ocupado);
  const ancho = IZQ + columnas * COL + 30;
  const alto = ARRIBA + (app.n - 1) * FILA + 30;
  const y = q => ARRIBA + q * FILA;
  const x = col => IZQ + col * COL + COL / 2;

  let s = '';
  for (let q = 0; q < app.n; q++) {
    s += `<text class="etiqueta-cable" x="8" y="${y(q) + 5}">q${q}</text>`;
    s += `<line class="cable" x1="${IZQ - 10}" y1="${y(q)}" x2="${ancho - 10}" y2="${y(q)}"/>`;
  }
  for (const { op, col } of colocadas) {
    const cx = x(col);
    if (op.puerta === 'CX') {
      const yc = y(op.control), yt = y(op.objetivo);
      const color = COLORES.CX;
      s += `<line x1="${cx}" y1="${yc}" x2="${cx}" y2="${yt}" stroke="${color}" stroke-width="2"/>`;
      s += `<circle cx="${cx}" cy="${yc}" r="6" fill="${color}"/>`;
      s += `<circle cx="${cx}" cy="${yt}" r="14" fill="${color}"/>`;
      s += `<line x1="${cx - 8}" y1="${yt}" x2="${cx + 8}" y2="${yt}" stroke="#fff" stroke-width="2"/>`;
      s += `<line x1="${cx}" y1="${yt - 8}" x2="${cx}" y2="${yt + 8}" stroke="#fff" stroke-width="2"/>`;
    } else {
      const cy = y(op.qubit);
      s += `<rect x="${cx - 20}" y="${cy - 18}" width="40" height="36" rx="5" fill="${COLORES[op.puerta]}"/>`;
      s += `<text class="texto-compuerta" x="${cx}" y="${cy + 5}" text-anchor="middle">${op.puerta}</text>`;
    }
  }
  if (app.ops.length === 0) {
    s += `<text class="texto-svg" x="${IZQ + 10}" y="${alto - 6}">Pulsa una compuerta para empezar</text>`;
  }

  svg.setAttribute('viewBox', `0 0 ${ancho} ${alto}`);
  svg.setAttribute('width', ancho);
  svg.setAttribute('height', alto);
  svg.innerHTML = s;
}

// ---------- Esfera de Bloch ----------

// Proyección ortográfica con una vista parecida a la de plot_bloch_multivector
function proyectar([px, py, pz]) {
  const a = Math.PI / 6, e = 0.35;
  const frente = px * Math.cos(a) + py * Math.sin(a);
  return {
    x: -px * Math.sin(a) + py * Math.cos(a),
    y: -(pz * Math.cos(e) - frente * Math.sin(e)),
    profundidad: frente * Math.cos(e) + pz * Math.sin(e)
  };
}

function circuloProyectado(punto, R, C) {
  let frontal = '', trasero = '';
  const pasos = 72;
  for (let k = 0; k < pasos; k++) {
    const t0 = (2 * Math.PI * k) / pasos, t1 = (2 * Math.PI * (k + 1)) / pasos;
    const p0 = proyectar(punto(t0)), p1 = proyectar(punto(t1));
    const seg = `M${C + R * p0.x},${C + R * p0.y}L${C + R * p1.x},${C + R * p1.y}`;
    if (p0.profundidad + p1.profundidad >= 0) frontal += seg; else trasero += seg;
  }
  return `<path class="trasero" d="${trasero}"/><path class="frontal" d="${frontal}"/>`;
}

function dibujarEsfera(vector) {
  const T = 200, C = T / 2, R = 72;
  const p = (v, escala = 1) => {
    const q = proyectar(v.map(c => c * escala));
    return [C + R * q.x, C + R * q.y];
  };
  let s = `<svg viewBox="0 0 ${T} ${T}" role="img" aria-label="Esfera de Bloch">`;
  s += `<circle class="contorno" cx="${C}" cy="${C}" r="${R}"/>`;
  s += circuloProyectado(t => [Math.cos(t), Math.sin(t), 0], R, C);
  s += circuloProyectado(t => [Math.cos(t), 0, Math.sin(t)], R, C);

  const ejes = [
    [[1, 0, 0], 'x'], [[0, 1, 0], 'y'], [[0, 0, 1], '|0⟩'], [[0, 0, -1], '|1⟩']
  ];
  for (const [v, etiqueta] of ejes) {
    const [x0, y0] = p(v.map(c => -c));
    const [x1, y1] = p(v);
    if (etiqueta !== '|1⟩') s += `<line class="eje" x1="${x0}" y1="${y0}" x2="${x1}" y2="${y1}"/>`;
    const [tx, ty] = p(v, 1.22);
    s += `<text class="texto-svg-fuerte" x="${tx}" y="${ty + 4}" text-anchor="middle">${etiqueta}</text>`;
  }

  const [vx, vy] = p(vector);
  s += `<line class="vector" x1="${C}" y1="${C}" x2="${vx}" y2="${vy}"/>`;
  s += `<circle class="punta" cx="${vx}" cy="${vy}" r="4.5"/>`;
  s += '</svg>';
  return s;
}

function dibujarEsferas() {
  const cont = $('esferas');
  cont.innerHTML = '';
  for (let q = 0; q < app.n; q++) {
    const v = Simulador.vectorBloch(app.estado, q);
    const largo = Math.hypot(...v);
    const div = document.createElement('div');
    div.className = 'esfera';
    div.innerHTML = `
      <div class="titulo">Qubit ${q}</div>
      ${dibujarEsfera(v)}
      <div class="coords">x=${fmt(v[0])} y=${fmt(v[1])} z=${fmt(v[2])}</div>
      <div class="coords">|r| = ${fmt(largo)}${largo < 0.99 ? ' · entrelazado' : ''}</div>`;
    cont.appendChild(div);
  }
}

// ---------- Histograma ----------

function dibujarHistograma() {
  const svg = $('histograma');
  const estados = 1 << app.n;
  const ANCHO_BARRA = Math.max(28, Math.min(64, 520 / estados));
  const IZQ = 44, ARRIBA = 22, ALTO_GRAF = 170, ABAJO = app.n > 3 ? 56 : 36;
  const ancho = IZQ + estados * ANCHO_BARRA + 12;
  const alto = ARRIBA + ALTO_GRAF + ABAJO;
  const maximo = Math.max(...Object.values(app.cuentas)) / SHOTS;
  const tope = Math.min(1, Math.ceil(maximo * 10) / 10 || 0.1);

  let s = '';
  for (let k = 0; k <= 4; k++) {
    const valor = (tope * k) / 4;
    const yy = ARRIBA + ALTO_GRAF - (valor / tope) * ALTO_GRAF;
    s += `<line class="eje" x1="${IZQ}" y1="${yy}" x2="${ancho - 8}" y2="${yy}" opacity="0.5"/>`;
    s += `<text class="texto-svg" x="${IZQ - 6}" y="${yy + 4}" text-anchor="end">${valor.toFixed(2)}</text>`;
  }
  for (let i = 0; i < estados; i++) {
    const bits = i.toString(2).padStart(app.n, '0');
    const cuenta = app.cuentas[bits] || 0;
    const prob = cuenta / SHOTS;
    const h = (prob / tope) * ALTO_GRAF;
    const x = IZQ + i * ANCHO_BARRA;
    const xc = x + ANCHO_BARRA / 2;
    if (cuenta > 0) {
      s += `<rect class="barra" x="${x + 4}" y="${ARRIBA + ALTO_GRAF - h}" width="${ANCHO_BARRA - 8}" height="${h}" rx="2"><title>${bits}: ${cuenta} (${(prob * 100).toFixed(1)}%)</title></rect>`;
      s += `<text class="texto-svg-fuerte" x="${xc}" y="${ARRIBA + ALTO_GRAF - h - 5}" text-anchor="middle">${cuenta}</text>`;
    }
    const yEtiqueta = ARRIBA + ALTO_GRAF + 16;
    s += app.n > 3
      ? `<text class="texto-svg" x="${xc}" y="${yEtiqueta}" text-anchor="end" transform="rotate(-60 ${xc} ${yEtiqueta})">${bits}</text>`
      : `<text class="texto-svg" x="${xc}" y="${yEtiqueta}" text-anchor="middle">${bits}</text>`;
  }

  svg.setAttribute('viewBox', `0 0 ${ancho} ${alto}`);
  svg.setAttribute('width', ancho);
  svg.setAttribute('height', alto);
  svg.innerHTML = s;
}

// ---------- Vector de estado ----------

function fmt(v) {
  const r = Math.abs(v) < 5e-4 ? 0 : v;
  return r.toFixed(3).replace('-', '−');
}

function fmtComplejo([re, im]) {
  const r = Math.abs(re) < 5e-4 ? 0 : re;
  const i = Math.abs(im) < 5e-4 ? 0 : im;
  if (i === 0) return fmt(r);
  if (r === 0) return `${fmt(i)}i`;
  return `${fmt(r)} ${i < 0 ? '−' : '+'} ${fmt(Math.abs(i))}i`;
}

function dibujarTabla() {
  const probs = Simulador.probabilidades(app.estado);
  $('tabla-estado').innerHTML = app.estado
    .map((amp, i) => ({ amp, i, p: probs[i] }))
    .filter(({ p }) => p > 1e-9)
    .map(({ amp, i, p }) => `<tr>
      <td>|${i.toString(2).padStart(app.n, '0')}⟩</td>
      <td>${fmtComplejo(amp)}</td>
      <td>${(p * 100).toFixed(1)}%</td>
    </tr>`)
    .join('');
}

// ---------- Ciclo principal ----------

function medir() {
  app.cuentas = Simulador.medir(app.estado, SHOTS);
  dibujarHistograma();
}

function actualizar() {
  app.estado = Simulador.simular(app.n, app.ops);
  actualizarControles();
  dibujarCircuito();
  dibujarEsferas();
  dibujarTabla();
  medir();
}

function iniciar() {
  crearBotonesCompuertas();
  $('shots').textContent = SHOTS;
  $('selector-qubit').addEventListener('change', e => { app.qubit = Number(e.target.value); });
  $('agregar-qubit').addEventListener('click', agregarQubit);
  $('eliminar-qubit').addEventListener('click', eliminarQubit);
  $('deshacer').addEventListener('click', () => { app.ops.pop(); actualizar(); });
  $('reiniciar').addEventListener('click', () => { app.ops = []; actualizar(); });
  $('volver-medir').addEventListener('click', medir);
  $('boton-info').addEventListener('click', () => $('dialogo-info').showModal());
  document.querySelectorAll('[data-ejemplo]').forEach(b =>
    b.addEventListener('click', () => cargarEjemplo(b.dataset.ejemplo)));
  actualizar();
}

iniciar();
