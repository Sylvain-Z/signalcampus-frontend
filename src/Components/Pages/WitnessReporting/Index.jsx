import { useState } from "react";
import axios from "axios";

function WitnessReporting() {
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [reportingContent, setReportingContent] = useState("");
  const [place, setPlace] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      setError("Adresse mail non valide");
      return;
    }

    if (!category || !reportingContent || !place) {
      setError("Tous les champs sont requis");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Vous devez être connecté pour créer un signalement");
        return;
      }

      const response = await axios.post(
        "/api/signalements",
        {
          category: parseInt(category),
          place,
          reportingContent,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMsg("Signalement envoyé avec succès");
      // Réinitialiser le formulaire
      setEmail("");
      setCategory("");
      setReportingContent("");
      setPlace("");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Une erreur est survenue lors de l'envoi du signalement"
      );
    }
  };

  return (
    <section className="reporting-ctn witness-ctn">
      <h2 className="reporting-h2">Témoigner</h2>

      <form onSubmit={handleSubmit} className="reporting-form">
        <input
          placeholder="Votre email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form_input"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="form_input"
        >
          <option value="" disabled>
            Type de harcèlement
          </option>
          <option value="0">Moral</option>
          <option value="1">Physique</option>
          <option value="2">Sexuel</option>
          <option value="3">Cyber</option>
        </select>

        <textarea
          placeholder="Votre témoignage..."
          value={reportingContent}
          onChange={(e) => setReportingContent(e.target.value)}
          className="form_input form_textarea"
        />

        <input
          placeholder="Où ?"
          type="text"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          className="form_input"
        />

        {msg && <p className="msg_valid">{msg}</p>}
        {error && <p className="msg_invalid">{error}</p>}

        <button type="submit" className="witness-btn">
          Signaler !
        </button>
      </form>
    </section>
  );
}

export default WitnessReporting;
