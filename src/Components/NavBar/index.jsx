import { Link, useLocation } from "react-router-dom";

function NavBar() {
  const location = useLocation();

  return (
    <>
      <nav>
        <Link to={location.pathname === "/" ? "/temoin" : "/"}>
          <img
            src={location.pathname === "/" ? "./favicon.ico" : "./here.png"}
            alt="logo"
            className="header-img"
            title="faire un signalement"
          />
        </Link>
        <Link to="/">
            <img
              src="./favicon.ico"
              alt="logo"
              className="header-img"
              title="faire un signalement"
            />
        </Link>
        <Link to="/">
            <img
              src="./favicon.ico"
              alt="logo"
              className="header-img"
              title="faire un signalement"
            />
        </Link>
      </nav>
    </>
  );
}

export default NavBar;
