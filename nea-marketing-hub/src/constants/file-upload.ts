export const ALLOWED_MIME_TYPES = {
  images: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  videos: ['video/mp4', 'video/quicktime', 'video/mov'],
  documents: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ],
}

export const ALL_ALLOWED_MIME_TYPES = [
  ...ALLOWED_MIME_TYPES.images,
  ...ALLOWED_MIME_TYPES.videos,
  ...ALLOWED_MIME_TYPES.documents,
]

export const MAX_FILE_SIZE = {
  image:    10 * 1024 * 1024,  // 10MB
  video:    50 * 1024 * 1024,  // 50MB
  document: 20 * 1024 * 1024,  // 20MB
}

export function getFileCategory(mimeType: string): 'image' | 'video' | 'document' | 'unknown' {
  if (ALLOWED_MIME_TYPES.images.includes(mimeType)) return 'image'
  if (ALLOWED_MIME_TYPES.videos.includes(mimeType)) return 'video'
  if (ALLOWED_MIME_TYPES.documents.includes(mimeType)) return 'document'
  return 'unknown'
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
