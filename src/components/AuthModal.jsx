import { useEffect, useState } from 'react'
import { useAuth } from '../context/useAuth.js'

function getAuthErrorMessage(error) {
  if (typeof error?.code === 'string' && error.code.startsWith('auth/api-key-not-valid')) {
    return 'Firebase rejected the API key. Copy the web app config from the correct Firebase project into .env, check the API key restrictions, and restart the dev server.'
  }

  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'An account already exists for this email. Try signing in instead.'
    case 'auth/invalid-credential':
    case 'auth/invalid-email':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'That email and password combination could not be verified.'
    case 'auth/weak-password':
      return 'Choose a password with at least 6 characters.'
    case 'auth/popup-closed-by-user':
      return 'The Google sign-in window was closed before finishing.'
    case 'auth/popup-blocked':
      return 'Your browser blocked the Google sign-in window. Allow pop-ups and try again.'
    case 'auth/unauthorized-domain':
      return 'This site is not authorized for Firebase sign-in. Add its domain in Firebase Authentication settings.'
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled in Firebase Authentication settings.'
    default:
      return error.message || 'Sign-in failed. Please try again.'
  }
}

function AuthModal({ onClose }) {
  const { configurationError, login, loginWithGoogle, signup } = useAuth()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const isSignup = mode === 'signup'

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !submitting) onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose, submitting])

  const runAuthAction = async (action) => {
    setError('')
    setSubmitting(true)
    try {
      await action()
      onClose()
    } catch (authError) {
      console.error('Lovebird authentication failed.', authError)
      setError(getAuthErrorMessage(authError))
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    return runAuthAction(() => (isSignup ? signup(email, password) : login(email, password)))
  }

  return (
    <div
      className="auth-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !submitting) onClose()
      }}
    >
      <section
        className="auth-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        aria-describedby="auth-modal-description"
      >
        <button
          className="auth-modal-close"
          type="button"
          onClick={onClose}
          disabled={submitting}
          aria-label="Close sign in dialog"
        >
          ×
        </button>
        <div className="auth-modal-brand" aria-hidden="true">♡</div>
        <p className="auth-modal-eyebrow">A little corner of the internet</p>
        <h2 id="auth-modal-title">{isSignup ? 'Find your people.' : 'Welcome back.'}</h2>
        <p className="auth-modal-description" id="auth-modal-description">
          {isSignup
            ? 'Create an account to save and share the moments you love.'
            : 'Sign in to find the moments you have been missing.'}
        </p>

        {configurationError && <p className="auth-message is-error" role="alert">{configurationError}</p>}
        {error && <p className="auth-message is-error" role="alert">{error}</p>}

        <button
          className="google-auth-button"
          type="button"
          onClick={() => runAuthAction(loginWithGoogle)}
          disabled={submitting || Boolean(configurationError)}
        >
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path fill="#4285F4" d="M19.6 10.2c0-.7-.1-1.4-.2-2.1H10v4h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.8 3-4.4 3-7.4Z" />
            <path fill="#34A853" d="M10 20c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H1.1v2.6A10 10 0 0 0 10 20Z" />
            <path fill="#FBBC05" d="M4.4 12a6 6 0 0 1 0-3.9V5.5H1.1a10 10 0 0 0 0 9.1L4.4 12Z" />
            <path fill="#EA4335" d="M10 4c1.5 0 2.8.5 3.8 1.5l2.9-2.9A9.7 9.7 0 0 0 10 0a10 10 0 0 0-8.9 5.5l3.3 2.6C5.2 5.8 7.4 4 10 4Z" />
          </svg>
          Continue with Google
        </button>

        <div className="auth-divider"><span>or with email</span></div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="auth-email">Email address</label>
          <input
            id="auth-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            disabled={submitting}
          />
          <label htmlFor="auth-password">Password</label>
          <input
            id="auth-password"
            type="password"
            autoComplete={isSignup ? 'new-password' : 'current-password'}
            placeholder={isSignup ? 'At least 6 characters' : 'Your password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={6}
            required
            disabled={submitting}
          />
          <button
            className="auth-submit-button"
            type="submit"
            disabled={submitting || Boolean(configurationError)}
          >
            {submitting
              ? 'One moment…'
              : isSignup
                ? 'Create your account'
                : 'Sign in'}
          </button>
        </form>

        <p className="auth-switch">
          {isSignup ? 'Already part of the flock?' : 'New around here?'}
          {' '}
          <button
            type="button"
            onClick={() => {
              setMode(isSignup ? 'login' : 'signup')
              setError('')
            }}
            disabled={submitting}
          >
            {isSignup ? 'Sign in' : 'Create an account'}
          </button>
        </p>
      </section>
    </div>
  )
}

export default AuthModal
