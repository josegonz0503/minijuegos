import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { obtenerRecompensas } from "../utils/recompensas";
import "./Navegacion.css";

export default function Navegacion() {
  const { pathname } = useLocation();
  const [info, setInfo] = useState(() => obtenerRecompensas());

  useEffect(() => {
    const onStorage = (e) => {
      if (!e.key || e.key === "recompensas_v1") setInfo(obtenerRecompensas());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const enlaces = [
    { to: "/", label: "Inicio" },
    { to: "/recompensas", label: "Recompensas" },
  ];

  const activa = (to) => (pathname === to ? "navLink active" : "navLink");

  return (
    <div className="navWrap">
      <div className="navLinks">
        {enlaces.map((p) => (
          <Link key={p.to} to={p.to} className={activa(p.to)}>
            {p.label}
          </Link>
        ))}
      </div>

      <div className="navStats">
        <span className="navPill" title="Puntos totales">
          ⭐ {info.puntosTotales}
        </span>
        <span className="navPill" title="Cupones disponibles">
          🎟️ {info.cupones.filter((c) => !c.usado).length}
        </span>
      </div>
    </div>
  );
}
