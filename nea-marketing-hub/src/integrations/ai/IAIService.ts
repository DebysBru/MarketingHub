import type { Idea, Post, Strategy, Metrics } from '@/types/models'

// Tipos de contexto para cada operação de IA
export interface IdeaContext {
  strategy?: Pick<Strategy, 'title' | 'objectives'>
  existingIdeas?: Pick<Idea, 'title' | 'format'>[]
  category?: string
}

export interface PostContext {
  title: string
  format: string
  platform: string
  objective?: string | null
}

export interface StrategyContext {
  month: number
  year: number
  objectives?: string | null
  previousStrategy?: Pick<Strategy, 'observations'>
}

export interface MetricsContext {
  posts: Pick<Post, 'title' | 'platform' | 'format'>[]
  metrics: Pick<Metrics, 'reach' | 'impressions' | 'likes' | 'comments'>[]
}

// Tipos de resposta
export interface AISuggestion {
  id: string
  title: string
  description: string
  format?: string
  tags?: string[]
}

export interface CampaignSuggestion {
  nome: string
  descricao: string
  periodo: string
  objetivo: string
}

export interface MetricsInsight {
  summary: string
  highlights: string[]
  recommendations: string[]
}

export interface PostImprovement {
  original: string
  improved: string
  explanation: string
}

// Contrato da interface de IA — o mock e a integração real implementam essa interface
export interface IAIService {
  generateIdeas(context: IdeaContext): Promise<AISuggestion[]>
  generateCaption(context: PostContext): Promise<string>
  suggestCampaign(context: StrategyContext): Promise<CampaignSuggestion>
  analyzeMetrics(context: MetricsContext): Promise<MetricsInsight>
  improvePost(post: Post): Promise<PostImprovement>
}
