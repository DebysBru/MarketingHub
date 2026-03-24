import type { TaskStatus, TaskPriority } from '@/types/models'

export const TASK_STATUS: Record<TaskStatus, { label: string; color: string }> = {
  pendente:     { label: 'Pendente',     color: 'bg-gray-100 text-gray-600' },
  em_andamento: { label: 'Em Andamento', color: 'bg-blue-100 text-blue-700' },
  em_revisao:   { label: 'Em Revisão',   color: 'bg-yellow-100 text-yellow-700' },
  concluida:    { label: 'Concluída',    color: 'bg-green-100 text-green-700' },
}

export const TASK_PRIORITY: Record<TaskPriority, { label: string; color: string; dotColor: string }> = {
  baixa:   { label: 'Baixa',   color: 'bg-gray-100 text-gray-500',   dotColor: 'bg-gray-400' },
  media:   { label: 'Média',   color: 'bg-blue-100 text-blue-600',   dotColor: 'bg-blue-500' },
  alta:    { label: 'Alta',    color: 'bg-orange-100 text-orange-600', dotColor: 'bg-orange-500' },
  urgente: { label: 'Urgente', color: 'bg-red-100 text-red-700',     dotColor: 'bg-red-500' },
}
