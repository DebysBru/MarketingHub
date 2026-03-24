import { Sparkles } from 'lucide-react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { EmptyState } from '@/components/feedback/EmptyState'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function AIPage() {
  return (
    <PageWrapper
      title="IFizinha — Assistente IA"
      description="Sua assistente criativa para ideias, legendas e análises."
      actions={
        <Button>
          <Plus className="h-4 w-4" />
          Adicionar
        </Button>
      }
    >
      <EmptyState
        icon={Sparkles}
        title="Em construção"
        description="Este módulo será implementado na Etapa 4. A estrutura base já está pronta."
        actionLabel="Adicionar primeiro item"
        onAction={() => {}}
      />
    </PageWrapper>
  )
}
