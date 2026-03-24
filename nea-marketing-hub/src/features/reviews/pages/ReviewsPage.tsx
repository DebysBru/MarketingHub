import { RefreshCw, Plus } from 'lucide-react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { EmptyState } from '@/components/feedback/EmptyState'
import { Button } from '@/components/ui/button'

export default function ReviewsPage() {
  return (
    <PageWrapper
      title="Revisão Semanal"
      description="Registre aprendizados e planeje a próxima semana."
      actions={
        <Button>
          <Plus className="h-4 w-4" />
          Nova Revisão
        </Button>
      }
    >
      <EmptyState
        icon={RefreshCw}
        title="Nenhuma revisão registrada"
        description="Registre o que funcionou, o que não funcionou e os aprendizados da semana para evoluir continuamente."
        actionLabel="Criar revisão desta semana"
        onAction={() => {}}
      />
    </PageWrapper>
  )
}
