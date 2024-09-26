import React, { useState } from "react";
import axios from "axios";
import Logo from "../../../Assets/Images/SignalCampusBlanc.png";

function VictimReporting() {
  const [error, setError] = useState(null);
  const [isGeolocationEnabled, setIsGeolocationEnabled] = useState(false);

  const toggleGeolocation = () => {
    setIsGeolocationEnabled(!isGeolocationEnabled);
    setError(null);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let signalementData = {
        isUrgent: true,
        locality: "Non spécifié",
        // Vous pouvez ajouter latitude et longitude ici si vous les avez
      };

      const response = await axios.post(
        "http://localhost:3000/api/signalements/urgent",
        signalementData
      );
      console.log("Signalement urgent envoyé avec succès:", response.data);
      // Ajouter ici la logique pour informer l'utilisateur que le signalement a été envoyé
    } catch (error) {
      console.error("Erreur lors de l'envoi du signalement urgent:", error);
      setError(
        "Erreur lors de l'envoi du signalement urgent. Veuillez réessayer."
      );
    }
  };

  return (
    <section className="reporting-ctn victim-ctn">
      <div className="container">
        {/* <div className="geolocation-toggle">
          <label>
            <input
              type="checkbox"
              checked={isGeolocationEnabled}
              onChange={toggleGeolocation}
            />
            Utiliser la géolocalisation
          </label>
        </div> */}
        <input
          type="checkbox"
          id="checkbox"
          className="victim-btn"
          onChange={handleSubmit}
        />
        <label htmlFor="checkbox" className="button">
          <img src={Logo} alt="logo" />
          <span className="icon">ALERTE</span>
        </label>
      </div>
      {/* {error && <p className="error-message">{error}</p>} */}
    </section>
  );
}

export default VictimReporting;
