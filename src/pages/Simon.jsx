import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Panel from "../components/Panel";
import Navegacion from "../components/Navegacion";
import { obtenerMejor, actualizarMejor } from "../utils/puntuaciones";
import { agregarPuntos } from "../utils/recompensas";
import "./Simon.css";

function dormir(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export default function Simon() {
  const botones = useMemo(
    () => [
      { id: 0, nombre: "Verde", clase: "verde" },
      { id: 1, nombre: "Rojo", clase: "rojo" },
      { id: 2, nombre: "Amarillo", clase: "amarillo" },
      { id: 3, nombre: "Azul", clase: "azul" },
    ],
    []
  );

  const [secuencia, setSecuencia] = useState([]);
  const [posUsuario, setPosUsuario] = useState(0);
  const [reproduciendo, setReproduciendo] = useState(false);
  const [activo, setActivo] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [nivel, setNivel] = useState(0);

  const mejorNivel = obtenerMejor("simon_nivel") ?? 0;
  // Token para cancelar reproducciones en curso (reinicios / errores)
  const playToken = useRef(0);

  useEffect(() => {
    return () => {
      // invalida cualquier loop async pendiente al desmontar
      playToken.current += 1;
    };
  }, []);

  async function reproducir(seq) {
    const token = (playToken.current += 1);
    setReproduciendo(true);
    setActivo(null);
    setMensaje("Mira la secuencia…");
    await dormir(400);

    for (const paso of seq) {
      if (token !== playToken.current) return;
      setActivo(paso);
      await dormir(450);
      if (token !== playToken.current) return;
      setActivo(null);
      await dormir(180);
    }

    setMensaje("Tu turno: repite la secuencia.");
    setReproduciendo(false);
  }

  function empezar() {
    // cancela cualquier animación anterior
    playToken.current += 1;
    const primera = [Math.floor(Math.random() * 4)];
    setSecuencia(primera);
    setPosUsuario(0);
    setNivel(1);
    setMensaje("");
    reproducir(primera);
  }

  function reiniciar() {
    // cancela reproducción en curso
    playToken.current += 1;
    setSecuencia([]);
    setPosUsuario(0);
    setReproduciendo(false);
    setActivo(null);
    setNivel(0);
  }

  function terminarPorFallo() {
    // cancela reproducción en curso
    playToken.current += 1;
    const nivelAlcanzado = Math.max(0, nivel - 1);
    const puntos = nivelAlcanzado * 50; // muy simple
    if (puntos > 0) agregarPuntos("simon", puntos);

    const esNuevo = actualizarMejor("simon_nivel", nivelAlcanzado, "max");
    setMensaje(
      esNuevo
        ? ` Fallaste. ¡Nuevo récord! Nivel ${nivelAlcanzado}. (+${puntos} puntos)`
        : ` Fallaste. Nivel ${nivelAlcanzado}. (+${puntos} puntos)`
    );

    // resetea juego pero mantiene el mensaje
    setSecuencia([]);
    setPosUsuario(0);
    setReproduciendo(false);
    setActivo(null);
    setNivel(0);
  }

  async function clickColor(id) {
    if (reproduciendo) return;
    if (secuencia.length === 0) return;

    // feedback visual inmediato
    setActivo(id);
    setTimeout(() => setActivo(null), 140);

    const esperado = secuencia[posUsuario];
    if (id !== esperado) {
      terminarPorFallo();
      return;
    }

    const siguientePos = posUsuario + 1;
    if (siguientePos === secuencia.length) {
      // ronda superada
      const nuevoNivel = nivel + 1;
      setNivel(nuevoNivel);
      const nuevaSecuencia = [...secuencia, Math.floor(Math.random() * 4)];
      setSecuencia(nuevaSecuencia);
      setPosUsuario(0);

      // puntos por ronda completada
      agregarPuntos("simon", 25);

      await dormir(350);
      reproducir(nuevaSecuencia);
    } else {
      setPosUsuario(siguientePos);
    }
  }

  const right = <Navegacion />;

  return (
    <Panel
      title="Simón"
      subtitle="Memoriza y repite la secuencia de colores. Cada ronda suma puntos."
      right={right}
    >
      <div className="simonTop">
        <div className="badge">
          <span>Nivel</span>
          {nivel || 0}
        </div>
        <div className="badge">
          <span>Récord</span>
          {mejorNivel}
        </div>
      </div>

      {mensaje && <div className="notice">{mensaje}</div>}

      <div className="simonGrid" aria-label="Panel de colores">
        {botones.map((b) => (
          <button
            key={b.id}
            className={`simonBtn ${b.clase} ${activo === b.id ? "activo" : ""}`}
            onClick={() => clickColor(b.id)}
            disabled={reproduciendo || secuencia.length === 0}
            aria-label={b.nombre}
            title={b.nombre}
          />
        ))}
      </div>

      <div className="simonActions">
        <Link className="btnLink" to="/">← Menú</Link>
        <button className="btn" onClick={empezar} disabled={reproduciendo || secuencia.length > 0}>
          Empezar
        </button>
        <button className="btnSec" onClick={reiniciar} disabled={reproduciendo && secuencia.length > 0}>
          Reiniciar
        </button>
      </div>

      <p className="hint">
        Consejo: concéntrate en la <b>posición</b> de los colores. Si fallas, ganas puntos según el nivel alcanzado.
      </p>
    </Panel>
  );
}
