import { HardDrive, Plus } from 'lucide-react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { EmptyState } from '@/components/feedback/EmptyState'
import { Button } from '@/components/ui/button'

export default function MediaPage() {
  return (
    <PageWrapper
      title="Drive e Mídias"
      description="Armazene e organize imagens, vídeos e documentos."
      actions={
        <Button>
          <Plus className="h-4 w-4" />
          Fazer Upload
        </Button>
      }
    >
      <EmptyState
        icon={HardDrive}
        title="Drive vazio"
        description="Faça upload de imagens, vídeos e documentos para organizar as mídias do projeto."
        actionLabel="Primeiro upload"
        onAction={() => {}}
      />
    </PageWrapper>
  )
}
