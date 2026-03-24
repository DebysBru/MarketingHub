import { Calendar } from 'lucide-react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { EmptyState } from '@/components/feedback/EmptyState'

export default function CalendarPage() {
  return (
    <PageWrapper
      title="Calendário Editorial"
      description="Visualize e planeje publicações e tarefas no tempo."
    >
      <EmptyState
        icon={Calendar}
        title="Calendário em construção"
        description="O calendário com drag and drop será implementado na Etapa 4. Agende posts para vê-los aqui."
      />
    </PageWrapper>
  )
}
