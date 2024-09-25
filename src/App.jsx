import { BrowserRouter, Routes, Route } from "react-router-dom";

/* Pages tout publique */
import HOC from "./Components/HOC/Index";
import VictimReporting from "./Components/Pages/VictimReporting/Index";
import WitnessReporting from "./Components/Pages/WitnessReporting/Index";
import Imprints from "./Components/Pages/Imprints/Index";

/* Pages utilisateurs */

import UserCreationForm from "./Components/User/UserCreationForm";
import UserConnexionForm from "./Components/User/UserConnexionForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HOC child={VictimReporting} />} />
        <Route path="/temoin" element={<HOC child={WitnessReporting} />} />
        <Route path="/mentions-legales" element={<HOC child={Imprints} />} />
        <Route path="/enregistrement" element={<HOC child={UserCreationForm} />} />
        <Route path="/connexion" element={<HOC child={UserConnexionForm} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
