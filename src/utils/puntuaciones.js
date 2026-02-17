const CLAVE = "puntuaciones_v1";

function leerTodo() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE)) || {};
  } catch {
    return {};
  }
}

function escribirTodo(obj) {
  localStorage.setItem(CLAVE, JSON.stringify(obj));
}

export function obtenerMejor(juego) {
  const all = leerTodo();
  return all[juego]?.mejor ?? null;
}

/**
 * Guarda un nuevo récord si es mejor.
 * - Memoria: menos turnos = mejor (tipo: "min")
 * - Blackjack / Simón: más = mejor (tipo: "max")
 */
export function actualizarMejor(juego, valor, tipo = "max") {
  const all = leerTodo();
  const actual = all[juego]?.mejor;

  const esMejor =
    actual === undefined ||
    actual === null ||
    (tipo === "max" ? valor > actual : valor < actual);

  if (esMejor) {
    all[juego] = { mejor: valor, actualizadoEn: Date.now() };
    escribirTodo(all);
    return true;
  }
  return false;
}
