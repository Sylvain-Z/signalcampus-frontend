import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

function Menu({ toggleMenu }) {
  return (
    <>
      <section className="menu-ctn">
        <button onClick={toggleMenu} className="menu-btn close">
          <FontAwesomeIcon icon={faXmark} size="2xl" />
        </button>
        <div>
          <Link to="/temoin" onClick={toggleMenu}>
            <p>Témoigner</p>
          </Link>
          <Link to="/connexion" onClick={toggleMenu}>
            <p>Se Connecter</p>
          </Link>
          <Link to="/enregistrement" onClick={toggleMenu}>
            <p>S'enregistrer</p>
          </Link>
        </div>

        <p id="imprints" onClick={toggleMenu}>
          <Link to="/mentions-legales">Mentions Légales</Link>
        </p>
      </section>
    </>
  );
}

export default Menu;
