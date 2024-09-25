import { Link, useLocation } from "react-router-dom";

function Header() {
  const location = useLocation();

  return (
    <>
      <header>
        <Link to="/">
          <img
            src="./favicon.ico"
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
