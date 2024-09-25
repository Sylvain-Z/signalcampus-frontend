import { Link, useLocation } from "react-router-dom";

import Logo from "../../Assets/Images/faviconblanc.png";

function Header() {
  const location = useLocation();

  return (
    <>
      <header>
        {location.pathname === "/" ? (
          <>
            <p className="warning">
              En cas de comportement problématique, appuyez en dessous
            </p>
          </>
        ) : (
          <>
            <Link to="/">
              <img
                src={Logo}
                alt="logo"
                className="header-img"
                title="faire un signalement"
              />
            </Link>
          </>
        )}
      </header>
    </>
  );
}

export default Header;
