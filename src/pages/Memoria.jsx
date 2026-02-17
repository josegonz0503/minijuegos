import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Carta from "../components/Carta";
import Panel from "../components/Panel";
import "../pages/Memoria.css";
import { obtenerMejor, actualizarMejor } from "../utils/puntuaciones";
import { agregarPuntos } from "../utils/recompensas";
import Navegacion from "../components/Navegacion";

export default function Memoria() {
  const [cartas, setCartas] = useState([]);
  const [turnos, setTurnos] = useState(0);
  const [eleccion1, setEleccion1] = useState(null);
  const [eleccion2, setEleccion2] = useState(null);
  const [deshabilitado, setDeshabilitado] = useState(false);
  const [msg, setMsg] = useState("");

  const imagenes = useMemo(
    () => [
      { src: "/img/cereza.png", encontrada: false },
      { src: "/img/fresa.png", encontrada: false },
      { src: "/img/limon.png", encontrada: false },
      { src: "/img/naranja.png", encontrada: false },
      { src: "/img/platano.png", encontrada: false },
      { src: "/img/piña.png", encontrada: false },
    ],
    []
  );

  const bestTurns = obtenerMejor("memory");

  const puntos = useMemo(() => {
    const base = 600;
    const penalty = Math.max(0, (turnos - 6) * 25);
    return Math.max(0, base - penalty);
  }, [turnos]);

  const barajar = () => {
    const cartasBarajadas = [...imagenes, ...imagenes]
      .sort(() => Math.random() - 0.5)
      .map((carta) => ({ ...carta, id: crypto.randomUUID() }));

    setCartas(cartasBarajadas);
    setTurnos(0);
    setEleccion1(null);
    setEleccion2(null);
    setDeshabilitado(false);
    setMsg("");
  };

  const handleEleccion = (carta) => {
    if (deshabilitado) return;
    eleccion1 ? setEleccion2(carta) : setEleccion1(carta);
  };

  useEffect(() => {
    if (eleccion1 && eleccion2) {
      setDeshabilitado(true);

      if (eleccion1.src === eleccion2.src) {
        setCartas((prev) =>
          prev.map((c) =>
            c.src === eleccion1.src ? { ...c, encontrada: true } : c
          )
        );
        setTimeout(() => resetear(), 550);
      } else {
        setTimeout(() => resetear(), 850);
      }
    }
  }, [eleccion1, eleccion2]);

  const resetear = () => {
    setEleccion1(null);
    setEleccion2(null);
    setTurnos((prev) => prev + 1);
    setDeshabilitado(false);
  };

  useEffect(() => {
    if (cartas.length > 0 && cartas.every((c) => c.encontrada)) {
      const isNew = actualizarMejor("memory", turnos, "min");
      agregarPuntos("memory", puntos);
      setMsg(isNew ? " Nuevo record!" : " completado!");
    }
  }, [cartas, turnos]);

  useEffect(() => {
    barajar();
  }, []);

  return (
    <Panel
      title="Memory"
      subtitle="Encuentra todas las parejas con los turnos mínimos."
      right={
        <div className="row">
          <Navegacion />
          <div className="badge"><span>Torns</span>{turnos}</div>
          <div className="badge"><span>Puntos</span>{puntos}</div>
          <div className="badge"><span>Récord</span>{bestTurns ?? "—"}</div>
          <button className="btn btnPrimary" onClick={barajar}>Nueva partida</button>
        </div>
      }
    >
      <div style={{ marginBottom: 12 }}>
        <Link className="backLink" to="/">← Menú</Link>
      </div>

      {msg && <div className="notice">{msg}</div>}

      <div className="grid-carta">
        {cartas.map((carta) => (
          <Carta
            key={carta.id}
            carta={carta}
            handleEleccion={handleEleccion}
            volteada={carta === eleccion1 || carta === eleccion2 || carta.encontrada}
            deshabilitado={deshabilitado}
          />
        ))}
      </div>
    </Panel>
  );
}
