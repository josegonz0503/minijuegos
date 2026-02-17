import { Link } from "react-router-dom";
import Panel from "../components/Panel";
import Navegacion from "../components/Navegacion";
import "./Inicio.css";

export default function Inicio() {
  return (
    <Panel title="Minijuegos" subtitle={null} right={<Navegacion />}>
      <div className="inicioGrid">
        <Link to="/memoria" className="inicioTile" aria-label="Jugar a Memoria">
          <div className="inicioTileTitle">Memory</div>
          <img src="/img/memory.png" alt="Memory" />
          <div className="inicioTileSub">Encuentra todas las parejas.</div>
        </Link>

        <Link to="/blackjack" className="inicioTile" aria-label="Jugar al Blackjack">
          <div className="inicioTileTitle">Blackjack</div>
          <img src="/img/blackjack.jpg" alt="Memory" />
          <div className="inicioTileSub">Llega a 21 sin pasarte.</div>
        </Link>

        <Link to="/simon" className="inicioTile" aria-label="Jugar al Simón">
          <div className="inicioTileTitle">Simón</div>
                    <img src="/img/simon.avif" alt="Memory" />
          <div className="inicioTileSub">Repite la secuencia de colores.</div>
        </Link>
      </div>

      
    </Panel>
  );
}
