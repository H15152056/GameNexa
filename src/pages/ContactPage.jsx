import LegalPage from './LegalPage'

/*
 * TODO (site owner): replace the placeholder email address below with
 * your real support/contact email before launch.
 */
const CONTACT_EMAIL = 'contact@gamenexa.com'

function ContactPage() {
  return (
    <LegalPage
      title="Contact Us"
      description="Get in touch with the GameNexa team for questions, corrections, or copyright/DMCA requests."
      path="/contact"
    >
      <p>
        We'd love to hear from you. Whether it's a correction, a content
        suggestion, a business inquiry, or a copyright concern, reach out
        using the details below.
      </p>

      <h2>General inquiries</h2>
      <p>
        Email us at{' '}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and we'll
        get back to you as soon as we can.
      </p>

      <h2>Content corrections</h2>
      <p>
        Spotted outdated or incorrect information in a guide or character
        entry? Let us know at the email above with a link to the page and
        a short description of the issue.
      </p>

      <h2>Copyright / DMCA requests</h2>
      <p>
        For copyright takedown requests, please see our{' '}
        <a href="/dmca">Copyright / DMCA Policy</a> for the correct
        process and required information.
      </p>
    </LegalPage>
  )
}

export default ContactPage
