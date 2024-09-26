import React, { useState } from "react";
import axios from "axios";

// import "./FormCSS.css";

const UserCreationForm = () => {
  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateEmail(formData.login)) {
      setError("Veuillez entrer une adresse email valide.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/signup", formData);
      setSuccess(
        "Compte créé avec succès ! Vous pouvez maintenant vous connecter."
      );
      window.location.href = "/profil";
      // setFormData({ login: "", password: "" }); // Réinitialiser le formulaire
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Une erreur est survenue lors de la création du compte."
      );
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Créer un nouveau compte</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          {/* <label htmlFor="login" className="form-label">
            Identifiant :
          </label> */}
          <input
            placeholder="Votre email"
            type="email"
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
            minLength="8"
            className="form-input"
          />
        </div>
        <button type="submit" className="form-button">
          Créer le compte
        </button>
      </form>
    </div>
  );
};

export default UserCreationForm;
