import LegalPage from './LegalPage'

const LAST_UPDATED = 'September 2026'

function TermsOfUsePage() {
  return (
    <LegalPage
      title="Terms of Use"
      description="Terms and conditions for using the GameNexa website."
      path="/terms-of-use"
      updated={LAST_UPDATED}
    >
      <p>
        By accessing or using GameNexa ("the Site"), you agree to these
        Terms of Use. If you do not agree, please do not use the Site.
      </p>

      <h2>Use of the Site</h2>
      <p>
        The Site provides gaming information, guides and databases for
        entertainment and informational purposes. You may browse and use
        the content for personal, non-commercial purposes.
      </p>

      <h2>Intellectual property</h2>
      <p>
        Original written content, layout and design on GameNexa belong to
        GameNexa unless otherwise noted. Game names, character names,
        artwork, logos and trademarks referenced on the Site belong to
        their respective owners and are used for identification and
        commentary purposes only, under fair use principles, unless a
        license or permission states otherwise. See our{' '}
        <a href="/dmca">Copyright / DMCA Policy</a> for takedown requests.
      </p>

      <h2>No affiliation</h2>
      <p>
        GameNexa is an independent, fan-operated information resource and
        is not affiliated with, endorsed by, or sponsored by the
        developers or publishers of the games it covers, unless
        explicitly stated.
      </p>

      <h2>Accuracy of information</h2>
      <p>
        We aim to keep guides and data accurate and up to date, but game
        content changes frequently. We make no guarantee that all
        information is complete, current, or error-free, and content
        should not be treated as official.
      </p>

      <h2>Prohibited use</h2>
      <ul>
        <li>Attempting to disrupt, hack, or overload the Site or its systems.</li>
        <li>Scraping or republishing large portions of Site content without permission.</li>
        <li>Using the Site for any unlawful purpose.</li>
      </ul>

      <h2>Third-party links</h2>
      <p>
        The Site may link to third-party websites. We are not responsible
        for the content or practices of those sites.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        The Site is provided "as is" without warranties of any kind. To
        the fullest extent permitted by law, GameNexa is not liable for
        any damages arising from your use of the Site.
      </p>

      <h2>Changes to these Terms</h2>
      <p>
        We may update these Terms from time to time. Continued use of the
        Site after changes are posted means you accept the updated Terms.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these Terms? Reach us via the{' '}
        <a href="/contact">Contact Us</a> page.
      </p>
    </LegalPage>
  )
}

export default TermsOfUsePage
