import { useEffect, useMemo, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import { auth, firebaseConfigError } from '../firebase.js'
import { AuthContext } from './authContext.js'

function requireAuth() {
  if (!auth) throw new Error(firebaseConfigError)
  return auth
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(Boolean(auth))

  useEffect(() => {
    if (!auth) return undefined

    return onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser)
        setLoading(false)
      },
      (error) => {
        console.error('Unable to observe Firebase authentication state.', error)
        setUser(null)
        setLoading(false)
      },
    )
  }, [])

  const value = useMemo(() => ({
    user,
    loading,
    configurationError: firebaseConfigError,
    signup: (email, password) => createUserWithEmailAndPassword(requireAuth(), email, password),
    login: (email, password) => signInWithEmailAndPassword(requireAuth(), email, password),
    loginWithGoogle: () => signInWithPopup(requireAuth(), new GoogleAuthProvider()),
    logout: () => signOut(requireAuth()),
  }), [user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
