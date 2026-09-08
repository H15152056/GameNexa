import LegalPage from './LegalPage'

function AboutPage() {
  return (
    <LegalPage
      title="About Us"
      description="Learn about GameNexa — an independent gaming information website covering Genshin Impact, Whiteout Survival and more."
      path="/about"
    >
      <p>
        GameNexa is an independent gaming information website. We build
        focused, easy-to-navigate databases and guides for popular live
        games — currently Genshin Impact and Whiteout Survival — covering
        characters, heroes, mechanics and step-by-step guides.
      </p>

      <h2>What we do</h2>
      <p>
        Our goal is simple: give players a fast, clean reference for the
        games they play — character details, hero build guides, event
        information and practical tips — without clutter.
      </p>

      <h2>Independence &amp; affiliation</h2>
      <p>
        GameNexa is an independent fan-made information resource. We are
        not affiliated with, endorsed by, or sponsored by the developers or
        publishers of the games we cover, unless explicitly stated
        otherwise. All game names, character names, logos and artwork
        referenced on this site remain the property of their respective
        owners. See our{' '}
        <a href="/disclaimer">Disclaimer</a> and{' '}
        <a href="/dmca">Copyright / DMCA Policy</a> for more detail.
      </p>

      <h2>Get in touch</h2>
      <p>
        Questions, corrections or partnership inquiries? Visit our{' '}
        <a href="/contact">Contact Us</a> page.
      </p>
    </LegalPage>
  )
}

export default AboutPage
