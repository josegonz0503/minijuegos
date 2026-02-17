import "./Panel.css";

export default function Panel({ title, subtitle, right, children }) {
  return (
    <div className="wrap">
      <header className="top">
        <div>
          <h1 className="title">{title}</h1>
          {subtitle && <p className="sub">{subtitle}</p>}
        </div>
        <div className="right">{right}</div>
      </header>
      <div className="panel">{children}</div>
    </div>
  );
}
