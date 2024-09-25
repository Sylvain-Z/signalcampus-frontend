import { Link } from "react-router-dom";
import "./header.css";

function Header() {
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
      </header>
    </>
  );
}

export default Header;
