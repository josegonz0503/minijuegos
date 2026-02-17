import { useEffect, useState } from "react";
import Panel from "../components/Panel";
import Navegacion from "../components/Navegacion";
import { obtenerRecompensas, marcarCuponUsado } from "../utils/recompensas";
import "./Recompensas.css";

function formatearFecha(ts) {
  try {
    return new Intl.DateTimeFormat("es-ES", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(ts));
  } catch {
    return new Date(ts).toLocaleString();
  }
}

export default function Recompensas() {
  const [info, setInfo] = useState(() => obtenerRecompensas());

  useEffect(() => {
    const onStorage = (e) => {
      if (!e.key || e.key === "recompensas_v1") setInfo(obtenerRecompensas());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const disponibles = info.cupones.filter((c) => !c.usado);
  const usados = info.cupones.filter((c) => c.usado);

  return (
    <Panel
      title="Recompensas"
      subtitle="Tus puntos y cupones desbloqueados. Se guarda en LocalStorage."
      right={<Navegacion />}
    >
      <div className="recompRow">
        <div className="card">
          <div className="cardTitle"> Puntos totales</div>
          <div className="bigNumber">{info.puntosTotales}</div>
        </div>

        <div className="card">
          <div className="cardTitle"> Puntos por juego</div>
          <div className="lista">
            {Object.keys(info.puntosPorJuego).length === 0 ? (
              <div className="muted">Todavía no has ganado puntos.</div>
            ) : (
              Object.entries(info.puntosPorJuego).map(([j, p]) => (
                <div className="fila" key={j}>
                  <span className="tag">{j}</span>
                  <b>{p}</b>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="recompRow">
        <div className="card">
          <div className="cardTitle"> Cupones disponibles</div>
          {disponibles.length === 0 ? (
            <div className="muted">Aún no tienes cupones disponibles.</div>
          ) : (
            <div className="cupones">
              {disponibles.map((c) => (
                <div className="cupon" key={c.codigo}>
                  <div>
                    <div className="cuponCodigo">{c.codigo}</div>
                    <div className="muted">
                      {c.porcentaje}% · desbloqueado {formatearFecha(c.desbloqueadoEn)}
                    </div>
                  </div>
                  <button className="btnSec" onClick={() => marcarCuponUsado(c.codigo)}>
                    Marcar como usado
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="cardTitle">🧾 Cupones usados</div>
          {usados.length === 0 ? (
            <div className="muted">Aún no has usado cupones.</div>
          ) : (
            <div className="cupones">
              {usados.map((c) => (
                <div className="cupon" key={c.codigo}>
                  <div>
                    <div className="cuponCodigo">{c.codigo}</div>
                    <div className="muted">
                      {c.porcentaje}% · desbloqueado {formatearFecha(c.desbloqueadoEn)}
                    </div>
                  </div>
                  <span className="tag usado">Usado</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Panel>
  );
}
