import { CheckSquare, Plus } from 'lucide-react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { EmptyState } from '@/components/feedback/EmptyState'
import { Button } from '@/components/ui/button'

export default function TasksPage() {
  return (
    <PageWrapper
      title="Tarefas"
      description="Acompanhe e gerencie todas as tarefas da equipe."
      actions={
        <Button>
          <Plus className="h-4 w-4" />
          Nova Tarefa
        </Button>
      }
    >
      <EmptyState
        icon={CheckSquare}
        title="Nenhuma tarefa criada"
        description="Crie tarefas, atribua responsáveis e acompanhe prazos e prioridades."
        actionLabel="Criar primeira tarefa"
        onAction={() => {}}
      />
    </PageWrapper>
  )
}
