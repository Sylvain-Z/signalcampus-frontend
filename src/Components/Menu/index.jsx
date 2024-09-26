import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

function Menu({ toggleMenu }) {
  return (
    <>
      <section className="menu-ctn">
        <button onClick={toggleMenu} className="menu-btn close">
          <FontAwesomeIcon icon={faXmark} size="2xl" />
        </button>
        <div>
          <p>
            <Link to="/temoin" onClick={toggleMenu}>
              Témoigner
            </Link>
          </p>
          <p>
            <Link to="/connexion" onClick={toggleMenu}>
              Se Connecter
            </Link>
          </p>
          <p>
            <Link to="/enregistrement" onClick={toggleMenu}>
              S'enregistrer
            </Link>
          </p>
        </div>

        <p id="imprints-links" onClick={toggleMenu}>
          <Link to="/mentions-legales">Mentions Légales</Link>
        </p>
      </section>
    </>
  );
}
export default Menu;
