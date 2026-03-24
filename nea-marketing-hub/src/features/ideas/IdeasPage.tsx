import { Lightbulb } from 'lucide-react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { EmptyState } from '@/components/feedback/EmptyState'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function IdeasPage() {
  return (
    <PageWrapper
      title="Banco de Ideias"
      description="Cadastre e organize todas as suas ideias de conteúdo."
      actions={
        <Button>
          <Plus className="h-4 w-4" />
          Adicionar
        </Button>
      }
    >
      <EmptyState
        icon={Lightbulb}
        title="Em construção"
        description="Este módulo será implementado na Etapa 4. A estrutura base já está pronta."
        actionLabel="Adicionar primeiro item"
        onAction={() => {}}
      />
    </PageWrapper>
  )
}
