import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Bell, Check, CheckCheck } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { toast } from 'sonner'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { EmptyState } from '@/components/feedback/EmptyState'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import type { Notification } from '@/types/models'
import { cn } from '@/lib/utils'

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  task_due:       { label: 'Tarefa',    color: 'bg-orange-100 text-orange-700' },
  post_scheduled: { label: 'Post',      color: 'bg-purple-100 text-purple-700' },
  system:         { label: 'Sistema',   color: 'bg-blue-100 text-blue-700' },
  mention:        { label: 'Menção',    color: 'bg-pink-100 text-pink-700' },
}

export default function NotificationsPage() {
  const { user } = useAuth()
  const qc = useQueryClient()

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(50)
      return (data ?? []) as Notification[]
    },
    enabled: !!user?.id,
  })

  const markAllRead = useMutation({
    mutationFn: async () => {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user!.id)
        .eq('read', false)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] })
      toast.success('Todas as notificações marcadas como lidas')
    },
  })

  const markRead = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from('notifications').update({ read: true }).eq('id', id)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  const unreadCount = notifications?.filter(n => !n.read).length ?? 0

  return (
    <PageWrapper
      title="Notificações"
      description="Avisos, lembretes e atualizações do sistema."
      actions={
        unreadCount > 0 ? (
          <Button variant="outline" size="sm" onClick={() => markAllRead.mutate()}>
            <CheckCheck className="h-4 w-4" />
            Marcar todas como lidas
          </Button>
        ) : undefined
      }
    >
      <Card>
        <CardContent className="p-0">
          {isLoading && (
            <div className="space-y-0 divide-y">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-start gap-4 p-4">
                  <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-64" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && notifications?.length === 0 && (
            <EmptyState
              icon={Bell}
              title="Nenhuma notificação"
              description="Você está em dia! Quando houver avisos ou lembretes, eles aparecerão aqui."
              className="py-16"
            />
          )}

          {!isLoading && notifications && notifications.length > 0 && (
            <div className="divide-y">
              {notifications.map(notif => {
                const typeConfig = TYPE_LABELS[notif.type] ?? TYPE_LABELS.system
                return (
                  <div
                    key={notif.id}
                    className={cn(
                      'flex items-start gap-4 p-4 hover:bg-muted/30 transition-colors',
                      !notif.read && 'bg-blue-50/50 dark:bg-blue-950/20'
                    )}
                  >
                    <div className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                      notif.read ? 'bg-muted' : 'bg-blue-100 dark:bg-blue-900'
                    )}>
                      <Bell className={cn('h-4 w-4', notif.read ? 'text-muted-foreground' : 'text-blue-600')} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={cn('text-sm', !notif.read && 'font-semibold')}>{notif.title}</p>
                        <Badge className={cn('text-xs', typeConfig.color)}>{typeConfig.label}</Badge>
                        {!notif.read && <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />}
                      </div>
                      {notif.message && (
                        <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: ptBR })}
                      </p>
                    </div>

                    {!notif.read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        onClick={() => markRead.mutate(notif.id)}
                        aria-label="Marcar como lida"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </PageWrapper>
  )
}
