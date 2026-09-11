import LegalPage from './LegalPage'

const LAST_UPDATED = 'September 2026'

function DisclaimerPage() {
  return (
    <LegalPage
      title="Disclaimer"
      description="GameNexa disclaimer — independence from game publishers, and accuracy of information."
      path="/disclaimer"
      updated={LAST_UPDATED}
    >
      <h2>Independent, unofficial resource</h2>
      <p>
        GameNexa is an independent, unofficial gaming information website.
        We are <strong>not affiliated with, endorsed by, sponsored by, or
        in any way officially connected</strong> with the developers or
        publishers of the games featured on this Site — including but not
        limited to Genshin Impact (HoYoverse / miHoYo) and Whiteout
        Survival (Century Games) — unless explicitly stated on a specific
        page.
      </p>

      <h2>Trademarks &amp; ownership</h2>
      <p>
        All game titles, character names, logos, artwork and other
        related media referenced on this Site are trademarks and/or
        copyrighted material of their respective owners. Their use on
        GameNexa is for identification, reference and commentary purposes
        only.
      </p>

      <h2>No guarantee of accuracy</h2>
      <p>
        Game mechanics, character stats, events and content can change
        frequently through official updates. While we try to keep guides
        and databases accurate and current, GameNexa makes no warranty
        that any information on the Site is complete, accurate, or
        up to date. Always verify important details in-game or through
        official sources.
      </p>

      <h2>No professional advice</h2>
      <p>
        Content on this Site is for general informational and
        entertainment purposes only and should not be treated as
        professional, financial, or purchasing advice.
      </p>

      <h2>Copyright concerns</h2>
      <p>
        If you are a rights holder and believe content on this Site
        infringes your rights, please see our{' '}
        <a href="/dmca">Copyright / DMCA Policy</a>.
      </p>
    </LegalPage>
  )
}

export default DisclaimerPage
