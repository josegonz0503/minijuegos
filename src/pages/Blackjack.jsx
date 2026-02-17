import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Panel from "../components/Panel";
import { crearBaraja, valorCarta } from "../utils/cartas";
import { obtenerMejor, actualizarMejor } from "../utils/puntuaciones";
import { agregarPuntos } from "../utils/recompensas";
import Navegacion from "../components/Navegacion";
import "./Blackjack.css";

function shuffle(deck) {
  return [...deck].sort(() => Math.random() - 0.5);
}

function total(hand) {
  let t = hand.reduce((s, c) => s + valorCarta(c), 0);
  let aces = hand.filter((c) => c.valor === "A").length;
  while (t > 21 && aces) {
    t -= 10;
    aces--;
  }
  return t;
}

function readStats() {
  try {
    return JSON.parse(localStorage.getItem("bj_stats_v1")) || { w: 0, l: 0, d: 0 };
  } catch {
    return { w: 0, l: 0, d: 0 };
  }
}
function writeStats(s) {
  localStorage.setItem("bj_stats_v1", JSON.stringify(s));
}

export default function Blackjack() {
  const [deck, setDeck] = useState([]);
  const [player, setPlayer] = useState([]);
  const [dealer, setDealer] = useState([]);
  const [state, setState] = useState("idle"); 
  const [msg, setMsg] = useState("");

  const [stats, setStats] = useState(readStats());
  const bestWins = obtenerMejor("blackjack_wins"); 

  const pt = total(player);
  const dt = total(dealer);

  const canPlay = state === "playing";
  const canHit = canPlay && pt < 21 && deck.length > 0;

  function start() {
    const d = shuffle(crearBaraja());
    setDeck(d.slice(4));
    setPlayer([d[0], d[2]]);
    setDealer([d[1], d[3]]);
    setState("playing");
    setMsg("");
  }

  function hit() {
    if (!canHit) return;
    setPlayer((p) => [...p, deck[0]]);
    setDeck((d) => d.slice(1));
  }

  function stand() {
    if (!canPlay) return;
    let d = [...dealer];
    let r = [...deck];

    while (total(d) < 17 && r.length) {
      d.push(r[0]);
      r = r.slice(1);
    }

    setDealer(d);
    setDeck(r);
    setState("end");
  }

  useEffect(() => {
    if (state === "playing" && (pt >= 21)) {
      setTimeout(() => stand(), 250);
    }
  }, [pt, state]);

  useEffect(() => {
    if (state !== "end") return;

    let outcome = "draw";
    if (pt > 21) outcome = "lose";
    else if (dt > 21) outcome = "win";
    else if (pt > dt) outcome = "win";
    else if (pt < dt) outcome = "lose";

    const next = { ...stats };
    if (outcome === "win") next.w += 1;
    if (outcome === "lose") next.l += 1;
    if (outcome === "draw") next.d += 1;

    setStats(next);
    writeStats(next);

    if (outcome === "win") {
      const isNew = actualizarMejor("blackjack_wins", next.w, "max");
      const bonus = pt === 21 && player.length === 2 ? 220 : 150;
      agregarPuntos("blackjack", bonus);
      setMsg(isNew ? "🏆 Victoria i nou récord de victorias!" : "✅ Has ganado!");
    } else if (outcome === "lose") {
      setMsg(" Has perdido");
    } else {
      setMsg(" Empate");
    }
  }, [state]);

  const right = useMemo(() => {
    return (
      <div className="row">
        <Navegacion />
        <div className="badge"><span>Jugador</span>{pt}</div>
        <div className="badge"><span>Dealer</span>{dt}</div>
        <div className="badge"><span>W</span>{stats.w}</div>
        <div className="badge"><span>L</span>{stats.l}</div>
        <div className="badge"><span>D</span>{stats.d}</div>
        <div className="badge"><span>Récord W</span>{bestWins ?? "—"}</div>
        <button className="btn btnPrimary" onClick={start}>Nueva mano</button>
      </div>
    );
  }, [pt, dt, stats, bestWins]);

  return (
    <Panel
      title="Blackjack"
      subtitle="Objetivo: acercarte a 21 sin pasarte. El crupier se planta con 17."
      right={right}
    >
      <div style={{ marginBottom: 12 }}>
        <Link className="backLink" to="/">← Menú</Link>
      </div>

      {msg && <div className="notice">{msg}</div>}

      <div className="bjTable">
        <div className="bjCol">
          <h3>Dealer</h3>
          <div className="hand">
            {dealer.map((c, i) => (
              <img key={i} className="cardImg" src={c.imagen} alt={c.codigo} />
            ))}
          </div>
        </div>

        <div className="bjCol">
          <h3>Jugador</h3>
          <div className="hand">
            {player.map((c, i) => (
              <img key={i} className="cardImg" src={c.imagen} alt={c.codigo} />
            ))}
          </div>
        </div>
      </div>

      <div className="actions">
        <button className="btn" onClick={hit} disabled={!canHit}>
          Pedir
        </button>
        <button className="btn" onClick={stand} disabled={!canPlay}>
          Plantar-se
        </button>
      </div>

      {state === "idle" && (
        <p className="hint">Pulsa “Nueva mano” para empezar.</p>
      )}
    </Panel>
  );
}
