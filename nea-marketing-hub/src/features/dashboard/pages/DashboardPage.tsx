import { useQuery } from '@tanstack/react-query'
import {
  CheckSquare, FileText, Lightbulb, Bell, TrendingUp,
  AlertCircle, Calendar, ArrowRight, Loader2,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import { POST_STATUS } from '@/constants/post-status'
import { TASK_PRIORITY } from '@/constants/task-status'
import type { Task, Post, Notification } from '@/types/models'
import { cn } from '@/lib/utils'

// Cards de resumo do dashboard
interface SummaryCardProps {
  title: string
  value: number | string
  icon: React.ElementType
  description: string
  color: string
  onClick?: () => void
}

function SummaryCard({ title, value, icon: Icon, description, color, onClick }: SummaryCardProps) {
  return (
    <Card
      className={cn('cursor-pointer hover:shadow-md transition-shadow', onClick && 'cursor-pointer')}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
          <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', color)}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const today = new Date().toISOString().split('T')[0]
  const greeting = getGreeting()

  // Tarefas pendentes do usuário
  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['dashboard-tasks', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('tasks')
        .select('*, assignee:users!assigned_to(id,name,avatar_url)')
        .eq('assigned_to', user!.id)
        .neq('status', 'concluida')
        .order('due_date', { ascending: true })
        .limit(5)
      return (data ?? []) as Task[]
    },
    enabled: !!user?.id,
    staleTime: 30 * 1000,
  })

  // Posts agendados próximos
  const { data: scheduledPosts, isLoading: postsLoading } = useQuery({
    queryKey: ['dashboard-scheduled-posts'],
    queryFn: async () => {
      const { data } = await supabase
        .from('posts')
        .select('*, assignee:users!assigned_to(id,name,avatar_url)')
        .in('status', ['agendado', 'pronto'])
        .order('scheduled_at', { ascending: true })
        .limit(5)
      return (data ?? []) as Post[]
    },
    staleTime: 30 * 1000,
  })

  // Notificações não lidas
  const { data: notifications, isLoading: notifsLoading } = useQuery({
    queryKey: ['dashboard-notifications', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user!.id)
        .eq('read', false)
        .order('created_at', { ascending: false })
        .limit(5)
      return (data ?? []) as Notification[]
    },
    enabled: !!user?.id,
    staleTime: 30 * 1000,
  })

  // Contagens de resumo
  const { data: counts } = useQuery({
    queryKey: ['dashboard-counts', user?.id],
    queryFn: async () => {
      const [tasksCount, overdueCount, postsCount, ideasCount, notifsCount] = await Promise.all([
        supabase.from('tasks').select('id', { count: 'exact', head: true }).eq('assigned_to', user!.id).neq('status', 'concluida'),
        supabase.from('tasks').select('id', { count: 'exact', head: true }).eq('assigned_to', user!.id).neq('status', 'concluida').lt('due_date', today),
        supabase.from('posts').select('id', { count: 'exact', head: true }).eq('status', 'agendado'),
        supabase.from('ideas').select('id', { count: 'exact', head: true }).eq('status', 'nova'),
        supabase.from('notifications').select('id', { count: 'exact', head: true }).eq('user_id', user!.id).eq('read', false),
      ])
      return {
        tasks: tasksCount.count ?? 0,
        overdue: overdueCount.count ?? 0,
        posts: postsCount.count ?? 0,
        ideas: ideasCount.count ?? 0,
        notifications: notifsCount.count ?? 0,
      }
    },
    enabled: !!user?.id,
    staleTime: 30 * 1000,
  })

  return (
    <PageWrapper
      title={`${greeting}, ${user?.name?.split(' ')[0] ?? 'usuário'}!`}
      description="Aqui está o resumo de hoje no NEA Marketing Hub."
    >
      {/* Cards de resumo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Tarefas Pendentes"
          value={counts?.tasks ?? '—'}
          icon={CheckSquare}
          description={counts?.overdue ? `${counts.overdue} atrasadas` : 'Sem atrasos'}
          color={counts?.overdue ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}
          onClick={() => navigate('/tasks')}
        />
        <SummaryCard
          title="Posts Agendados"
          value={counts?.posts ?? '—'}
          icon={FileText}
          description="Aguardando publicação"
          color="bg-purple-100 text-purple-700"
          onClick={() => navigate('/posts')}
        />
        <SummaryCard
          title="Novas Ideias"
          value={counts?.ideas ?? '—'}
          icon={Lightbulb}
          description="Aguardando planejamento"
          color="bg-yellow-100 text-yellow-700"
          onClick={() => navigate('/ideas')}
        />
        <SummaryCard
          title="Notificações"
          value={counts?.notifications ?? '—'}
          icon={Bell}
          description="Não lidas"
          color="bg-blue-100 text-blue-700"
          onClick={() => navigate('/notifications')}
        />
      </div>

      {/* Conteúdo principal — 2 colunas */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Tarefas próximas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Minhas Tarefas</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/tasks')}>
              Ver todas <ArrowRight className="h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {tasksLoading && [...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 rounded-lg" />)}
            {!tasksLoading && tasks?.length === 0 && (
              <div className="flex flex-col items-center py-8 text-center">
                <CheckSquare className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Nenhuma tarefa pendente</p>
              </div>
            )}
            {!tasksLoading && tasks?.map(task => {
              const isOverdue = new Date(task.due_date) < new Date() && task.status !== 'concluida'
              return (
                <div
                  key={task.id}
                  className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/40 transition-colors cursor-pointer"
                  onClick={() => navigate('/tasks')}
                >
                  <div className={cn(
                    'mt-0.5 h-2 w-2 rounded-full shrink-0',
                    TASK_PRIORITY[task.priority].dotColor
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={cn('text-xs', isOverdue ? 'text-destructive font-medium' : 'text-muted-foreground')}>
                        {isOverdue && <AlertCircle className="inline h-3 w-3 mr-1" />}
                        {formatDistanceToNow(new Date(task.due_date), { addSuffix: true, locale: ptBR })}
                      </span>
                    </div>
                  </div>
                  <Badge className={cn('text-xs shrink-0', TASK_PRIORITY[task.priority].color)}>
                    {TASK_PRIORITY[task.priority].label}
                  </Badge>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Posts agendados */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Posts Próximos</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/posts')}>
              Ver todos <ArrowRight className="h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {postsLoading && [...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 rounded-lg" />)}
            {!postsLoading && scheduledPosts?.length === 0 && (
              <div className="flex flex-col items-center py-8 text-center">
                <Calendar className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Nenhum post agendado</p>
              </div>
            )}
            {!postsLoading && scheduledPosts?.map(post => (
              <div
                key={post.id}
                className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/40 transition-colors cursor-pointer"
                onClick={() => navigate('/posts')}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{post.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 capitalize">{post.platform}</p>
                </div>
                <Badge className={cn('text-xs shrink-0', POST_STATUS[post.status].color)}>
                  {POST_STATUS[post.status].label}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Notificações recentes */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Notificações Recentes</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/notifications')}>
              Ver todas <ArrowRight className="h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent>
            {notifsLoading && [...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 rounded-lg mb-2" />)}
            {!notifsLoading && notifications?.length === 0 && (
              <div className="flex flex-col items-center py-8 text-center">
                <Bell className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Sem notificações não lidas</p>
              </div>
            )}
            <div className="space-y-2">
              {!notifsLoading && notifications?.map(notif => (
                <div key={notif.id} className="flex items-center gap-3 p-3 rounded-lg border bg-blue-50/50 dark:bg-blue-950/20">
                  <TrendingUp className="h-4 w-4 text-blue-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{notif.title}</p>
                    {notif.message && <p className="text-xs text-muted-foreground">{notif.message}</p>}
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: ptBR })}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Atalhos rápidos */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Atalhos Rápidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { label: 'Nova Ideia',      icon: Lightbulb,  to: '/ideas',         color: 'text-yellow-600 bg-yellow-50' },
              { label: 'Novo Post',       icon: FileText,   to: '/posts',         color: 'text-purple-600 bg-purple-50' },
              { label: 'Nova Tarefa',     icon: CheckSquare,to: '/tasks',         color: 'text-green-600 bg-green-50' },
              { label: 'Calendário',      icon: Calendar,   to: '/calendar',      color: 'text-blue-600 bg-blue-50' },
              { label: 'Drive',           icon: TrendingUp, to: '/media',         color: 'text-pink-600 bg-pink-50' },
              { label: 'Métricas',        icon: TrendingUp, to: '/metrics',       color: 'text-orange-600 bg-orange-50' },
              { label: 'IFizinha',        icon: Bell,       to: '/ai',            color: 'text-indigo-600 bg-indigo-50' },
            ].map(item => (
              <button
                key={item.to}
                onClick={() => navigate(item.to)}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border hover:shadow-sm hover:border-primary/30 transition-all group"
              >
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', item.color)}>
                  <item.icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-center">{item.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageWrapper>
  )
}

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}
