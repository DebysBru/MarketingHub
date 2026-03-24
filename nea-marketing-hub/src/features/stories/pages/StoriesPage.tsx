import { BookOpen, Plus } from 'lucide-react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { EmptyState } from '@/components/feedback/EmptyState'
import { Button } from '@/components/ui/button'

export default function StoriesPage() {
  return (
    <PageWrapper
      title="Estratégias de Stories"
      description="Crie sequências de stories com roteiro e CTA."
      actions={
        <Button>
          <Plus className="h-4 w-4" />
          Nova Sequência
        </Button>
      }
    >
      <EmptyState
        icon={BookOpen}
        title="Nenhuma estratégia de stories"
        description="Planeje sequências de stories com roteiro, tipo de card e CTA para cada etapa."
        actionLabel="Criar primeira sequência"
        onAction={() => {}}
      />
    </PageWrapper>
  )
}
