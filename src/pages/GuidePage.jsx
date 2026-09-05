import { Link, useParams } from 'react-router-dom'
import './GuidePage.css'
import { gamesData } from '../data/gamesData'
import { SEO } from '../SEO'
import { SITE_NAME } from '../seoConfig'

function GuidePage() {
  const { slug, index } = useParams()

  const games = Object.values(gamesData)

  const game = games.find(function (item) {
    return item.slug === slug
  })

  if (!game) {
    return (
      <div className="guide-error">
        <SEO
          title="Guide Not Found | GameNexa"
          description="The guide you are looking for does not exist on GameNexa."
          path={`/game/${slug}/guides/${index}`}
          noindex
        />

        <h1>Game Not Found</h1>

        <p>
          Sorry, this game page does not exist.
        </p>

        <Link to="/">
          ← Back to GameNexa
        </Link>
      </div>
    )
  }

  const guideIndex = Number(index)

  const guide =
    game.guides &&
    game.guides[guideIndex]

  if (!guide) {
    return (
      <div className="guide-error">
        <SEO
          title="Guide Not Found | GameNexa"
          description="The guide you are looking for does not exist on GameNexa."
          path={`/game/${game.slug}/guides/${index}`}
          noindex
        />

        <h1>Guide Not Found</h1>

        <p>
          Sorry, this guide does not exist.
        </p>

        <Link to={`/game/${game.slug}`}>
          ← Back to {game.name}
        </Link>
      </div>
    )
  }

  const guideTitle = `${guide.title} - ${game.name} Guide | ${SITE_NAME}`

  const guideDescription =
    guide.desc ||
    guide.description ||
    guide.intro ||
    `${guide.title} — complete ${game.name} guide on GameNexa.`

  const guideJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guideDescription,
    about: game.name,
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
  }

  const previousGuide =
    guideIndex > 0
      ? game.guides[guideIndex - 1]
      : null

  const nextGuide =
    guideIndex < game.guides.length - 1
      ? game.guides[guideIndex + 1]
      : null

  return (
    <div className="guide-page">

      <SEO
        title={guideTitle}
        description={guideDescription}
        path={`/game/${game.slug}/guides/${guideIndex}`}
        image={game.image}
        type="article"
        jsonLd={guideJsonLd}
      />

      {/* NAVBAR */}

      <header className="guide-navbar">

        <Link
          to="/"
          className="guide-logo"
        >

          <span className="guide-logo-mark">
            G
          </span>

          <span>
            Game<span>Nexa</span>
          </span>

        </Link>

        <Link
          to={`/game/${game.slug}`}
          className="guide-back"
        >
          ← Back to {game.name}
        </Link>

      </header>


      {/* HERO */}

      <section
        className="guide-hero"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.35), rgba(8,8,16,0.98)), url("' +
            game.image +
            '")',
        }}
      >

        <div className="guide-hero-content">

          <span className="guide-category">
            {game.name} · GUIDE
          </span>

          <div className="guide-hero-icon">
            {guide.icon}
          </div>

          <h1>
            {guide.title}
          </h1>

          <p>
            {guide.desc}
          </p>

        </div>

      </section>


      {/* MAIN CONTENT */}

      <main className="guide-container">

        <div className="guide-content">

          {/* INTRO */}

          <div className="guide-intro">

            <strong>
              {guide.title}
            </strong>

            <p>
              This GameNexa guide covers{' '}
              <strong>{guide.title.toLowerCase()}</strong>{' '}
              in {game.name}. Use the information below to
              improve your gameplay and get more from your
              gaming experience.
            </p>

          </div>


          {/* REAL GUIDE CONTENT */}

          {guide.content && guide.content.length > 0 ? (

            guide.content.map(function (
              section,
              sectionIndex
            ) {

              return (

                <section
                  className="guide-section"
                  key={sectionIndex}
                >

                  <h2>
                    {section.heading}
                  </h2>

                  {section.paragraphs &&
                    section.paragraphs.map(function (
                      paragraph,
                      paragraphIndex
                    ) {

                      return (
                        <p
                          key={paragraphIndex}
                        >
                          {paragraph}
                        </p>
                      )

                    })}

                </section>

              )

            })

          ) : (

            /* FALLBACK */

            <>
              <section className="guide-section">

                <h2>
                  Getting Started
                </h2>

                <p>
                  {guide.desc} Whether you are a new player
                  or already familiar with {game.name},
                  learning the fundamentals is an important
                  first step.
                </p>

                <p>
                  Start by understanding the main mechanics,
                  available options and the way they affect
                  your gameplay.
                </p>

              </section>

              <section className="guide-section">

                <h2>
                  Useful Tips
                </h2>

                <p>
                  Focus on the most important parts of{' '}
                  {guide.title.toLowerCase()} before moving
                  on to advanced techniques.
                </p>

                <p>
                  Keep your equipment, characters or
                  gameplay strategy properly prepared.
                  Small improvements can make a noticeable
                  difference.
                </p>

              </section>

              <section className="guide-section">

                <h2>
                  Improve Your Gameplay
                </h2>

                <p>
                  Practice is one of the best ways to improve.
                  Try different strategies and pay attention
                  to what works well for your preferred
                  playstyle.
                </p>

              </section>

            </>

          )}

        </div>


        {/* PREVIOUS / NEXT */}

        <div className="guide-navigation">

          {previousGuide ? (

            <Link
              to={`/game/${game.slug}/guides/${guideIndex - 1}`}
              className="guide-nav-card"
            >

              <span>
                ← Previous Guide
              </span>

              <strong>
                {previousGuide.title}
              </strong>

            </Link>

          ) : (

            <div className="guide-nav-empty" />

          )}


          {nextGuide ? (

            <Link
              to={`/game/${game.slug}/guides/${guideIndex + 1}`}
              className="guide-nav-card guide-nav-next"
            >

              <span>
                Next Guide →
              </span>

              <strong>
                {nextGuide.title}
              </strong>

            </Link>

          ) : (

            <div className="guide-nav-empty" />

          )}

        </div>


        {/* MORE GUIDES */}

        <section className="more-guides">

          <div className="more-guides-header">

            <span>
              {game.name.toUpperCase()}
            </span>

            <h2>
              More Guides
            </h2>

          </div>


          <div className="more-guides-grid">

            {game.guides.map(function (
              item,
              itemIndex
            ) {

              if (itemIndex === guideIndex) {
                return null
              }

              return (

                <Link
                  key={itemIndex}
                  to={`/game/${game.slug}/guides/${itemIndex}`}
                  className="more-guide-card"
                >

                  <div className="more-guide-icon">
                    {item.icon}
                  </div>

                  <div>

                    <small>
                      GUIDE
                    </small>

                    <h3>
                      {item.title}
                    </h3>

                    <p>
                      {item.desc}
                    </p>

                  </div>

                </Link>

              )

            })}

          </div>

        </section>


        {/* BACK BUTTON */}

        <div className="guide-footer-action">

          <Link
            to={`/game/${game.slug}`}
            className="guide-button"
          >
            ← Back to {game.name}
          </Link>

        </div>

      </main>


      {/* FOOTER */}

      <footer className="guide-footer">

        <div className="guide-footer-logo">
          Game<span>Nexa</span>
        </div>

        <p>
          Gaming guides and game databases.
        </p>

        <small>
          © 2026 GameNexa. All rights reserved.
        </small>

      </footer>

    </div>
  )
}

export default GuidePage