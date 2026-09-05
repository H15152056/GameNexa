import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import App from './App'
import GamePage from './pages/GamePage'
import GuidePage from './pages/GuidePage'
import GuidesPage from './pages/GuidesPage'
import NotFoundPage from './pages/NotFoundPage'

import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<App />}
        />

        <Route
          path="/game/:slug"
          element={<GamePage />}
        />

        <Route
          path="/game/:slug/guides/:index"
          element={<GuidePage />}
        />

        <Route
          path="/guides"
          element={<GuidesPage />}
        />

        <Route
          path="*"
          element={<NotFoundPage />}
        />

      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)