import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

const requiredConfigFields = [
  'apiKey',
  'authDomain',
  'projectId',
  'appId',
]

const missingConfigFields = requiredConfigFields.filter((field) => !firebaseConfig[field])

export const firebaseConfigError = missingConfigFields.length
  ? `Firebase is not configured. Add these variables to your .env file: ${missingConfigFields
      .map((field) => `VITE_FIREBASE_${field.replace(/[A-Z]/g, (letter) => `_${letter}`).toUpperCase()}`)
      .join(', ')}.`
  : ''

const firebaseApp = firebaseConfigError
  ? null
  : getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig)

export const auth = firebaseApp ? getAuth(firebaseApp) : null