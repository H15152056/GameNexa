import { Link } from 'react-router-dom'
import { SEO } from '../SEO'

function NotFoundPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        background: '#080810',
        color: '#ffffff',
        fontFamily: 'Arial, Helvetica, sans-serif',
        textAlign: 'center',
        padding: '24px',
      }}
    >
      <SEO
        title="Page Not Found | GameNexa"
        description="The page you are looking for does not exist on GameNexa."
        path="/404"
        noindex
      />

      <h1 style={{ fontSize: '48px', margin: 0 }}>404</h1>

      <p style={{ color: '#9292a4', maxWidth: '400px' }}>
        The page you are looking for does not exist or may have
        been moved.
      </p>

      <Link
        to="/"
        style={{
          marginTop: '12px',
          padding: '12px 24px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #28ff83, #0f9d55)',
          color: '#ffffff',
          textDecoration: 'none',
          fontWeight: 700,
        }}
      >
        ← Back to Home
      </Link>
    </div>
  )
}

export default NotFoundPage
