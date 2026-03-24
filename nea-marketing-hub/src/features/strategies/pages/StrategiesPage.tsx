import { Target, Plus } from 'lucide-react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { EmptyState } from '@/components/feedback/EmptyState'
import { Button } from '@/components/ui/button'

export default function StrategiesPage() {
  return (
    <PageWrapper
      title="Estratégias"
      description="Planeje suas estratégias mensais de conteúdo."
      actions={
        <Button>
          <Plus className="h-4 w-4" />
          Nova Estratégia
        </Button>
      }
    >
      <EmptyState
        icon={Target}
        title="Nenhuma estratégia criada"
        description="Crie a estratégia do mês com objetivos, campanhas e distribuição de conteúdo."
        actionLabel="Criar estratégia"
        onAction={() => {}}
      />
    </PageWrapper>
  )
}
