import { FolderOpen, Plus } from 'lucide-react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { EmptyState } from '@/components/feedback/EmptyState'
import { Button } from '@/components/ui/button'

export default function DocumentsPage() {
  return (
    <PageWrapper
      title="Documentos Institucionais"
      description="Acesse manuais, editais, guias e referências."
      actions={
        <Button>
          <Plus className="h-4 w-4" />
          Novo Documento
        </Button>
      }
    >
      <EmptyState
        icon={FolderOpen}
        title="Nenhum documento cadastrado"
        description="Cadastre documentos institucionais com arquivo interno ou link externo."
        actionLabel="Cadastrar documento"
        onAction={() => {}}
      />
    </PageWrapper>
  )
}
