import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Sparkles, Send, Lightbulb, FileText, BarChart2, Wand2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { supabase } from '@/integrations/supabase/client'
import { aiService } from '@/integrations/ai/MockAIService'
import { useAuth } from '@/contexts/AuthContext'
import type { AIInteraction } from '@/types/models'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const SUGGESTION_CATEGORIES = [
  { id: 'ideas',    label: 'Sugerir Ideias',     icon: Lightbulb,  description: 'Receba sugestões de conteúdo baseadas na sua estratégia' },
  { id: 'caption',  label: 'Gerar Legenda',       icon: FileText,   description: 'Crie legendas otimizadas para cada plataforma' },
  { id: 'metrics',  label: 'Analisar Métricas',   icon: BarChart2,  description: 'Insights sobre o desempenho dos seus conteúdos' },
  { id: 'improve',  label: 'Melhorar Post',        icon: Wand2,      description: 'Receba sugestões para aprimorar um post existente' },
]

export default function AIPage() {
  const { user } = useAuth()
  const [prompt, setPrompt] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  // Histórico de interações
  const { data: history, isLoading: historyLoading, refetch } = useQuery({
    queryKey: ['ai-history', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('ai_interactions')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(20)
      return (data ?? []) as AIInteraction[]
    },
    enabled: !!user?.id,
  })

  const sendMessage = useMutation({
    mutationFn: async ({ userPrompt, category }: { userPrompt: string; category: string | null }) => {
      // Chama o serviço de IA (mock na v1)
      let response = ''

      if (category === 'ideas') {
        const suggestions = await aiService.generateIdeas({ category: userPrompt })
        response = suggestions.map(s => `**${s.title}**\n${s.description}\nFormato: ${s.format}`).join('\n\n---\n\n')
      } else if (category === 'caption') {
        response = await aiService.generateCaption({ title: userPrompt, format: 'post_estatico', platform: 'instagram' })
      } else if (category === 'metrics') {
        const insight = await aiService.analyzeMetrics({ posts: [], metrics: [] })
        response = `**Resumo:** ${insight.summary}\n\n**Destaques:**\n${insight.highlights.map(h => `• ${h}`).join('\n')}\n\n**Recomendações:**\n${insight.recommendations.map(r => `• ${r}`).join('\n')}`
      } else {
        const suggestions = await aiService.generateIdeas({ category: userPrompt || 'geral' })
        response = suggestions[0]?.description ?? 'Sugestão gerada com base no seu contexto.'
      }

      // Persiste no banco
      await supabase.from('ai_interactions').insert({
        user_id: user!.id,
        prompt: userPrompt,
        response,
        category,
        is_mock: true,
      })

      return response
    },
    onSuccess: () => {
      setPrompt('')
      refetch()
    },
    onError: () => {
      toast.error('Erro ao gerar resposta. Tente novamente.')
    },
  })

  function handleSend() {
    if (!prompt.trim()) {
      toast.error('Digite uma mensagem antes de enviar.')
      return
    }
    sendMessage.mutate({ userPrompt: prompt.trim(), category: activeCategory })
  }

  return (
    <PageWrapper
      title="IFizinha — Assistente Criativo"
      description="Sua assistente de marketing digital. Peça ideias, legendas, análises e muito mais."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Categorias de sugestão */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">O que posso fazer?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {SUGGESTION_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(prev => prev === cat.id ? null : cat.id)}
                  className={cn(
                    'w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-colors',
                    activeCategory === cat.id
                      ? 'border-primary bg-primary/5'
                      : 'hover:bg-muted/50'
                  )}
                >
                  <div className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                    activeCategory === cat.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  )}>
                    <cat.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{cat.label}</p>
                    <p className="text-xs text-muted-foreground">{cat.description}</p>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold">IFizinha + Naiá</p>
                <Badge variant="outline" className="text-xs">Beta</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Assistente criativo do NEA Vale do Ivaí. Em breve com integração à IA generativa.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Chat */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Histórico */}
          <Card className="flex-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Histórico de interações</CardTitle>
              <CardDescription className="text-xs">Suas últimas conversas com a IFizinha</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-96 px-4">
                {historyLoading && (
                  <div className="space-y-3 py-2">
                    {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 rounded-lg" />)}
                  </div>
                )}

                {!historyLoading && history?.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <Sparkles className="h-10 w-10 text-muted-foreground mb-3" />
                    <p className="text-sm font-medium">Olá! Sou a IFizinha.</p>
                    <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                      Escolha uma categoria ao lado e me faça uma pergunta sobre marketing, ideias de conteúdo ou análises.
                    </p>
                  </div>
                )}

                <div className="py-3 space-y-4">
                  {history?.map(interaction => (
                    <div key={interaction.id} className="space-y-2">
                      {/* Pergunta do usuário */}
                      <div className="flex justify-end">
                        <div className="max-w-[80%] rounded-xl rounded-tr-sm bg-primary text-primary-foreground px-4 py-2.5">
                          <p className="text-sm">{interaction.prompt}</p>
                          <p className="text-xs opacity-60 mt-1">
                            {formatDistanceToNow(new Date(interaction.created_at), { addSuffix: true, locale: ptBR })}
                          </p>
                        </div>
                      </div>
                      {/* Resposta da IA */}
                      <div className="flex justify-start">
                        <div className="max-w-[80%] rounded-xl rounded-tl-sm bg-muted px-4 py-2.5">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <Sparkles className="h-3 w-3 text-primary" />
                            <span className="text-xs font-medium text-primary">IFizinha</span>
                            {interaction.is_mock && <Badge variant="outline" className="text-[10px] h-4">Mock</Badge>}
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{interaction.response}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Input */}
          <div className="flex gap-2">
            {activeCategory && (
              <Badge
                className="shrink-0 cursor-pointer h-9 px-3 bg-primary/10 text-primary hover:bg-primary/20"
                onClick={() => setActiveCategory(null)}
              >
                {SUGGESTION_CATEGORIES.find(c => c.id === activeCategory)?.label} ×
              </Badge>
            )}
            <Input
              placeholder={activeCategory
                ? `Descreva o contexto para ${SUGGESTION_CATEGORIES.find(c => c.id === activeCategory)?.label.toLowerCase()}...`
                : 'Faça uma pergunta à IFizinha...'
              }
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
              disabled={sendMessage.isPending}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={sendMessage.isPending || !prompt.trim()}
              size="icon"
            >
              {sendMessage.isPending
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : <Send className="h-4 w-4" />
              }
            </Button>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
