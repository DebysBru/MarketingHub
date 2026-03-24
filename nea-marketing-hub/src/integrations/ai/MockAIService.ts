import type {
  IAIService, IdeaContext, PostContext, StrategyContext, MetricsContext,
  AISuggestion, CampaignSuggestion, MetricsInsight, PostImprovement,
} from './IAIService'
import type { Post } from '@/types/models'

// Simula delay de API real para UX mais realista
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export class MockAIService implements IAIService {
  async generateIdeas(context: IdeaContext): Promise<AISuggestion[]> {
    await delay(1200)
    const base = context.category ?? 'Educativo'
    return [
      {
        id: crypto.randomUUID(),
        title: `${base}: Como o NEA transforma vidas no Vale do Ivaí`,
        description: 'Mostre o impacto real do projeto com depoimentos de beneficiados. Use linguagem acessível e imagens do local.',
        format: 'carrossel',
        tags: ['impacto', 'depoimento', base.toLowerCase()],
      },
      {
        id: crypto.randomUUID(),
        title: `Bastidores: Um dia na equipe do NEA`,
        description: 'Humanize o projeto mostrando a rotina da equipe. Reels curtos e dinâmicos funcionam muito bem para esse formato.',
        format: 'reels',
        tags: ['bastidores', 'equipe', 'institucional'],
      },
      {
        id: crypto.randomUUID(),
        title: `${base} em 5 passos: guia prático`,
        description: 'Conteúdo educativo em formato de lista. Alta taxa de salvamento e compartilhamento.',
        format: 'carrossel',
        tags: ['educativo', 'guia', 'dicas'],
      },
    ]
  }

  async generateCaption(context: PostContext): Promise<string> {
    await delay(900)
    const platformTip: Record<string, string> = {
      instagram: 'Use até 3 hashtags no final.',
      tiktok: 'Comece com uma pergunta ou afirmação impactante.',
      linkedin: 'Tom mais profissional e insights de valor.',
      facebook: 'Texto mais longo com contexto completo.',
    }
    const tip = platformTip[context.platform] ?? 'Adapte o tom ao seu público.'
    return `✨ ${context.title}\n\nO NEA Vale do Ivaí segue comprometido com ${context.objective ?? 'a transformação da nossa comunidade'}.\n\nSaiba mais acompanhando nossa página! 🌿\n\n💡 Dica para ${context.platform}: ${tip}`
  }

  async suggestCampaign(context: StrategyContext): Promise<CampaignSuggestion> {
    await delay(1000)
    const monthNames = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
    const month = monthNames[context.month - 1] ?? 'Mês'
    return {
      nome: `Campanha ${month}/${context.year} — Conexão com a Comunidade`,
      descricao: 'Série de conteúdos mostrando o impacto direto do projeto na vida das pessoas da região. Combine vídeos curtos, carrosséis educativos e stories interativos.',
      periodo: `01/${String(context.month).padStart(2,'0')}/${context.year} a ${new Date(context.year, context.month, 0).getDate()}/${String(context.month).padStart(2,'0')}/${context.year}`,
      objetivo: 'Aumentar engajamento e reconhecimento de marca em 20% no período.',
    }
  }

  async analyzeMetrics(context: MetricsContext): Promise<MetricsInsight> {
    await delay(1400)
    const totalReach = context.metrics.reduce((sum, m) => sum + (m.reach ?? 0), 0)
    const avgLikes = Math.round(context.metrics.reduce((sum, m) => sum + (m.likes ?? 0), 0) / (context.metrics.length || 1))
    return {
      summary: `Período analisado: ${context.posts.length} posts com ${totalReach.toLocaleString('pt-BR')} de alcance total. Média de ${avgLikes} curtidas por post.`,
      highlights: [
        'Reels tiveram 2x mais alcance que posts estáticos',
        'Carrosséis geraram mais salvamentos e compartilhamentos',
        'Melhores horários: terça e quinta entre 18h e 20h',
      ],
      recommendations: [
        'Aumentar frequência de Reels para pelo menos 2 por semana',
        'Criar série de carrosséis educativos mensais',
        'Testar stories interativos com enquetes nos próximos 14 dias',
      ],
    }
  }

  async improvePost(post: Post): Promise<PostImprovement> {
    await delay(1100)
    const original = post.caption ?? post.description ?? post.title
    return {
      original,
      improved: `${original}\n\n🌿 Ficou ainda melhor: adicione uma pergunta ao final para gerar mais comentários, use um CTA claro ("Saiba mais no link da bio") e inclua 3-5 hashtags relevantes ao tema.`,
      explanation: 'Sugeri incluir uma pergunta para engajamento, um CTA direto e hashtags estratégicas. Posts com pergunta têm 40% mais comentários em média.',
    }
  }
}

// Instância singleton do serviço mock
export const aiService: IAIService = new MockAIService()
