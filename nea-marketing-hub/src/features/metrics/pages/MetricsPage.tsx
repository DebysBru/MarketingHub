import { BarChart2, Plus } from 'lucide-react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { EmptyState } from '@/components/feedback/EmptyState'
import { Button } from '@/components/ui/button'

export default function MetricsPage() {
  return (
    <PageWrapper
      title="Métricas"
      description="Registre e analise o desempenho dos seus conteúdos."
      actions={
        <Button>
          <Plus className="h-4 w-4" />
          Registrar Métricas
        </Button>
      }
    >
      <EmptyState
        icon={BarChart2}
        title="Nenhuma métrica registrada"
        description="Registre métricas dos seus posts para visualizar gráficos comparativos e identificar os melhores conteúdos."
        actionLabel="Registrar primeiras métricas"
        onAction={() => {}}
      />
    </PageWrapper>
  )
}
