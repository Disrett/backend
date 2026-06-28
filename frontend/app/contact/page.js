// app/contact/page.js

export default function ContactPage() {
  return (
    <main className="contact-page">
      <div className="contact-page-inner">
        <h1>Contactez-nous</h1>

        <form className="contact-form">
          <div className="contact-row">
            <div className="contact-field">
              <label htmlFor="nom">Nom</label>
              <input id="nom" type="text" name="nom" placeholder="Nom" />
            </div>

            <div className="contact-field">
              <label htmlFor="prenom">Prénom</label>
              <input id="prenom" type="text" name="prenom" placeholder="Prénom" />
            </div>
          </div>

          <div className="contact-field">
            <label htmlFor="email">Adresse mail</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Adresse mail"
            />
          </div>

          <div className="contact-field">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              rows={6}
              placeholder="Message"
            />
          </div>

          <div className="contact-legal">
            <label className="contact-checkbox">
              <input type="checkbox" name="conditions" />
              <span>
                J&apos;accepte les{" "}
                <a href="/conditions" className="contact-link">
                  conditions d&apos;utilisation.
                </a>
              </span>
            </label>
          </div>

          <button type="submit" className="contact-submit">
            Envoyer
          </button>
        </form>
      </div>
    </main>
  );
}
