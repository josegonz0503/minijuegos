const CLAVE = "recompensas_v1";

function parseSeguro(valor) {
  try {
    return JSON.parse(valor);
  } catch {
    return null;
  }
}

function leerTodo() {
  const raw = localStorage.getItem(CLAVE);
  const parsed = parseSeguro(raw);
  return (
    parsed || {
      puntosTotales: 0,
      puntosPorJuego: {},
      cupones: [],
      hitos: {},
    }
  );
}

function escribirTodo(obj) {
  localStorage.setItem(CLAVE, JSON.stringify(obj));
  // En la misma pestaña el evento "storage" no siempre salta, así que avisamos.
  try {
    window.dispatchEvent(new StorageEvent("storage", { key: CLAVE }));
  } catch {
    // ignore
  }
}

function crearCodigo(prefijo = "DES") {
  // Código simple, suficiente para un proyecto de clase
  const p1 = Math.random().toString(36).slice(2, 7).toUpperCase();
  const p2 = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `${prefijo}-${p1}-${p2}`;
}

/**
 * Suma puntos al total y genera cupones automáticamente.
 * Hitos por defecto: 500, 1000, 1500 puntos.
 */
export function agregarPuntos(juego, puntos) {
  const p = Math.max(0, Math.floor(puntos || 0));
  const all = leerTodo();

  all.puntosTotales += p;
  all.puntosPorJuego[juego] = (all.puntosPorJuego[juego] || 0) + p;

  const hitos = [500, 1000, 1500];
  for (const h of hitos) {
    if (!all.hitos[h] && all.puntosTotales >= h) {
      // Cupones sencillos: 10% / 15% / 20%
      const porcentaje = h === 500 ? 10 : h === 1000 ? 15 : 20;
      all.cupones.unshift({
        codigo: crearCodigo("ESP"),
        porcentaje,
        desbloqueadoEn: Date.now(),
        hito: h,
        usado: false,
      });
      all.hitos[h] = true;
    }
  }

  escribirTodo(all);
  return all;
}

export function obtenerRecompensas() {
  return leerTodo();
}

export function marcarCuponUsado(codigo) {
  const all = leerTodo();
  const idx = all.cupones.findIndex((c) => c.codigo === codigo);
  if (idx >= 0) {
    all.cupones[idx] = { ...all.cupones[idx], usado: true };
    escribirTodo(all);
  }
  return all;
}
