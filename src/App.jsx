import { BrowserRouter, Routes, Route } from "react-router-dom";

/* Pages tout publique */
import HOC from "./Components/HOC/Index";
import VictimReporting from "./Components/Pages/VictimReporting/Index";
import ReportingForm from "./Components/Pages/ReportingForm/Index";
import Imprints from "./Components/Pages/Imprints/Index";
import UserCreationForm from "./Components/User/UserCreationForm";
import UserConnexionForm from "./Components/User/UserConnexionForm";
import Profils from "./Components/Pages/Profils/UserProfil";
import Admin from "./Components/Pages/Admin/Admin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HOC child={VictimReporting} />} />
        <Route path="/admin" element={<HOC child={Admin} />} />
        <Route path="/temoin" element={<HOC child={ReportingForm} />} />
        <Route path="/mentions-legales" element={<HOC child={Imprints} />} />
        <Route path="/login" element={<HOC child={UserConnexionForm} />} />
        <Route path="/signup" element={<HOC child={UserCreationForm} />} />
        <Route path="/profil" element={<HOC child={Profils} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
