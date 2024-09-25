import { Link } from "react-router-dom";

function Menu() {
  return (
    <>
      <section className="menu-ctn">
        <Link to="/">
          <img
            src="./favicon.ico"
            alt="logo"
            className="header-img"
            title="faire un signalement"
          />
        </Link>

        <div>
          <Link to="/">
            <p>Témoigner</p>
          </Link>
          <Link to="/se-connecter">
            <p>Se Connecter</p>
          </Link>
          <Link to="/s'enregistrer">
            <p>S'enregistrer</p>
          </Link>
        </div>

        <p id="imprints">
          <Link to="/mentions-legales">Mentions Légales</Link>
        </p>
      </section>
    </>
  );
}

export default Menu;
