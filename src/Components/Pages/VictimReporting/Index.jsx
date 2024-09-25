import { useState, useEffect } from "react";

import Logo from "../../../Assets/Images/SignalCampusBlanc.png";

function VictimReporting() {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);

  const [isChecked, setIsChecked] = useState(false);
  const [submitTimeout, setSubmitTimeout] = useState(null);
  const [msg, setMsg] = useState(null);
  const [count, setCount] = useState(null);

  // Fonction pour récupérer la géolocalisation
  /*   const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          setError(error.message);
        }
      );
    } else {
      setError("La géolocalisation n'est pas supportée par votre navigateur.");
    }
  }; */

  // Utilisation d'un effet pour récupérer la géolocalisation au montage du composant
  /*   useEffect(() => {
    getLocation();
  }, []); */

  console.log(location, error);

  const handlesubmit = () => {
    //Fonction d'envoie des donnée de géolocalisation en BDD

    setMsg("Alerte Envoyée");
    setCount(null);
  };

  useEffect(() => {
    let countInterval = null;
    if (isChecked) {
      setCount(5); // Démarre le décompte à 5 secondes
      countInterval = setInterval(() => {
        setCount((prev) => prev - 1); // Réduit le décompte chaque seconde
      }, 1000);

      // Si la checkbox est cochée, démarrez un timer de 5 secondes
      setMsg("Une alerte va être envoyé dans ");
      const timeoutId = setTimeout(() => {
        clearInterval(countInterval); // Arrête le décompte
        setCount(null); // Efface le compteur de l'affichage
        handlesubmit(); // Exécute la fonction après 5 secondes
      }, 5000);
      setSubmitTimeout(timeoutId); // Stocke l'ID du timeout
    } else {
      // Si la checkbox est décochée avant 5 secondes, annulez le timer
      clearTimeout(submitTimeout);
    }
    // Nettoyage : annulez le timeout lors du démontage du composant
    return () => clearTimeout(submitTimeout);
  }, [isChecked]); // Effet exécuté à chaque changement de l'état de la checkbox

  const handleCheckboxChange = () => {
    setIsChecked((prevState) => !prevState); // Inverse l'état de la checkbox
  };

  return (
    <>
      <section className="reporting-ctn victim-ctn">
        <div class="container">
          <input
            type="checkbox"
            id="checkbox"
            className="victim-btn"
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
          <label for="checkbox" class="button">
            <img src={Logo} alt="logo" />
            <span class="icon">ALERTE</span>
          </label>
        </div>
        {msg && (<p className="msg_invalid alert_msg">{msg}{count}</p>)}
      </section>
    </>
  );
}

export default VictimReporting;
