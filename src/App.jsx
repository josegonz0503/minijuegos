import { BrowserRouter, Routes, Route } from "react-router-dom";
import Inicio from "./pages/Inicio";
import Memoria from "./pages/Memoria";
import Blackjack from "./pages/Blackjack";
import Simon from "./pages/Simon";
import Recompensas from "./pages/Recompensas";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/memoria" element={<Memoria />} />
        <Route path="/blackjack" element={<Blackjack />} />
        <Route path="/simon" element={<Simon />} />
        <Route path="/recompensas" element={<Recompensas />} />
      </Routes>
    </BrowserRouter>
  );
}
