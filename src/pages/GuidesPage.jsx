import { Link } from 'react-router-dom'
import { gamesData } from '../data/gamesData'
import './GuidesPage.css'
import { SEO } from '../SEO'
import { SITE_NAME } from '../seoConfig'

function GuidesPage() {
  const games = Object.values(gamesData)

  const totalGuides = games.reduce(
    (total, game) => total + (game.guides?.length || 0),
    0
  )

  const pageTitle = `All Game Guides - Builds, Tips & Walkthroughs | ${SITE_NAME}`

  const pageDescription =
    'Browse every GameNexa guide in one place — character builds, team comps, tips and walkthroughs across all supported games.'

  const guidesJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: pageTitle,
    description: pageDescription,
  }

  return (
    <div className="guides-page">

      <SEO
        title={pageTitle}
        description={pageDescription}
        path="/guides"
        type="website"
        jsonLd={guidesJsonLd}
      />

      {/* NAVBAR */}

      <nav className="guides-navbar">
        <Link to="/" className="guides-logo">
          <span className="guides-logo-mark">G</span>
          <span>
            Game<span>Nexa</span>
          </span>
        </Link>

        <Link to="/" className="guides-home">
          ← Back to Home
        </Link>
      </nav>

      {/* HERO */}

      <header className="guides-hero">
        <div className="guides-hero-content">
          <span>KNOWLEDGE BASE</span>

          <h1>All Guides</h1>

          <p>
            {totalGuides} guides across {games.length} games —
            builds, team comps, tips and walkthroughs to help you
            play smarter.
          </p>
        </div>
      </header>

      {/* GUIDES BY GAME */}

      <main className="guides-container">
        {games.map((game) => {
          const guides = game.guides || []

          if (guides.length === 0) return null

          return (
            <section
              key={game.slug}
              className="game-guides-section"
            >
              <div className="game-guides-heading">
                <div className="game-guides-icon">
                  {game.icon}
                </div>

                <div>
                  <span>{game.category}</span>
                  <h2>{game.name} Guides</h2>
                  <p>{guides.length} guides available</p>
                </div>
              </div>

              <div className="guides-grid">
                {guides.map((guide, index) => (
                  <Link
                    key={`${game.slug}-guide-${index}`}
                    to={`/game/${game.slug}/guides/${index}`}
                    className="guides-card"
                  >
                    <div className="guides-card-icon">
                      {guide.icon || '📘'}
                    </div>

                    <div className="guides-card-content">
                      <span>{game.name}</span>

                      <h3>{guide.title}</h3>

                      <p>
                        {guide.desc ||
                          guide.description ||
                          'Complete guide and useful information.'}
                      </p>

                      <strong>Read Guide →</strong>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )
        })}
      </main>

      {/* FOOTER */}

      <footer className="guides-footer">
        <div className="guides-footer-logo">
          Game<span>Nexa</span>
        </div>

        <p>Focused game guides and character databases.</p>

        <small>© 2026 GameNexa. All rights reserved.</small>
      </footer>

    </div>
  )
}

export default GuidesPage
