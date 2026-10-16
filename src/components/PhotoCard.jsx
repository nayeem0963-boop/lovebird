function PhotoCard({ photo, onToggleLike }) {
  const initials = photo.author
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <article className="photo-card">
      <div className={`photo-frame photo-frame-${photo.color}`}>
        <img className="photo-image" src={photo.url} alt={photo.title} loading="lazy" />
        <button
          className={photo.isLiked ? 'photo-like is-liked' : 'photo-like'}
          type="button"
          onClick={() => onToggleLike(photo.id)}
          aria-label={photo.isLiked ? 'Unlike photo' : 'Like photo'}
          aria-pressed={photo.isLiked}
        >
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="M16.8 4.6c-1.9-1.9-5-1.5-6.8.7-1.8-2.2-4.9-2.6-6.8-.7-2.2 2.2-1 5.7.8 7.6L10 18l6-5.8c1.8-1.9 3-5.4.8-7.6Z" />
          </svg>
        </button>
        {photo.isLocal && <span className="new-photo-badge">NEW</span>}
      </div>
      <div className="photo-meta">
        <div className="photo-caption">
          <p>{photo.title}</p>
          <span>{photo.likes} appreciations</span>
        </div>
        <div className="photo-author">
          {photo.avatar
            ? <img src={photo.avatar} alt="" loading="lazy" />
            : <span className="author-initials">{initials}</span>}
          <div>
            <strong>{photo.author}</strong>
            <span>{photo.handle}</span>
          </div>
        </div>
      </div>
    </article>
  )
}

export default PhotoCard
