import { useState } from 'react'
import { Link } from 'react-router-dom'
import './App.css'
import { gamesData } from './data/gamesData'
import { SEO } from './SEO'
import { SITE_URL, SITE_NAME, DEFAULT_DESCRIPTION } from './seoConfig'

function BrandLogo() {
  return (
    <span className="brand-logo" aria-label="GameNexa">
      <span className="brand-mark"><span>GN</span></span>
      <span className="brand-word">Game<span>Nexa</span></span>
    </span>
  )
}

function App() {
  const games = Object.values(gamesData).filter((game) =>
    ['genshin', 'whiteout-survival'].includes(game.slug)
  )

  const [searchOpen, setSearchOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const query = searchText.trim().toLowerCase()
  const searchResults = query
    ? games.flatMap((game) => {
        const results = []
        if (
          game.name?.toLowerCase().includes(query) ||
          game.category?.toLowerCase().includes(query) ||
          game.description?.toLowerCase().includes(query)
        ) results.push({ type: 'game', game })

        ;(game.guides || []).forEach((guide, index) => {
          const text = [guide.title, guide.desc, guide.description, guide.intro]
            .filter(Boolean).join(' ').toLowerCase()
          if (text.includes(query)) results.push({ type: 'guide', game, guide, index })
        })

        ;(game.characters || []).forEach((character) => {
          const text = [character.name, character.role, character.element, character.weapon, character.type]
            .filter(Boolean).join(' ').toLowerCase()
          if (text.includes(query)) results.push({ type: 'character', game, character })
        })
        return results
      })
    : []

  const closeAll = () => {
    setSearchOpen(false)
    setSearchText('')
    setMobileMenuOpen(false)
  }

  const openSearch = () => {
    setMobileMenuOpen(false)
    setSearchOpen(true)
    setSearchText('')
  }

  const totalCharacters = games.reduce((sum, game) => sum + (game.characters?.length || 0), 0)
  const totalGuides = games.reduce((sum, game) => sum + (game.guides?.length || 0), 0)

  const homeJsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
      description: DEFAULT_DESCRIPTION,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/gamenexa-logo.svg`,
    },
  ]

  return (
    <div className="app">
      <SEO path="/" type="website" jsonLd={homeJsonLd} />

      <header className="navbar">
        <Link to="/" className="logo" onClick={closeAll}>
          <BrandLogo />
        </Link>

        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#home">Home</a>
          <a href="#games">Games</a>
          <Link to="/guides">Guides</Link>
        </nav>

        <div className="navbar-actions">
          <button className="search-button" type="button" onClick={openSearch} aria-label="Open search">
            <span>⌕</span><span className="search-button-text">Search</span>
          </button>
          <button
            className={`mobile-menu-button ${mobileMenuOpen ? 'active' : ''}`}
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            <span></span><span></span><span></span>
          </button>
        </div>

        {mobileMenuOpen && (
          <nav className="mobile-nav" aria-label="Mobile navigation">
            <a href="#home" onClick={() => setMobileMenuOpen(false)}>⌂ Home</a>
            <a href="#games" onClick={() => setMobileMenuOpen(false)}>🎮 Games</a>
            <Link to="/guides" onClick={() => setMobileMenuOpen(false)}>📚 Guides</Link>
            <button type="button" onClick={openSearch}>⌕ Search</button>
          </nav>
        )}
      </header>

      {searchOpen && (
        <div className="search-panel" onClick={(event) => event.target === event.currentTarget && setSearchOpen(false)}>
          <div className="search-box">
            <div className="search-box-top">
              <div><span className="search-label">GAMENEXA SEARCH</span><h2>Find your game.</h2></div>
              <button type="button" className="search-close" onClick={() => setSearchOpen(false)}>✕</button>
            </div>
            <input
              className="search-input"
              type="text"
              placeholder="Search games, guides or characters..."
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              autoFocus
            />
            {!query && <div className="search-hint">Search only across Genshin Impact and Whiteout Survival.</div>}
            {query && (
              <div className="search-results">
                {searchResults.length ? searchResults.map((result, index) => {
                  if (result.type === 'game') return (
                    <Link key={`game-${result.game.slug}-${index}`} to={`/game/${result.game.slug}`} className="search-result" onClick={closeAll}>
                      <span className="search-result-icon">{result.game.icon}</span>
                      <span className="search-result-info"><strong>{result.game.name}</strong><small>Game database</small></span><span>→</span>
                    </Link>
                  )
                  if (result.type === 'guide') return (
                    <Link key={`guide-${result.game.slug}-${result.index}-${index}`} to={`/game/${result.game.slug}/guides/${result.index}`} className="search-result" onClick={closeAll}>
                      <span className="search-result-icon">{result.guide.icon || '📘'}</span>
                      <span className="search-result-info"><strong>{result.guide.title}</strong><small>{result.game.name} · Guide</small></span><span>→</span>
                    </Link>
                  )
                  return (
                    <Link key={`character-${result.game.slug}-${result.character.name}-${index}`} to={`/game/${result.game.slug}`} className="search-result" onClick={closeAll}>
                      <span className="search-result-icon">✦</span>
                      <span className="search-result-info"><strong>{result.character.name}</strong><small>{result.game.name} · Character</small></span><span>→</span>
                    </Link>
                  )
                }) : <div className="search-no-results"><span>⌕</span><strong>No results found</strong><p>Try another game, guide or character.</p></div>}
              </div>
            )}
          </div>
        </div>
      )}

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <div className="hero-kicker"><span className="live-dot"></span> TWO GAMES. ONE GAMING HUB.</div>
            <h1>GameNexa<br /><span>Built for your games.</span></h1>
            <p className="hero-description">
              A focused gaming database for <strong>Genshin Impact</strong> and <strong>Whiteout Survival</strong> — characters, heroes and practical guides in one clean place.
            </p>
            <div className="hero-buttons">
              <a href="#games" className="primary-button">Choose Your Game <span>→</span></a>
              <Link to="/guides" className="secondary-button">Browse Guides</Link>
            </div>
            <div className="hero-stats">
              <div><strong>02</strong><span>Games</span></div>
              <div><strong>{totalCharacters}+</strong><span>Characters / Heroes</span></div>
              <div><strong>{totalGuides}+</strong><span>Guides</span></div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-orbit orbit-one"></div><div className="hero-orbit orbit-two"></div><div className="hero-glow"></div>
            <div className="hero-logo-card"><img src="/gamenexa-logo.svg" alt="GameNexa" /></div>
            <div className="floating-card card-one"><span className="floating-icon">⚔️</span><strong>Genshin Impact</strong></div>
            <div className="floating-card card-two"><span className="floating-icon">❄️</span><strong>Whiteout Survival</strong></div>
          </div>
        </section>

        <section className="section games-section" id="games">
          <div className="section-heading">
            <div><span className="section-label">YOUR GAME HUB</span><h2>Choose Your Game</h2></div>
            <span className="section-counter">02 titles only</span>
          </div>
          <div className="games-grid">
            {games.map((game) => (
              <Link key={game.slug} to={`/game/${game.slug}`} className={`game-card game-${game.slug}`}>
                <div className="game-card-image" style={{ backgroundImage: `url("${game.image}")` }}>
                  <div className="game-card-shade"></div>
                  <div className="game-card-icon">{game.icon}</div>
                  <span className="game-card-category">{game.category}</span>
                </div>
                <div className="game-card-info">
                  <span className="game-number">0{games.indexOf(game) + 1}</span>
                  <h3>{game.name}</h3>
                  <p>{game.description}</p>
                  <div className="game-card-highlights">
                    {(game.highlights || []).map((item) => (
                      <span key={item.label}>
                        <b>{item.value}</b>
                        {item.label}
                      </span>
                    ))}
                  </div>
                  <div className="game-card-bottom"><span>Open Database</span><strong>→</strong></div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="section focus-section">
          <div className="focus-panel">
            <div><span className="section-label">WHAT'S INSIDE</span><h2>Everything focused.<br /><span>Nothing unnecessary.</span></h2></div>
            <div className="focus-list">
              <div><b>01</b><span><strong>Character & Hero Database</strong><small>Search, filter and explore the roster for each game.</small></span></div>
              <div><b>02</b><span><strong>Practical Guides</strong><small>Builds, progression, combat and useful game knowledge.</small></span></div>
              <div><b>03</b><span><strong>Two Dedicated Game Hubs</strong><small>Each game gets its own focused page instead of a crowded portal.</small></span></div>
            </div>
          </div>
        </section>

        <section className="section guides-home-section">
          <div className="section-heading">
            <div><span className="section-label">KNOWLEDGE BASE</span><h2>Game Guides</h2></div>
            <Link to="/guides" className="section-counter guide-view-all">View all →</Link>
          </div>
          <div className="latest-guides-grid">
            {games.flatMap((game) => (game.guides || []).slice(0, 2).map((guide, index) => ({ game, guide, index }))).map(({ game, guide, index }) => (
              <Link key={`${game.slug}-${index}`} to={`/game/${game.slug}/guides/${index}`} className="latest-guide-card">
                <div className="latest-guide-icon">{guide.icon || '📘'}</div>
                <div className="latest-guide-content"><small>{game.name}</small><h3>{guide.title}</h3><p>{guide.desc || guide.description || 'Practical guide and useful information.'}</p><span>Read Guide →</span></div>
              </Link>
            ))}
          </div>
        </section>

        <section className="cta">
          <div className="cta-content"><span className="section-label">GAMENEXA</span><h2>Pick a game.<br /><span>Start exploring.</span></h2><p>Go straight to the game database, characters, heroes and guides.</p></div>
          <a href="#games" className="primary-button cta-button">Explore Games <span>→</span></a>
        </section>
      </main>

      <footer>
        <Link to="/" className="logo"><BrandLogo /></Link>
        <p>Focused gaming databases for Genshin Impact &amp; Whiteout Survival.</p>
        <div className="footer-links"><a href="#home">Home</a><a href="#games">Games</a><Link to="/guides">Guides</Link></div>
        <div className="footer-copy">© 2026 GameNexa. All rights reserved.</div>
      </footer>
    </div>
  )
}

export default App
