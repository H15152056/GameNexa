import { Link } from 'react-router-dom'
import './LegalPage.css'

function LegalPage() {
  return (
    <div className="legal-page">
      <header className="legal-header">
        <Link to="/" className="legal-back">
          ← Back to GameNexa
        </Link>

        <span className="legal-label">GAMENEXA</span>

        <h1>Legal & Information</h1>

        <p>
          Important information, policies and contact details for GameNexa.
        </p>
      </header>

      <main className="legal-content">
        <section id="about">
          <h2>About GameNexa</h2>
          <p>
            GameNexa is a focused gaming information website providing game
            databases, character and hero information, guides and practical
            gaming resources.
          </p>
          <p>
            Our goal is to keep gaming information organized, useful and easy
            to explore.
          </p>
        </section>

        <section id="contact">
          <h2>Contact</h2>
          <p>
            If you have questions, suggestions, corrections, copyright
            concerns or other inquiries, please contact the GameNexa team.
          </p>
          <p>
            For copyright and DMCA matters, please use the DMCA section below.
          </p>
        </section>

        <section id="privacy">
          <h2>Privacy Policy</h2>
          <p>
            GameNexa respects your privacy. We may collect limited information
            required to operate, secure and improve the website.
          </p>
          <p>
            GameNexa may use cookies, analytics services and advertising
            services such as Google AdSense. Third-party services may use
            cookies or similar technologies according to their own privacy
            policies.
          </p>
          <p>
            We do not sell personal information to advertisers.
          </p>
        </section>

        <section id="terms">
          <h2>Terms of Service</h2>
          <p>
            By using GameNexa, you agree to use the website lawfully and
            responsibly.
          </p>
          <p>
            Website content is provided for informational and entertainment
            purposes. GameNexa may update, modify or remove content at any
            time.
          </p>
        </section>

        <section id="disclaimer">
          <h2>Disclaimer</h2>
          <p>
            GameNexa is an independent gaming information website and is not
            affiliated with, endorsed by or sponsored by the game publishers
            or developers mentioned on this website unless explicitly stated.
          </p>
          <p>
            Game names, characters, images, trademarks and related intellectual
            property belong to their respective owners.
          </p>
          <p>
            Information on GameNexa is provided on an "as is" basis. We do not
            guarantee that every piece of information will always be complete,
            current or error-free.
          </p>
        </section>

        <section id="dmca">
          <h2>DMCA & Copyright</h2>
          <p>
            GameNexa respects the intellectual property rights of others. If
            you believe that copyrighted material has been used on the website
            without authorization, please contact us with sufficient
            information to identify the copyrighted work and the material in
            question.
          </p>
          <p>
            Valid copyright complaints will be reviewed and appropriate action
            may be taken.
          </p>
        </section>
      </main>

      <footer className="legal-footer">
        <Link to="/">GameNexa</Link>
        <span>© 2026 GameNexa. All rights reserved.</span>
      </footer>
    </div>
  )
}

export default LegalPage