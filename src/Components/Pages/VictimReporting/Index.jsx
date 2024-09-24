import { useState, useEffect } from "react";
import "./victimReporting.css";

function VictimReporting() {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);

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
          setError(error.message);
        }
      );
    } else {
      setError("La géolocalisation n'est pas supportée par votre navigateur.");
    }
  };

  // Utilisation d'un effet pour récupérer la géolocalisation au montage du composant
  useEffect(() => {
    getLocation();
  }, []);

  console.log(location, error);

  const handlesubmit = (e) => {
    e.preventDefault();


  };
 
  return (
    <>
      <section className="reporting-ctn">

          <button onClick={handlesubmit} className="victim-btn">S.O.S</button>

      </section>
    </>
  )
}

export default VictimReporting;
