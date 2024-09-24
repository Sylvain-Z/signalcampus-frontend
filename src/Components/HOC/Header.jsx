import { Link, useLocation  } from "react-router-dom";
import "./header.css";

function Header() {

  const location  = useLocation ()

  return (
    <>
      <header>
        <Link to="/">
          <div className="ctn-logo">
            <img
              src="./favicon.ico"
              alt="logo"
              className="header-img"
              title="faire un signalement"
            />
            <h1>SignalCampus</h1>
          </div>
        </Link>
        <Link to={location.pathname  === "/"  ? "/temoin" : "/"}>
            <img
              src={location.pathname  === "/"  ? "./favicon.ico" : "./here.png"}
              alt="logo"
              className="header-img"
              title="faire un signalement"
            />
        </Link>
      </header>
    </>
  );
}

export default Header;
