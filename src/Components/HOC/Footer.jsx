import { Link } from "react-router-dom";
import './footer.css'

function Footer() {

    return (
        <>
            <footer>
                <p id="imprints"><Link to="/mentions-legales">Mentions Légales</Link></p>
            </footer>

        </>
    );
}

export default Footer;