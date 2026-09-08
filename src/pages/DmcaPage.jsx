import LegalPage from './LegalPage'

/*
 * TODO (site owner): replace with your real contact/DMCA-agent email
 * before launch.
 */
const DMCA_EMAIL = 'contact@gamenexa.com'

const LAST_UPDATED = 'September 2026'

function DmcaPage() {
  return (
    <LegalPage
      title="Copyright / DMCA Policy"
      description="GameNexa's copyright policy and DMCA takedown request process."
      path="/dmca"
      updated={LAST_UPDATED}
    >
      <p>
        GameNexa respects the intellectual property rights of others and
        expects users of the Site to do the same. Game names, character
        art, logos and other media referenced on this Site remain the
        property of their respective owners and are used for
        identification, reference and commentary purposes.
      </p>

      <h2>Filing a takedown request</h2>
      <p>
        If you believe material on GameNexa infringes your copyright,
        please send a written notice to{' '}
        <a href={`mailto:${DMCA_EMAIL}`}>{DMCA_EMAIL}</a> including:
      </p>
      <ul>
        <li>Identification of the copyrighted work you claim has been infringed.</li>
        <li>The exact URL(s) on GameNexa where the material is located.</li>
        <li>Your contact information (name, email address, and, if applicable, phone number).</li>
        <li>
          A statement that you have a good-faith belief that the
          disputed use is not authorized by the copyright owner, its
          agent, or the law.
        </li>
        <li>
          A statement, under penalty of perjury, that the information in
          your notice is accurate and that you are the copyright owner or
          authorized to act on the owner's behalf.
        </li>
        <li>Your physical or electronic signature.</li>
      </ul>

      <h2>Our response</h2>
      <p>
        Upon receiving a valid notice, we will review the request and
        remove or disable access to the reported material where
        appropriate, in accordance with applicable copyright law.
      </p>

      <h2>Counter-notice</h2>
      <p>
        If you believe material was removed in error, you may submit a
        counter-notice to the same email address with your contact
        details and an explanation of why the material should be
        restored.
      </p>
    </LegalPage>
  )
}

export default DmcaPage
