import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Logo from '../../../Assets/Images/SignalCampusBlanc.png';

function VictimReporting() {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [submitTimeout, setSubmitTimeout] = useState(null);
  const [msg, setMsg] = useState(null);
  const [count, setCount] = useState(null);
  const [isGeolocationEnabled, setIsGeolocationEnabled] = useState(false);

  // Fonction pour récupérer la géolocalisation
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          setError('Erreur de géolocalisation: ' + error.message);
        }
      );
    } else {
      setError("La géolocalisation n'est pas supportée par votre navigateur.");
    }
  };

  // Utilisation d'un effet pour récupérer la géolocalisation au montage du composant si activée
  useEffect(() => {
    if (isGeolocationEnabled) {
      getLocation();
    }
  }, [isGeolocationEnabled]);

  const toggleGeolocation = () => {
    setIsGeolocationEnabled(!isGeolocationEnabled);
    setError(null);
  };

  const handleSubmit = async () => {
    try {
      let signalementData = {
        isUrgent: true,
        locality: 'Non spécifié',
      };

      if (isGeolocationEnabled && location.latitude && location.longitude) {
        signalementData.latitude = location.latitude;
        signalementData.longitude = location.longitude;
      }

      const response = await axios.post(
        'http://localhost:3000/api/signalements/urgent',
        signalementData
      );
      console.log('Signalement urgent envoyé avec succès:', response.data);
      setMsg('Alerte Envoyée');
      setCount(null);
    } catch (error) {
      console.error("Erreur lors de l'envoi du signalement:", error);
      setError(
        "Erreur lors de l'envoi du signalement urgent. Veuillez réessayer."
      );
    }
  };

  useEffect(() => {
    let countInterval = null;
    if (isChecked) {
      setCount(5); // Démarre le décompte à 5 secondes
      countInterval = setInterval(() => {
        setCount((prev) => prev - 1); // Réduit le décompte chaque seconde
      }, 1000);

      // Si la checkbox est cochée, démarrez un timer de 5 secondes
      setMsg('Une alerte va être envoyée dans ');
      const timeoutId = setTimeout(() => {
        clearInterval(countInterval); // Arrête le décompte
        setCount(null); // Efface le compteur de l'affichage
        handleSubmit(); // Exécute la fonction après 5 secondes
      }, 5000);
      setSubmitTimeout(timeoutId); // Stocke l'ID du timeout
    } else {
      // Réinitialiser les états et annuler les timeouts/intervals
      clearTimeout(submitTimeout);
      clearInterval(countInterval);
      setCount(null); // Réinitialise le compteur
      setMsg(null); // Remet à zéro le message
    }
    // Nettoyage lors du démontage du composant
    return () => {
      clearTimeout(submitTimeout);
      clearInterval(countInterval);
    };
  }, [isChecked]); // Effet exécuté à chaque changement de l'état de la checkbox

  const handleCheckboxChange = () => {
    setIsChecked((prevState) => !prevState); // Inverse l'état de la checkbox
  };

  return (
    <section className="reporting-ctn victim-ctn">
      <div className="geolocation-toggle">
        {/* <label>
          <input
            type="checkbox"
            checked={isGeolocationEnabled}
            onChange={toggleGeolocation}
          />
          Utiliser la géolocalisation
        </label> */}
      </div>
      <div className="container">
        <input
          type="checkbox"
          id="checkbox"
          className="victim-btn"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        <label htmlFor="checkbox" className="button">
          <img src={Logo} alt="logo" />
          <span className="icon">ALERTE</span>
        </label>
      </div>
      {msg && (
        <p className="msg_invalid alert_msg">
          {msg}
          {count}
        </p>
      )}
      {error && <p className="error-message">{error}</p>}
    </section>
  );
}

export default VictimReporting;
