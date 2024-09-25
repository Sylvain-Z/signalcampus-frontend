import { useEffect, useState } from 'react'
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faFlag, faHome, faEye } from "@fortawesome/free-solid-svg-icons";

function NavBar() {
  const location = useLocation();

  /* Menu Burger */
  const [menuHidden, setMenuHidden] = useState(true);
  const toggleMenu = () => {
      setMenuHidden(prevMenuHidden => !prevMenuHidden);
  };

  useEffect(() => { // pour que le menu se referme automatiquement si l'internaute ne s'en sert pas
      let intervalId;
      if (!menuHidden) {
          intervalId = setInterval(toggleMenu, 70000);
      }
      return () => clearInterval(intervalId); // Nettoie l'intervalle lorsque le composant est démonté
  }, [menuHidden]); // Utilisation de [menuHidden] comme dépendance

  const handleButtonClick = () => {
      toggleMenu();
  };

  return (
    <>
      <nav>
        <Link to={location.pathname === "/" ? "/temoin" : "/"}>
            {location.pathname === "/" ? (<><FontAwesomeIcon icon={faEye} /></>) : (<><FontAwesomeIcon icon={faFlag} /></>)}
        </Link>
        <Link to="/">
          <FontAwesomeIcon icon={faHome} />
        </Link>
        <button onClick={toggleMenu}>
          <FontAwesomeIcon icon={faUser} />
        </button>
      </nav>
    </>
  );
}

export default NavBar;
