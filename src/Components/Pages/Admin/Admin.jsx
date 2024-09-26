import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Admin = () => {
  const [signalements, setSignalements] = useState([]);
  const [selectedSignalement, setSelectedSignalement] = useState(null);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;

    checkUserRole(userId);
  }, [navigate]);
  const checkUserRole = async (userId) => {
    try {
      const response = await axios.get(`/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUserRole(response.data.role);
      if (response.data.role !== 1) {
        navigate("/");
      }
    } catch (error) {
      setError("Erreur lors de la vérification des droits d'accès");
      navigate("/");
    }
  };

  useEffect(() => {
    if (userRole === 1) {
      fetchSignalements();
    }
  }, [userRole]);

  const fetchSignalements = async () => {
    try {
      const response = await axios.get("/api/signalements", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSignalements(response.data);
    } catch (error) {
      setError("Erreur lors de la récupération des signalements");
    }
  };

  const handleSignalementClick = async (id) => {
    try {
      const response = await axios.get(`/api/signalements/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const signalementData = response.data;

      // Récupérer les informations de l'utilisateur
      const userResponse = await axios.get(
        `/api/users/${signalementData.idUser}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setSelectedSignalement({
        ...signalementData,
        userLogin: userResponse.data.login, // Ajouter le login de l'utilisateur
      });
    } catch (error) {
      setError("Erreur lors de la récupération du signalement");
    }
  };

  const handleUpdateSignalement = async (id) => {
    try {
      await axios.put(
        `/api/signalements/${id}`,
        { isProcessed: true },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchSignalements();
      setSelectedSignalement(null);
    } catch (error) {
      setError("Erreur lors de la mise à jour du signalement");
    }
  };

  const handleDeleteSignalement = async (id) => {
    try {
      await axios.delete(`/api/signalements/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchSignalements();
      setSelectedSignalement(null);
    } catch (error) {
      setError("Erreur lors de la suppression du signalement");
    }
  };

  if (userRole !== 1) {
    return null;
  }

  const categoryMap = {
    0: "Moral",
    1: "Physique",
    2: "Sexuel",
    3: "Cyber",
    4: "URGENT",
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1
        style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}
      >
        Back Office Admin
      </h1>
      {error && (
        <div
          style={{
            backgroundColor: "#FFCCCC",
            color: "#CC0000",
            padding: "10px",
            borderRadius: "5px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}
      <div style={{ display: "flex" }}>
        <div style={{ width: "50%", paddingRight: "20px" }}>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "semibold",
              marginBottom: "10px",
            }}
          >
            Liste des signalements
          </h2>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {signalements.map((signalement) => (
              <li
                key={signalement.id}
                style={{
                  cursor: "pointer",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  marginBottom: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                onClick={() => handleSignalementClick(signalement.id)}
              >
                <span>
                  {categoryMap[signalement.category] || "Catégorie inconnue"}
                </span>
                <span
                  style={{
                    padding: "5px 10px",
                    borderRadius: "15px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: "white",
                    backgroundColor: signalement.isProcessed
                      ? "#4CAF50"
                      : "#FFA500",
                  }}
                >
                  {signalement.isProcessed ? "Traité" : "Non traité"}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div style={{ width: "50%", paddingLeft: "20px" }}>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "semibold",
              marginBottom: "10px",
            }}
          >
            Détails du signalement
          </h2>
          {selectedSignalement && (
            <div
              style={{
                border: "1px solid #ccc",
                padding: "20px",
                borderRadius: "5px",
              }}
            >
              <p>
                <strong>Créé par:</strong> {selectedSignalement.userLogin}
              </p>
              <p>
                <strong>Catégorie:</strong>{" "}
                {categoryMap[selectedSignalement.category] ||
                  "Catégorie inconnue"}
              </p>
              <p>
                <strong>Lieu:</strong> {selectedSignalement.place}
              </p>
              <p>
                <strong>date et heure:</strong>{" "}
                {new Intl.DateTimeFormat("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(new Date(selectedSignalement.hours))}
              </p>
              <p>
                <strong>Contenu:</strong> {selectedSignalement.reportingContent}
              </p>
              <p>
                <strong>État:</strong>{" "}
                {selectedSignalement.isProcessed ? "Traité" : "Non traité"}
              </p>
              <div style={{ marginTop: "20px" }}>
                <button
                  onClick={() =>
                    handleUpdateSignalement(selectedSignalement.id)
                  }
                  style={{
                    backgroundColor: "#4CAF50",
                    color: "white",
                    padding: "10px 15px",
                    border: "none",
                    borderRadius: "5px",
                    marginRight: "10px",
                    cursor: "pointer",
                  }}
                >
                  Marquer comme traité
                </button>
                <button
                  onClick={() =>
                    handleDeleteSignalement(selectedSignalement.id)
                  }
                  style={{
                    backgroundColor: "#f44336",
                    color: "white",
                    padding: "10px 15px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Supprimer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
