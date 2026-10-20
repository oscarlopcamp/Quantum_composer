// Simulador ligero de vector de estado para la demo web.
// Imita el statevector_simulator de Qiskit usado en quantum/simulador.py.
// Convención de Qiskit: el qubit 0 es el bit menos significativo (el de la derecha en |q_{n-1}...q_0⟩).
(function (global) {
  const ANGULO = Math.PI / 2;  // RX, RY y RZ usan un ángulo fijo, igual que la app de escritorio
  const S2 = Math.SQRT1_2;

  const c = (re, im = 0) => [re, im];
  const mul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
  const sum = (a, b) => [a[0] + b[0], a[1] + b[1]];

  // Matrices 2x2 en orden [m00, m01, m10, m11]
  function matriz(puerta) {
    const cos = Math.cos(ANGULO / 2);
    const sin = Math.sin(ANGULO / 2);
    switch (puerta) {
      case 'H': return [c(S2), c(S2), c(S2), c(-S2)];
      case 'X': return [c(0), c(1), c(1), c(0)];
      case 'Y': return [c(0), c(0, -1), c(0, 1), c(0)];
      case 'Z': return [c(1), c(0), c(0), c(-1)];
      case 'S': return [c(1), c(0), c(0), c(0, 1)];
      case 'T': return [c(1), c(0), c(0), c(S2, S2)];
      case 'RX': return [c(cos), c(0, -sin), c(0, -sin), c(cos)];
      case 'RY': return [c(cos), c(-sin), c(sin), c(cos)];
      case 'RZ': return [c(cos, -sin), c(0), c(0), c(cos, sin)];
    }
    throw new Error('Puerta desconocida: ' + puerta);
  }

  function estadoInicial(n) {
    const v = Array.from({ length: 1 << n }, () => c(0));
    v[0] = c(1);
    return v;
  }

  function aplicar(estado, op) {
    const v = estado.map(a => a.slice());
    if (op.puerta === 'CX') {
      const mc = 1 << op.control;
      const mt = 1 << op.objetivo;
      for (let i = 0; i < v.length; i++) {
        if ((i & mc) && !(i & mt)) {
          const j = i | mt;
          [v[i], v[j]] = [v[j], v[i]];
        }
      }
      return v;
    }
    const [m00, m01, m10, m11] = matriz(op.puerta);
    const m = 1 << op.qubit;
    for (let i = 0; i < v.length; i++) {
      if (!(i & m)) {
        const j = i | m;
        const a = v[i], b = v[j];
        v[i] = sum(mul(m00, a), mul(m01, b));
        v[j] = sum(mul(m10, a), mul(m11, b));
      }
    }
    return v;
  }

  function simular(n, ops) {
    return ops.reduce(aplicar, estadoInicial(n));
  }

  function probabilidades(estado) {
    return estado.map(([re, im]) => re * re + im * im);
  }

  // Equivalente a qasm_simulator con measure_all: devuelve {"bits": cuentas}
  function medir(estado, shots = 1024, rng = Math.random) {
    const n = Math.log2(estado.length);
    const p = probabilidades(estado);
    const cuentas = {};
    for (let s = 0; s < shots; s++) {
      let r = rng(), i = 0;
      while (i < p.length - 1 && r >= p[i]) { r -= p[i]; i++; }
      const bits = i.toString(2).padStart(n, '0');
      cuentas[bits] = (cuentas[bits] || 0) + 1;
    }
    return cuentas;
  }

  // Vector de Bloch del qubit q a partir de su matriz densidad reducida
  function vectorBloch(estado, q) {
    const m = 1 << q;
    let p0 = 0, p1 = 0, re01 = 0, im01 = 0;
    for (let i = 0; i < estado.length; i++) {
      if (i & m) continue;
      const a = estado[i], b = estado[i | m];
      p0 += a[0] * a[0] + a[1] * a[1];
      p1 += b[0] * b[0] + b[1] * b[1];
      // rho01 = a · conj(b)
      re01 += a[0] * b[0] + a[1] * b[1];
      im01 += a[1] * b[0] - a[0] * b[1];
    }
    return [2 * re01, -2 * im01, p0 - p1];
  }

  const Simulador = { ANGULO, simular, probabilidades, medir, vectorBloch };
  global.Simulador = Simulador;
  if (typeof module !== 'undefined') module.exports = Simulador;
})(typeof window !== 'undefined' ? window : globalThis);
