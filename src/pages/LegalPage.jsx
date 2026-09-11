import { Link } from 'react-router-dom'
import { SEO } from '../SEO'
import './LegalPage.css'

/**
 * Shared layout for all static/legal pages (About, Contact,
 * Privacy Policy, Terms of Use, Disclaimer, Copyright/DMCA).
 *
 * title       - page title (used for <h1> and SEO title)
 * description - meta description for SEO
 * path        - route path, e.g. "/privacy-policy"
 * updated     - human-readable "last updated" date string
 * children    - page body (sections, paragraphs, lists, etc.)
 */
function LegalPage({ title, description, path, updated, children }) {
  return (
    <div className="legal-page">
      <SEO
        title={`${title} | GameNexa`}
        description={description}
        path={path}
        type="website"
      />

      <header className="legal-header">
        <Link to="/" className="legal-back">
          ← Back to GameNexa
        </Link>
      </header>

      <main className="legal-content">
        <h1>{title}</h1>
        {updated && <p className="legal-updated">Last updated: {updated}</p>}
        <div className="legal-body">{children}</div>
      </main>

      <footer className="legal-footer">
        <div className="legal-footer-links">
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact Us</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms-of-use">Terms of Use</Link>
          <Link to="/disclaimer">Disclaimer</Link>
          <Link to="/dmca">Copyright / DMCA</Link>
        </div>
        <div className="legal-footer-copy">
          © {new Date().getFullYear()} GameNexa. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default LegalPage
