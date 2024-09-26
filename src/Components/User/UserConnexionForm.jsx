import React, { useState } from "react";
import axios from "axios";

// import "./FormCSS.css";

const UserConnexionForm = () => {
  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/api/login", formData);

      const { token, userId, login, role } = response.data;

      // Stockage du token
      localStorage.setItem("token", token);

      // Stockage des informations de l'utilisateur (optionnel)
      localStorage.setItem("userId", userId);
      localStorage.setItem("userLogin", login);
      localStorage.setItem("userRole", role);

      // Configurer axios pour inclure le token dans les futures requêtes
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Redirection ou mise à jour de l'état de l'application
      if (role === 1) {
        window.location.href = "/admin";
      } else {
        window.location.href = "/profil";
      }
      // Exemple de redirection (nécessite react-router) :
      // history.push('/dashboard');
    } catch (err) {
      console.error('Erreur complète:', err);
      setError(
        err.response?.data?.message ||
        `Échec de la connexion. Status: ${err.response?.status}. Détails: ${JSON.stringify(err.response?.data)}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Connexion</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} id="test">
        <div className="form-group">
          {/* <label htmlFor="login" className="form-label">
            Identifiant :
          </label> */}
          <input
            placeholder="Identifiant"
            type="text"
            id="login"
            name="login"
            value={formData.login}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          {/* <label htmlFor="password" className="form-label">
            Mot de passe :
          </label> */}
          <input
            placeholder="Mot de passe"
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <button type="submit" className="form-button" disabled={isLoading}>
          {isLoading ? "Connexion en cours..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
};

export default UserConnexionForm;
