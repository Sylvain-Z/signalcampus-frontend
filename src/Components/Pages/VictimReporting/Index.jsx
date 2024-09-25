import { useState, useEffect } from 'react';

import Logo from '../../../Assets/Images/SignalCampusBlanc.png';

function VictimReporting() {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);

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

  const handlesubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <section className="reporting-ctn victim-ctn">
        <div class="container">
          <input type="checkbox" id="checkbox" className="victim-btn" />
          <label for="checkbox" class="button">
            <img src={Logo} alt="logo" />
            <span class="icon">ALERTE</span>
          </label>
        </div>
      </section>
    </>
  );
}

export default VictimReporting;
