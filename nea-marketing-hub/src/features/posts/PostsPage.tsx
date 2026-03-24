import { FileText } from 'lucide-react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { EmptyState } from '@/components/feedback/EmptyState'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function PostsPage() {
  return (
    <PageWrapper
      title="Posts e Conteúdo"
      description="Gerencie todo o fluxo de produção de conteúdo."
      actions={
        <Button>
          <Plus className="h-4 w-4" />
          Adicionar
        </Button>
      }
    >
      <EmptyState
        icon={FileText}
        title="Em construção"
        description="Este módulo será implementado na Etapa 4. A estrutura base já está pronta."
        actionLabel="Adicionar primeiro item"
        onAction={() => {}}
      />
    </PageWrapper>
  )
}
