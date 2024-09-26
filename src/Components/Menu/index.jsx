import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

function Menu({ toggleMenu }) {
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;
        verifyUserRole(userId, token);
      } catch (error) {
        console.error('Erreur lors du décodage du token:', error);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const verifyUserRole = async (userId, token) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/users/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserRole(response.data.role);
    } catch (error) {
      console.error(
        "Erreur lors de la vérification du rôle de l'utilisateur:",
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>; // Ou un spinner, ou rien si vous préférez
  }

  return (
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
        {userRole !== null ? (
          <>
            <p>
              <Link to="/profil" onClick={toggleMenu}>
                Profil
              </Link>
            </p>
            {userRole === 1 && (
              <p>
                <Link to="/admin" onClick={toggleMenu}>
                  Admin
                </Link>
              </p>
            )}
          </>
        ) : (
          <>
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
          </>
        )}
      </div>

      <p id="imprints-links" onClick={toggleMenu}>
        <Link to="/mentions-legales">Mentions Légales</Link>
      </p>
    </section>
  );
}

export default Menu;
