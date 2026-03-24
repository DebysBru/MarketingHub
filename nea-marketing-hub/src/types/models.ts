// Tipos de domínio — espelham as tabelas do banco de dados

export type UserRole = 'admin' | 'marketing_team' | 'collaborator'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface ProjectProfile {
  id: string
  project_name: string
  target_audience: string | null
  personas: string | null
  tone_of_voice: string | null
  objectives: string | null
  content_pillars: string | null
  channels: string[] | null
  differentials: string | null
  created_by: string
  updated_by: string | null
  created_at: string
  updated_at: string
}

export type IdeaStatus = 'nova' | 'em_uso' | 'usada' | 'arquivada'
export type IdeaFormat = 'reels' | 'carrossel' | 'story' | 'post_estatico' | 'video' | 'campanha' | 'outro'

export interface Idea {
  id: string
  title: string
  description: string | null
  category: string | null
  format: IdeaFormat
  tags: string[]
  status: IdeaStatus
  strategy_id: string | null
  created_by: string
  updated_by: string | null
  created_at: string
  updated_at: string
  // relações opcionais (joins)
  creator?: Pick<User, 'id' | 'name' | 'avatar_url'>
  strategy?: Pick<Strategy, 'id' | 'title'>
}

export interface StrategyCampaign {
  nome: string
  descricao: string
  periodo: string
}

export interface Strategy {
  id: string
  title: string
  month: number
  year: number
  objectives: string | null
  campaigns: Strategycampaign[]
  distribution_notes: string | null
  observations: string | null
  created_by: string
  updated_by: string | null
  created_at: string
  updated_at: string
}

export interface StoryStep {
  ordem: number
  tipo: 'imagem' | 'video' | 'texto' | 'enquete'
  descricao: string
  duracao_seg?: number
  pergunta?: string
  opcoes?: string[]
}

export interface StoryStrategy {
  id: string
  title: string
  description: string | null
  sequence_steps: StoryStep[]
  cta: string | null
  cta_link: string | null
  scheduled_date: string | null
  strategy_id: string | null
  created_by: string
  updated_by: string | null
  created_at: string
  updated_at: string
}

export type PostStatus =
  | 'ideia'
  | 'roteiro'
  | 'em_producao'
  | 'revisao'
  | 'pronto'
  | 'agendado'
  | 'publicado'
  | 'arquivado'

export type PostFormat = 'reels' | 'carrossel' | 'story' | 'post_estatico' | 'video' | 'outro'
export type PostPlatform = 'instagram' | 'facebook' | 'tiktok' | 'linkedin' | 'youtube' | 'outro'

export interface Post {
  id: string
  title: string
  description: string | null
  caption: string | null
  format: PostFormat
  platform: PostPlatform
  objective: string | null
  status: PostStatus
  scheduled_at: string | null
  published_at: string | null
  idea_id: string | null
  strategy_id: string | null
  assigned_to: string
  created_by: string
  updated_by: string | null
  created_at: string
  updated_at: string
  // relações opcionais
  assignee?: Pick<User, 'id' | 'name' | 'avatar_url'>
  idea?: Pick<Idea, 'id' | 'title'>
  strategy?: Pick<Strategy, 'id' | 'title'>
}

export type TaskStatus = 'pendente' | 'em_andamento' | 'em_revisao' | 'concluida'
export type TaskPriority = 'baixa' | 'media' | 'alta' | 'urgente'

export interface Task {
  id: string
  title: string
  description: string | null
  priority: TaskPriority
  status: TaskStatus
  due_date: string
  assigned_to: string
  related_post_id: string | null
  related_strategy_id: string | null
  created_by: string
  updated_by: string | null
  created_at: string
  updated_at: string
  // relações opcionais
  assignee?: Pick<User, 'id' | 'name' | 'avatar_url'>
  related_post?: Pick<Post, 'id' | 'title'>
  // campo calculado — não armazenado no banco
  is_overdue?: boolean
}

export interface MediaFile {
  id: string
  title: string
  file_path: string
  file_url: string | null
  file_type: string
  file_size_bytes: number | null
  original_filename: string | null
  folder: string
  tags: string[]
  uploaded_by: string
  created_at: string
  uploader?: Pick<User, 'id' | 'name'>
}

export type DocumentCategory = 'manual_marca' | 'edital' | 'guia' | 'referencia' | 'outro'

export interface Document {
  id: string
  title: string
  description: string | null
  category: DocumentCategory
  file_path: string | null
  external_url: string | null
  created_by: string
  updated_by: string | null
  created_at: string
  updated_at: string
}

export interface Metrics {
  id: string
  post_id: string
  date_reference: string
  reach: number
  impressions: number
  likes: number
  comments: number
  shares: number
  saves: number
  clicks: number
  followers_growth: number
  notes: string | null
  created_by: string
  created_at: string
  post?: Pick<Post, 'id' | 'title' | 'platform'>
}

export interface WeeklyReview {
  id: string
  week_start: string
  posted_summary: string | null
  worked_well: string | null
  did_not_work: string | null
  lessons_learned: string | null
  next_actions: string | null
  created_by: string
  updated_by: string | null
  created_at: string
  updated_at: string
}

export type NotificationType = 'task_due' | 'post_scheduled' | 'system' | 'mention'

export interface Notification {
  id: string
  title: string
  message: string | null
  type: NotificationType
  read: boolean
  user_id: string
  expires_at: string | null
  created_at: string
}

export interface AIInteraction {
  id: string
  user_id: string
  prompt: string
  response: string
  category: string | null
  is_mock: boolean
  created_at: string
}

// Tipo para o resumo do dashboard (retornado pela RPC)
export interface DashboardSummary {
  pending_tasks_count: number
  overdue_tasks_count: number
  scheduled_posts_count: number
  new_ideas_count: number
  unread_notifications: number
}
