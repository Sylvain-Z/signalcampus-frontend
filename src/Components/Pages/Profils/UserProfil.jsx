import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Profils = () => {
  const [user, setUser] = useState(null);
  const [signalements, setSignalements] = useState([]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId; // Assurez-vous que c'est le bon nom de la propriété dans votre token

    fetchUserData(userId);
    fetchUserSignalements(userId);
  }, [navigate]);

  const fetchUserData = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.data && response.data.id) {
        setUser(response.data);
      } else {
        setError("Données utilisateur invalides");
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données utilisateur:",
        error
      );
      if (error.response && error.response.status === 404) {
        setError("Utilisateur non trouvé");
      } else {
        setError("Erreur lors de la récupération des données utilisateur");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUserSignalements = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/users/${userId}/signalements`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSignalements(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des signalements:", error);
      setError("Erreur lors de la récupération des signalements");
    }
  };
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }
    try {
      await axios.put(
        `http://localhost:3000/api/users/${user.id}`,
        { password: newPassword },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Mot de passe mis à jour avec succès");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du mot de passe:", error);
      alert("Erreur lors de la mise à jour du mot de passe");
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible."
      )
    ) {
      try {
        console.log("Tentative de suppression du compte utilisateur:", user.id);
        const response = await axios.delete(`http://localhost:3000/api/users/${user.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        console.log("Réponse du serveur:", response);

        if (response.status === 200) {
          localStorage.removeItem("token");
          alert("Votre compte a été supprimé avec succès.");
          navigate("/login");
        } else {
          throw new Error("Réponse inattendue du serveur");
        }
      } catch (error) {
        console.error(
          "Erreur détaillée lors de la suppression du compte:",
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
                error.response.data.message || "Une erreur est survenue"
              }`
            );
          }
        } else if (error.request) {
          console.error("Erreur de requête:", error.request);
          alert(
            "Erreur de connexion au serveur. Veuillez réessayer plus tard."
          );
        } else {
          console.error(
            "Erreur de configuration de la requête:",
            error.message
          );
          alert(`Une erreur est survenue: ${error.message}`);
        }
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error}</div>;
  if (!user) return <div>Utilisateur non trouvé</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Profil de {user.login}</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Informations utilisateur</h2>
        <p>Login: {user.login}</p>
        <p>Rôle: {user.role === 1 ? "Administrateur" : "Étudient"}</p>
      </section>
      {signalements.length > 0 ? (
        <ul>
          {signalements.map((signalement) => {
            const categoryMap = {
              0: "Moral",
              1: "Physique",
              2: "Sexuel",
              3: "Cyber",
              4: "URGENT",
            };
            const category = categoryMap[signalement.category] || "Inconnu";

            return (
              <li key={signalement.id} className="mb-2">
                Catégorie: {category}, Lieu: {signalement.place}, Date:{" "}
                {new Date(signalement.hours).toLocaleDateString()}, État:{" "}
                {signalement.isProcessed ? "Traité" : "En attente"}
              </li>
            );
          })}
        </ul>
      ) : (
        <p>Vous n'avez pas encore fait de signalements.</p>
      )}

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Changer le mot de passe</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label htmlFor="newPassword" className="block mb-1">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block mb-1">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Changer le mot de passe
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Supprimer le compte</h2>
        <button
          onClick={handleDeleteAccount}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Supprimer mon compte
        </button>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Actions</h2>
        <div className="flex space-x-4">
          <button
            onClick={handleLogout}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Déconnexion
          </button>
        </div>
      </section>
    </div>
  );
};

export default Profils;
