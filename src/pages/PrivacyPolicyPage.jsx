import LegalPage from './LegalPage'

const LAST_UPDATED = 'September 2026'

function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="GameNexa Privacy Policy — what information we collect, how it's used, and your choices."
      path="/privacy-policy"
      updated={LAST_UPDATED}
    >
      <p>
        This Privacy Policy explains how GameNexa ("we", "us", "our")
        handles information when you visit gamenexa.com and related pages
        (the "Site").
      </p>

      <h2>Information we collect</h2>
      <ul>
        <li>
          <strong>Usage data:</strong> pages visited, approximate
          location (country/region), device and browser type, and
          referring pages — typically collected automatically via
          analytics tools (e.g. Google Analytics, Cloudflare Analytics).
        </li>
        <li>
          <strong>Cookies &amp; similar technologies:</strong> used for
          basic site functionality, analytics, and — where enabled —
          advertising (see the Advertising section below).
        </li>
        <li>
          <strong>Information you provide:</strong> if you contact us
          directly (e.g. by email), we receive whatever information you
          include in that message.
        </li>
      </ul>

      <h2>How we use information</h2>
      <ul>
        <li>To operate, maintain and improve the Site.</li>
        <li>To understand how visitors use our guides and pages.</li>
        <li>To respond to inquiries sent to us.</li>
        <li>To serve advertising, where advertising is enabled on the Site.</li>
      </ul>

      <h2>Advertising &amp; third-party services</h2>
      <p>
        GameNexa may display advertising served by third-party providers
        such as Google AdSense. These providers may use cookies or
        similar technologies to serve ads based on a visitor's prior
        visits to this or other websites. You can opt out of personalized
        advertising through{' '}
        <a
          href="https://adssettings.google.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google's Ad Settings
        </a>{' '}
        or via{' '}
        <a
          href="https://www.aboutads.info/choices/"
          target="_blank"
          rel="noopener noreferrer"
        >
          aboutads.info
        </a>
        .
      </p>

      <h2>Data sharing</h2>
      <p>
        We do not sell personal information. We may share limited data
        with service providers (hosting, analytics, advertising) strictly
        to operate the Site, and only to the extent required by those
        services to function.
      </p>

      <h2>Cookies</h2>
      <p>
        You can control or disable cookies through your browser settings.
        Disabling cookies may affect some Site functionality.
      </p>

      <h2>Children's privacy</h2>
      <p>
        GameNexa is not directed at children under 13, and we do not
        knowingly collect personal information from children under 13.
      </p>

      <h2>Your rights</h2>
      <p>
        Depending on where you live, you may have rights to access,
        correct, or delete personal information we hold about you.
        Contact us via the{' '}
        <a href="/contact">Contact Us</a> page to make a request.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Changes will
        be posted on this page with an updated "Last updated" date.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this Privacy Policy? Reach us via the{' '}
        <a href="/contact">Contact Us</a> page.
      </p>
    </LegalPage>
  )
}

export default PrivacyPolicyPage
