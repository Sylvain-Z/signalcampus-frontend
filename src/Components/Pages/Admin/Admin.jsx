import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './Admin.css'; // Assurez-vous que le chemin est correct

const Admin = () => {
  const [signalements, setSignalements] = useState([]);
  const [selectedSignalementId, setSelectedSignalementId] = useState(null);
  const [selectedSignalement, setSelectedSignalement] = useState(null);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;

    checkUserRole(userId);
  }, [navigate]);
  const checkUserRole = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/users/${userId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setUserRole(response.data.role);
      if (response.data.role !== 1) {
        navigate('/');
      }
    } catch (error) {
      setError("Erreur lors de la vérification des droits d'accès");
      navigate('/');
    }
  };

  useEffect(() => {
    if (userRole === 1) {
      fetchSignalements();
    }
  }, [userRole]);

  const fetchSignalements = async () => {
    try {
      const response = await axios.get(
        'http://localhost:3000/api/signalements',
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setSignalements(response.data);
    } catch (error) {
      setError('Erreur lors de la récupération des signalements');
    }
  };

  const handleSignalementClick = async (id) => {
    if (selectedSignalementId === id) {
      // Si le signalement est déjà ouvert, on le ferme
      setSelectedSignalementId(null);
    } else {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/signalements/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        const signalementData = response.data;

        // Récupérer les informations de l'utilisateur
        const userResponse = await axios.get(
          `http://localhost:3000/api/users/${signalementData.idUser}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        const updatedSignalement = {
          ...signalementData,
          userLogin: userResponse.data.login,
        };

        // Mettre à jour le signalement dans la liste
        setSignalements(
          signalements.map((s) => (s.id === id ? updatedSignalement : s))
        );

        // Ouvrir le détail du signalement
        setSelectedSignalementId(id);
      } catch (error) {
        setError('Erreur lors de la récupération du signalement');
      }
    }
  };

  const handleUpdateSignalement = async (id) => {
    try {
      await axios.put(
        `http://localhost:3000/api/signalements/${id}`,
        { isProcessed: true },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      // Mettre à jour le signalement dans la liste locale
      setSignalements(
        signalements.map((s) => (s.id === id ? { ...s, isProcessed: true } : s))
      );
    } catch (error) {
      setError('Erreur lors de la mise à jour du signalement');
    }
  };

  const handleDeleteSignalement = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/signalements/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      // Supprimer le signalement de la liste locale
      setSignalements(signalements.filter((s) => s.id !== id));
      setSelectedSignalementId(null);
    } catch (error) {
      setError('Erreur lors de la suppression du signalement');
    }
  };

  if (userRole !== 1) {
    return null;
  }

  const categoryMap = {
    0: 'Moral',
    1: 'Physique',
    2: 'Sexuel',
    3: 'Cyber',
    4: 'URGENT',
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">Back Office Admin</h1>
      {error && <div className="admin-error">{error}</div>}
      <div className="admin-content">
        <h2 className="admin-subtitle">Liste des signalements</h2>
        <ul className="signalement-list">
          {signalements.map((signalement) => (
            <li key={signalement.id} className="signalement-item">
              <div
                className={`signalement-header ${
                  selectedSignalementId === signalement.id ? 'active' : ''
                }`}
                onClick={() => handleSignalementClick(signalement.id)}
              >
                <span>
                  {categoryMap[signalement.category] || 'Catégorie inconnue'}
                </span>
                <span
                  className={`signalement-status ${
                    signalement.isProcessed ? 'processed' : 'unprocessed'
                  }`}
                >
                  {signalement.isProcessed ? 'Traité' : 'Non traité'}
                </span>
              </div>
              {selectedSignalementId === signalement.id && (
                <div className="signalement-details">
                  <p>
                    <strong>Créé par:</strong> {signalement.userLogin}
                  </p>
                  <p>
                    <strong>Catégorie:</strong>{' '}
                    {categoryMap[signalement.category] || 'Catégorie inconnue'}
                  </p>
                  <p>
                    <strong>Lieu:</strong> {signalement.place}
                  </p>
                  <p>
                    <strong>Date et heure:</strong>{' '}
                    {new Intl.DateTimeFormat('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    }).format(new Date(signalement.hours))}
                  </p>

                  <p>
                    <strong>État:</strong>{' '}
                    {signalement.isProcessed ? 'Traité' : 'Non traité'}
                  </p>
                  <div className="signalement-actions">
                    <button
                      onClick={() => handleUpdateSignalement(signalement.id)}
                      className="button-signalement button-process"
                      disabled={signalement.isProcessed}
                    >
                      Marquer comme traité
                    </button>
                    <button
                      onClick={() => handleDeleteSignalement(signalement.id)}
                      className="button-signalement button-delete"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Admin;
