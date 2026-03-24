import { FileText, Plus } from 'lucide-react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { EmptyState } from '@/components/feedback/EmptyState'
import { Button } from '@/components/ui/button'

export default function PostsPage() {
  return (
    <PageWrapper
      title="Posts e Conteúdo"
      description="Gerencie todo o fluxo de produção de conteúdo."
      actions={
        <Button>
          <Plus className="h-4 w-4" />
          Novo Post
        </Button>
      }
    >
      <EmptyState
        icon={FileText}
        title="Nenhum post criado"
        description="Crie posts e acompanhe cada etapa: ideia → roteiro → produção → revisão → publicação."
        actionLabel="Criar primeiro post"
        onAction={() => {}}
      />
    </PageWrapper>
  )
}
