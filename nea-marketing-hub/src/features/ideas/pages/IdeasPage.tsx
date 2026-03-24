import { Lightbulb, Plus } from 'lucide-react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { EmptyState } from '@/components/feedback/EmptyState'
import { Button } from '@/components/ui/button'

export default function IdeasPage() {
  return (
    <PageWrapper
      title="Banco de Ideias"
      description="Cadastre e organize todas as suas ideias de conteúdo."
      actions={
        <Button>
          <Plus className="h-4 w-4" />
          Nova Ideia
        </Button>
      }
    >
      <EmptyState
        icon={Lightbulb}
        title="Nenhuma ideia cadastrada"
        description="Comece registrando sua primeira ideia de conteúdo. Ela ficará aqui até virar um post."
        actionLabel="Criar primeira ideia"
        onAction={() => {}}
      />
    </PageWrapper>
  )
}
