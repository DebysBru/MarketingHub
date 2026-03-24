import { Users } from 'lucide-react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { EmptyState } from '@/components/feedback/EmptyState'

export default function UsersPage() {
  return (
    <PageWrapper
      title="Gerenciar Usuários"
      description="Gerencie os membros e permissões da equipe. Acesso restrito a administradores."
    >
      <EmptyState
        icon={Users}
        title="Gestão de usuários"
        description="Esta tela será implementada na Etapa 4 com listagem, criação e edição de usuários."
      />
    </PageWrapper>
  )
}
