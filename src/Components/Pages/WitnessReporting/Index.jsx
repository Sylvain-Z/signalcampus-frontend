import { useState } from "react"
import './witnessReporting.css'

function WitnessReporting() {

  const [email, setEmail] = useState(null)
  const [harasementCategorie, setHarasementCategorie] = useState(null)
  const [reportingContent, setReportingContent] = useState(null)
  const [place, setPlace] = useState(null)
  const [msg, setMsg] = useState(null)
  const [msg2, setMsg2] = useState(null)

  const handlesubmit = (e) => {
    e.preventDefault();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    if (emailRegex.test(email)) {
      if (harasementCategorie && reportingContent && place) {

        // soumission de formulaire

        setMsg('Signalement envoyé')
        setMsg2('')

      } else {
        setMsg('')
        setMsg2('Tous les champs sont requis')
      }
    } else {
      setMsg('')
      setMsg2('Adresse mail non valide')
    }
  }

  return (
    <>
      <section className="reporting-ctn">
        <h2 className="reporting-h2">Formulaire de Signalement</h2>

        <form onSubmit={handlesubmit} className="reporting-form">


          <input
             
            placeholder="Votre email"
            type="text"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form_input"
          />

          <select
             
            name="harasementCategorie"
            onChange={(e) => setHarasementCategorie(e.target.value)}
            className="form_input"
          >
            <option value="rien" selected disabled >Type de harcèlement</option>
            <option value="moral">Moral</option>
            <option value="physique">Physique</option>
            <option value="sexuel">Sexuel</option>
            <option value="cyber">Cyber</option>
          </select>

          <textarea
             
            placeholder="Votre témoignage..."
            type="text"
            name="reportingContent"
            value={reportingContent}
            onChange={(e) => setReportingContent(e.target.value)}
            className="form_input form_textarea"
          />
          <input
             
            placeholder="Où ?"
            type="text"
            name="place"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            className="form_input"
          />
          
          {msg && <p className="msg_valid">{msg}</p>}
          {msg2 && <p className="msg_invalid">{msg2}</p>}

          <button type="submit">Signaler !</button>
        </form>
      </section>
      
    </>
  );
}

export default WitnessReporting;
