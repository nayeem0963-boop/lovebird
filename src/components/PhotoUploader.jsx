import { useEffect, useRef, useState } from 'react'

function PhotoUploader({ onAdd, onUpdate, onRemove }) {
  const fileInput = useRef(null)
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [caption, setCaption] = useState('')
  const [error, setError] = useState('')
  const [photoId, setPhotoId] = useState('')

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return

    if (!selectedFile.type.startsWith('image/')) {
      setError('Choose an image file to preview.')
      event.target.value = ''
      return
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('Choose an image smaller than 10 MB.')
      event.target.value = ''
      return
    }

    if (photoId) onRemove(photoId)
    setError('')
    setPreviewUrl(URL.createObjectURL(selectedFile))
    setFile(selectedFile)
    setPhotoId(onAdd(selectedFile))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!file) {
      setError('Choose a photo before adding it to your gallery.')
      return
    }

    onUpdate(photoId, caption)
    setFile(null)
    setPreviewUrl('')
    setCaption('')
    setPhotoId('')
    setError('')
    if (fileInput.current) fileInput.current.value = ''
  }

  const clearSelection = () => {
    if (photoId) onRemove(photoId)
    setFile(null)
    setPreviewUrl('')
    setCaption('')
    setPhotoId('')
    setError('')
    if (fileInput.current) fileInput.current.value = ''
  }

  return (
    <section className={`uploader${file ? ' has-preview' : ''}`} aria-labelledby="share-heading">
      <div className="uploader-avatar" aria-hidden="true">J</div>
      <div className="uploader-main">
        <div className="uploader-heading">
          <div>
            <h2 id="share-heading">Share a little moment</h2>
            <p>Good things are even better when they’re shared.</p>
          </div>
          <span className="privacy-pill">
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M4 7V5a4 4 0 0 1 8 0v2m-9 0h10v7H3V7Z" />
            </svg>
            Just you & friends
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          {file ? (
            <div className="upload-preview">
              <img src={previewUrl} alt="Preview of the selected photo" />
              <div className="preview-details">
                <span className="preview-file-name">{file.name}</span>
                <label htmlFor="photo-caption">Add a caption</label>
                <input
                  id="photo-caption"
                  type="text"
                  maxLength={120}
                  placeholder="What’s the story behind this moment?"
                  value={caption}
                  onChange={(event) => setCaption(event.target.value)}
                />
              </div>
              <button className="clear-preview" type="button" onClick={clearSelection} aria-label="Remove selected photo">
                ×
              </button>
            </div>
          ) : (
            <div className="uploader-prompt">
              <label className="upload-select" htmlFor="photo-upload">
                <span className="upload-icon" aria-hidden="true">
                  <svg viewBox="0 0 22 22">
                    <path d="M11 15V4m0 0L7 8m4-4 4 4M4 14v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3" />
                  </svg>
                </span>
                <span className="upload-select-copy">
                  <strong>Choose a photo</strong>
                  <span>Preview it before sharing</span>
                </span>
              </label>
              <span className="upload-format">JPG, PNG or GIF · up to 10 MB</span>
            </div>
          )}

          <div className="uploader-footer">
            <div className="uploader-tools">
              <label className="tool-button" htmlFor="photo-upload">
                <svg viewBox="0 0 20 20" aria-hidden="true">
                  <rect x="2.5" y="3" width="15" height="14" rx="2" />
                  <circle cx="7" cy="7.5" r="1.5" />
                  <path d="m3 14 4-4 3 3 2-2 5 5" />
                </svg>
                Add photo
              </label>
              <span className="tool-divider" />
              <span className="mood-hint"><span aria-hidden="true">✦</span> Share what made you smile</span>
            </div>
            <div className="uploader-submit-area">
              {file && (
                <button className="share-button" type="submit">
                  {caption.trim() ? 'Save caption' : 'Done'} <span aria-hidden="true">→</span>
                </button>
              )}
            </div>
          </div>
        </form>
        {error && <p className="upload-error" role="alert">{error}</p>}

        <input
          ref={fileInput}
          id="photo-upload"
          className="visually-hidden"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          aria-label="Choose a photo"
        />
      </div>
    </section>
  )
}

export default PhotoUploader
