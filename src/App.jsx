import { useEffect, useRef, useState } from 'react'
import PhotoCard from './components/PhotoCard.jsx'
import PhotoUploader from './components/PhotoUploader.jsx'
import AuthModal from './components/AuthModal.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { useAuth } from './context/useAuth.js'
import './App.css'

// test data from Unsplash, used for initial state and demo purposes
console.log("ENV TEST:", import.meta.env.VITE_FIREBASE_API_KEY);

const initialPhotos = [
  {
    id: 'photo-1',
    url: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1000&q=85',
    title: 'A quiet morning in the mountains',
    author: 'Sofia Chen',
    handle: '@sofiachen',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=96&h=96&q=80',
    likes: 128,
    isLiked: false,
    color: 'sage',
    following: true,
  },
  {
    id: 'photo-2',
    url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1000&q=85',
    title: 'Little reminders to stop and smell the flowers',
    author: 'Amelia Rose',
    handle: '@ameliarose',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=96&h=96&q=80',
    likes: 86,
    isLiked: false,
    color: 'rose',
    following: true,
  },
  {
    id: 'photo-3',
    url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=85',
    title: 'Taking the scenic route, always',
    author: 'Noah Williams',
    handle: '@noahwanders',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=96&h=96&q=80',
    likes: 214,
    isLiked: false,
    color: 'blue',
    following: true,
  },
  {
    id: 'photo-4',
    url: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1000&q=85',
    title: 'Slow afternoons and a good book',
    author: 'Jules Martin',
    handle: '@julesmakes',
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=96&h=96&q=80',
    likes: 52,
    isLiked: false,
    color: 'amber',
    following: false,
  },
  {
    id: 'photo-5',
    url: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1000&q=85',
    title: 'Somewhere between here and nowhere',
    author: 'Theo Brooks',
    handle: '@theobrooks',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=96&h=96&q=80',
    likes: 173,
    isLiked: false,
    color: 'blue',
    following: true,
  },
  {
    id: 'photo-6',
    url: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=1000&q=85',
    title: 'Collecting the little moments',
    author: 'Maya Ellis',
    handle: '@mayaellis',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=96&h=96&q=80',
    likes: 97,
    isLiked: false,
    color: 'rose',
    following: false,
  },
]

function AppContent() {
  const [photos, setPhotos] = useState(initialPhotos)
  const [activeFilter, setActiveFilter] = useState('For you')
  const [search, setSearch] = useState('')
  const [notice, setNotice] = useState('')
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const localPhotoUrls = useRef(new Map())
  const { user, loading: authLoading, logout } = useAuth()
  const userName = user?.displayName || user?.email?.split('@')[0] || 'friend'
  const userInitial = userName.trim().charAt(0).toUpperCase() || 'L'

  useEffect(() => () => {
    localPhotoUrls.current.forEach((url) => URL.revokeObjectURL(url))
  }, [])

  const addPhoto = (file) => {
    const url = URL.createObjectURL(file)
    const id = crypto.randomUUID()
    const title = file.name.replace(/\.[^.]+$/, '') || 'A new moment'
    localPhotoUrls.current.set(id, url)
    setPhotos((current) => [
      {
        id,
        url,
        title,
        author: 'You',
        handle: '@you',
        avatar: '',
        likes: 0,
        isLiked: false,
        color: 'rose',
        isLocal: true,
        following: false,
      },
      ...current,
    ])
    setNotice('Your photo is now in the gallery. Add a caption if you like.')
    return id
  }

  const updatePhotoTitle = (photoId, title) => {
    const nextTitle = title.trim()
    if (!nextTitle) return

    setPhotos((current) => current.map((photo) => (
      photo.id === photoId ? { ...photo, title: nextTitle } : photo
    )))
    setNotice('Your photo caption has been updated.')
  }

  const removePhoto = (photoId) => {
    const url = localPhotoUrls.current.get(photoId)
    if (url) {
      URL.revokeObjectURL(url)
      localPhotoUrls.current.delete(photoId)
    }
    setPhotos((current) => current.filter((photo) => photo.id !== photoId))
    setNotice('')
  }

  const toggleLike = (photoId) => {
    setPhotos((current) => current.map((photo) => (
      photo.id === photoId
        ? {
          ...photo,
          isLiked: !photo.isLiked,
          likes: photo.likes + (photo.isLiked ? -1 : 1),
        }
        : photo
    )))
  }

  const handleLogout = async () => {
    try {
      await logout()
      setNotice('You have been signed out.')
    } catch (error) {
      console.error('Unable to sign out of Lovebird.', error)
      setNotice('We could not sign you out. Please try again.')
    }
  }

  const visiblePhotos = photos.filter((photo) => {
    const matchesFilter = activeFilter === 'For you'
      || (activeFilter === 'Following' && photo.following)
      || (activeFilter === 'Saved' && photo.isLiked)
    const searchText = `${photo.title} ${photo.author} ${photo.handle}`.toLowerCase()
    return matchesFilter && searchText.includes(search.trim().toLowerCase())
  })
  const savedCount = photos.filter((photo) => photo.isLiked).length

  return (
    <div className="lovebird-app">
      <header className="topbar">
        <a className="brand" href="#home" aria-label="Lovebird home">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none">
              <path d="M16 27s-11-6.7-11-14.2C5 8.8 7.6 6 11 6c2.1 0 3.9 1.1 5 2.8C17.1 7.1 18.9 6 21 6c3.4 0 6 2.8 6 6.8C27 20.3 16 27 16 27Z" />
              <path d="M11 14.5c1.2-1.5 2.8-2.2 5-2.2s3.8.7 5 2.2" />
            </svg>
          </span>
          <span>lovebird</span>
        </a>

        <label className="search-box">
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <circle cx="8.8" cy="8.8" r="5.7" />
            <path d="m13 13 4 4" />
          </svg>
          <input
            type="search"
            placeholder="Find a little inspiration"
            aria-label="Search photos"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <kbd>/</kbd>
        </label>

        <div className="topbar-actions">
          <span className="icon-button notification-button" aria-label="Notifications">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Zm-8 13h4" />
            </svg>
            <span className="notification-dot" />
          </span>
          {authLoading ? (
            <span className="auth-loading" role="status">Checking session…</span>
          ) : user ? (
            <div className="signed-in-actions">
              <div className="profile-button" aria-label={`Signed in as ${user.email || userName}`}>
                {user.photoURL
                  ? <img className="profile-avatar" src={user.photoURL} alt="" referrerPolicy="no-referrer" />
                  : <span className="profile-avatar">{userInitial}</span>}
                <span className="profile-name">{user.displayName || user.email}</span>
              </div>
              <button className="sign-in-button sign-out-button" type="button" onClick={handleLogout}>
                Sign out
              </button>
            </div>
          ) : (
            <button className="sign-in-button" type="button" onClick={() => setAuthModalOpen(true)}>
              Sign in
            </button>
          )}
        </div>
      </header>

      <div className="workspace" id="home">
        <aside className="sidebar">
          <div className="sidebar-group">
            <p className="sidebar-label">YOUR SPACE</p>
            <button
              className={activeFilter === 'For you' ? 'sidebar-link is-active' : 'sidebar-link'}
              type="button"
              onClick={() => setActiveFilter('For you')}
            >
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <rect x="3" y="3" width="5.5" height="5.5" rx="1.3" />
                <rect x="11.5" y="3" width="5.5" height="5.5" rx="1.3" />
                <rect x="3" y="11.5" width="5.5" height="5.5" rx="1.3" />
                <rect x="11.5" y="11.5" width="5.5" height="5.5" rx="1.3" />
              </svg>
              <span>Discover</span>
            </button>
            <button
              className={activeFilter === 'Following' ? 'sidebar-link is-active' : 'sidebar-link'}
              type="button"
              onClick={() => setActiveFilter('Following')}
            >
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="M16.8 4.6c-1.9-1.9-5-1.5-6.8.7-1.8-2.2-4.9-2.6-6.8-.7-2.2 2.2-1 5.7.8 7.6L10 18l6-5.8c1.8-1.9 3-5.4.8-7.6Z" />
              </svg>
              <span>Following</span>
            </button>
            <button
              className={activeFilter === 'Saved' ? 'sidebar-link is-active' : 'sidebar-link'}
              type="button"
              onClick={() => setActiveFilter('Saved')}
            >
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="M5 3h10a2 2 0 0 1 2 2v12l-7-4-7 4V5a2 2 0 0 1 2-2Z" />
              </svg>
              <span>Saved photos</span>
              <span className="sidebar-count">{savedCount}</span>
            </button>
          </div>

          <div className="sidebar-divider" />

          <div className="sidebar-group">
            <div className="sidebar-heading-row">
              <p className="sidebar-label">YOUR MOODBOARD</p>
              <span className="tiny-add" aria-hidden="true">+</span>
            </div>
            <div className="board-link">
              <span className="board-swatch swatch-peach" />
              Little joys
              <span className="board-count">12</span>
            </div>
            <div className="board-link">
              <span className="board-swatch swatch-green" />
              Places to go
              <span className="board-count">8</span>
            </div>
            <div className="board-link">
              <span className="board-swatch swatch-lilac" />
              Things I love
              <span className="board-count">16</span>
            </div>
          </div>

          <div className="sidebar-note">
            <span aria-hidden="true">✦</span>
            <p>A good place to keep the moments you want to remember.</p>
          </div>
        </aside>

        <main className="main-content">
          <section className="welcome-row" aria-labelledby="welcome-heading">
            <div>
              <p className="eyebrow">A LITTLE INSPIRATION, EVERY DAY</p>
              <h1 id="welcome-heading">A little inspiration, {userName} <span aria-hidden="true">✦</span></h1>
              <p className="welcome-description">Fresh moments from people who see the world a little like you do.</p>
            </div>
            <div className="community-avatars" aria-label="Your community is sharing">
              {initialPhotos.slice(0, 3).map((photo) => (
                <img key={photo.id} src={photo.avatar} alt="" />
              ))}
              <span>+18</span>
            </div>
          </section>

          <PhotoUploader
            onAdd={addPhoto}
            onUpdate={updatePhotoTitle}
            onRemove={removePhoto}
          />
          {notice && (
            <p className="success-message" role="status">
              <span aria-hidden="true">✓</span> {notice}
              <button type="button" onClick={() => setNotice('')} aria-label="Dismiss notification">×</button>
            </p>
          )}

          <section className="gallery-section" aria-labelledby="gallery-heading">
            <div className="gallery-toolbar">
              <div>
                <h2 id="gallery-heading">Your daily dose of lovely</h2>
                <p>A collection of moments worth pausing for.</p>
              </div>
              <div className="gallery-actions">
                <div className="filter-tabs" role="group" aria-label="Filter photos">
                  {['For you', 'Following', 'Saved'].map((filter) => (
                    <button
                      className={activeFilter === filter ? 'filter-tab is-selected' : 'filter-tab'}
                      key={filter}
                      type="button"
                      aria-pressed={activeFilter === filter}
                      onClick={() => setActiveFilter(filter)}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
                <span className="sort-button">
                  <svg viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M4 5h12M6.5 10h7M9 15h2" />
                  </svg>
                  Latest
                  <svg className="sort-chevron" viewBox="0 0 16 16" aria-hidden="true">
                    <path d="m4 6 4 4 4-4" />
                  </svg>
                </span>
              </div>
            </div>

            <div className="photo-grid">
              {visiblePhotos.map((photo) => (
                <PhotoCard key={photo.id} photo={photo} onToggleLike={toggleLike} />
              ))}
            </div>
            {visiblePhotos.length === 0 && (
              <div className="empty-gallery">
                <span aria-hidden="true">♡</span>
                <h3>No moments found just yet</h3>
                <p>Try another search or choose a different collection.</p>
              </div>
            )}
          </section>
          <footer className="page-footer">
            <span>Made for the moments that matter.</span>
            <span>© lovebird</span>
          </footer>
        </main>
      </div>
      {authModalOpen && <AuthModal onClose={() => setAuthModalOpen(false)} />}
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
