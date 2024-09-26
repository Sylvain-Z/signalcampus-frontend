import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Profils = () => {
  const [user, setUser] = useState(null);
  const [signalements, setSignalements] = useState([]);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/connexion');
      return;
    }

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId; // Assurez-vous que c'est le bon nom de la propriété dans votre token

    fetchUserData(userId);
    fetchUserSignalements(userId);
  }, [navigate]);

  const fetchUserData = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/users/${userId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      if (response.data && response.data.id) {
        setUser(response.data);
      } else {
        setError('Données utilisateur invalides');
      }
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des données utilisateur:',
        error
      );
      if (error.response && error.response.status === 404) {
        setError('Utilisateur non trouvé');
      } else {
        setError('Erreur lors de la récupération des données utilisateur');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUserSignalements = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/users/${userId}/signalements`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setSignalements(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des signalements:', error);
      setError('Erreur lors de la récupération des signalements');
    }
  };
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    try {
      await axios.put(
        `http://localhost:3000/api/users/${user.id}`,
        { password: newPassword },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      alert('Mot de passe mis à jour avec succès');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du mot de passe:', error);
      alert('Erreur lors de la mise à jour du mot de passe');
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.'
      )
    ) {
      try {
        console.log('Tentative de suppression du compte utilisateur:', user.id);
        const response = await axios.delete(
          `http://localhost:3000/api/users/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        console.log('Réponse du serveur:', response);

        if (response.status === 200) {
          localStorage.removeItem('token');
          alert('Votre compte a été supprimé avec succès.');
          navigate('/login');
        } else {
          throw new Error('Réponse inattendue du serveur');
        }
      } catch (error) {
        console.error(
          'Erreur détaillée lors de la suppression du compte:',
          error
        );

        if (error.response) {
          console.error("Données de réponse d'erreur:", error.response.data);
          console.error("Statut de l'erreur:", error.response.status);
          console.error("En-têtes de l'erreur:", error.response.headers);

          if (error.response.status === 500) {
            alert(
              "Une erreur interne du serveur s'est produite. Veuillez contacter l'administrateur."
            );
          } else if (error.response.status === 403) {
            alert("Vous n'avez pas les droits pour effectuer cette action.");
          } else {
            alert(
              `Erreur lors de la suppression du compte: ${
                error.response.data.message || 'Une erreur est survenue'
              }`
            );
          }
        } else if (error.request) {
          console.error('Erreur de requête:', error.request);
          alert(
            'Erreur de connexion au serveur. Veuillez réessayer plus tard.'
          );
        } else {
          console.error(
            'Erreur de configuration de la requête:',
            error.message
          );
          alert(`Une erreur est survenue: ${error.message}`);
        }
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error}</div>;
  if (!user) return <div>Utilisateur non trouvé</div>;

  return (
    <div className="profil-ctn shadow">
      {/* <h1 className="profil-title">Profil de {user.login}</h1> */}

      <section className="info-user info-profil">
        <span className="profil-txt shadow">
          <p>{user.login}</p>
        </span>
        <span className="profil-txt shadow">
          <p>{user.role === 1 ? 'Administrateur' : 'Étudient'}</p>
        </span>
      </section>
      <section className="profil-section ">
        {signalements.length > 0 ? (
          <ul className="profil-list">
            {signalements.map((signalement) => {
              const categoryMap = {
                0: 'Moral',
                1: 'Physique',
                2: 'Sexuel',
                3: 'Cyber',
                4: 'URGENT',
              };
              const category = categoryMap[signalement.category] || 'Inconnu';

              return (
                <li key={signalement.id} className="mb-2">
                  Catégorie: {category}, Lieu: {signalement.place}, Date:{' '}
                  {new Date(signalement.hours).toLocaleDateString()}, État:{' '}
                  {signalement.isProcessed ? 'Traité' : 'En attente'}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="profil-empty ">
            Vous n'avez pas encore fait de signalements.
          </p>
        )}
      </section>

      <section className="info-user">
        <h2 className="profil-label">Changer le mot de passe</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <input
              placeholder="Nouveau mot de passe"
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <input
              placeholder="Confirmer le mot de passe"
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button type="submit" className="form-button">
            Changer le mot de passe
          </button>
        </form>
      </section>

      <section className="section-ctn">
        <button onClick={handleDeleteAccount} className="form-button">
          Supprimer mon compte
        </button>

        <button onClick={handleLogout} className="form-button">
          Déconnexion
        </button>
      </section>
    </div>
  );
};

export default Profils;
