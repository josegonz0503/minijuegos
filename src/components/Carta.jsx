import "./Carta.css";

export default function Carta({ carta, handleEleccion, volteada, deshabilitado }) {
  const manejarClick = () => {
    if (!deshabilitado) handleEleccion(carta);
  };

  return (
    <div className="carta">
      <div className={volteada ? "volteada" : ""}>
        <img className="delante" src={carta.src} alt="carta frontal" />
        <img
          className="atras"
          src="/img/detras.png"
          alt="carta trasera"
          onClick={manejarClick}
        />
      </div>
    </div>
  );
}
