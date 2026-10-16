# Lovebird

A simple, responsive photo-sharing home page built with React, Vite, and
JavaScript. It includes a sample photo gallery, search, feed filters, like
buttons, and an image uploader that previews a selected photo before adding it
to the gallery.

User-added images are kept in browser memory only; they are not uploaded to a
server and will disappear when the page is refreshed.

## Firebase authentication

1. Create a Firebase web app and copy its configuration values into a local
   `.env` file using [.env.example](./.env.example) as a template.
2. In the Firebase console, enable **Email/Password** and **Google** under
   **Authentication → Sign-in method**. Add your development and production
   hosts to **Authentication → Settings → Authorized domains**.
3. Restart the Vite dev server after creating or changing `.env`.

The `.env` file must contain `VITE_FIREBASE_*` `KEY=value` entries, not the
JavaScript `firebaseConfig` object. If Firebase reports that the API key is
invalid, copy the complete web app config from the same Firebase project and
check that the API key restrictions allow Firebase Authentication.

Firebase web configuration is intended to be included in browser apps; access
to Firebase services must still be secured with Firebase Authentication and
appropriate Firebase Security Rules. Never put service-account credentials in
Vite environment variables.

## Getting started

```sh
npm install
npm run dev
```

## Validate

```sh
npm run lint
npm run build
```
