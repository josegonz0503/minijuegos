export const PALOS = ["S", "H", "D", "C"];
export const VALORES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

export function crearBaraja() {
  return PALOS.flatMap((palo) =>
    VALORES.map((valor) => ({
      valor,
      palo,
      codigo: valor + palo,
      imagen: "/img/cards/" + valor + palo + ".png",
    }))
  );
}

export function valorCarta(carta) {
  const v = carta?.valor;
  if (!v) return 0;
  if (v === "A") return 11;
  if (["K", "Q", "J"].includes(v)) return 10;
  return Number(v) || 0;
}
