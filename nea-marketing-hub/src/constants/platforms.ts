import type { PostPlatform, PostFormat, IdeaFormat } from '@/types/models'

export const PLATFORMS: Record<PostPlatform, { label: string; color: string }> = {
  instagram: { label: 'Instagram', color: 'bg-pink-100 text-pink-700' },
  facebook:  { label: 'Facebook',  color: 'bg-blue-100 text-blue-700' },
  tiktok:    { label: 'TikTok',    color: 'bg-gray-100 text-gray-800' },
  linkedin:  { label: 'LinkedIn',  color: 'bg-sky-100 text-sky-700' },
  youtube:   { label: 'YouTube',   color: 'bg-red-100 text-red-700' },
  outro:     { label: 'Outro',     color: 'bg-gray-100 text-gray-600' },
}

export const POST_FORMATS: Record<PostFormat, { label: string }> = {
  reels:        { label: 'Reels' },
  carrossel:    { label: 'Carrossel' },
  story:        { label: 'Story' },
  post_estatico: { label: 'Post Estático' },
  video:        { label: 'Vídeo' },
  outro:        { label: 'Outro' },
}

export const IDEA_FORMATS: Record<IdeaFormat, { label: string }> = {
  reels:        { label: 'Reels' },
  carrossel:    { label: 'Carrossel' },
  story:        { label: 'Story' },
  post_estatico: { label: 'Post Estático' },
  video:        { label: 'Vídeo' },
  campanha:     { label: 'Campanha' },
  outro:        { label: 'Outro' },
}

export const IDEA_CATEGORIES = [
  'Educativo',
  'Institucional',
  'Entretenimento',
  'Campanha',
  'Informativo',
  'Bastidores',
  'Depoimento',
  'Outro',
]

export const MONTHS = [
  { value: 1,  label: 'Janeiro' },
  { value: 2,  label: 'Fevereiro' },
  { value: 3,  label: 'Março' },
  { value: 4,  label: 'Abril' },
  { value: 5,  label: 'Maio' },
  { value: 6,  label: 'Junho' },
  { value: 7,  label: 'Julho' },
  { value: 8,  label: 'Agosto' },
  { value: 9,  label: 'Setembro' },
  { value: 10, label: 'Outubro' },
  { value: 11, label: 'Novembro' },
  { value: 12, label: 'Dezembro' },
]
