import React from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import '../style/app-header.scss'

const AppHeader = ({ showBackButton = false }) => {
  const { handleLogout } = useAuth()
  const navigate = useNavigate()

  const onLogout = async () => {
    await handleLogout()
    navigate('/login')
  }

  return (
    <header className="app-header">
      <div className="app-header__inner">
        {showBackButton ? (
          <Link to="/" className="app-header__back">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Home
          </Link>
        ) : (
          <Link to="/" className="app-header__logo">
            <span className="app-header__logo-mark" aria-hidden>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" /></svg>
            </span>
            Interview Plan
          </Link>
        )}
        <button type="button" onClick={onLogout} className="app-header__logout button primary-button">
          Logout
        </button>
      </div>
    </header>
  )
}

export default AppHeader
