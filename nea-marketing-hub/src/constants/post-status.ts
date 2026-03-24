import type { PostStatus } from '@/types/models'

export interface StatusConfig {
  label: string
  color: string        // classe Tailwind para badge
  bgColor: string      // classe Tailwind para fundo
  textColor: string    // classe Tailwind para texto
}

export const POST_STATUS: Record<PostStatus, StatusConfig> = {
  ideia:        { label: 'Ideia',        color: 'bg-gray-100 text-gray-600',        bgColor: 'bg-gray-100',        textColor: 'text-gray-600' },
  roteiro:      { label: 'Roteiro',      color: 'bg-blue-100 text-blue-700',        bgColor: 'bg-blue-100',        textColor: 'text-blue-700' },
  em_producao:  { label: 'Em Produção',  color: 'bg-yellow-100 text-yellow-700',    bgColor: 'bg-yellow-100',      textColor: 'text-yellow-700' },
  revisao:      { label: 'Revisão',      color: 'bg-orange-100 text-orange-700',    bgColor: 'bg-orange-100',      textColor: 'text-orange-700' },
  pronto:       { label: 'Pronto',       color: 'bg-emerald-100 text-emerald-700',  bgColor: 'bg-emerald-100',     textColor: 'text-emerald-700' },
  agendado:     { label: 'Agendado',     color: 'bg-purple-100 text-purple-700',    bgColor: 'bg-purple-100',      textColor: 'text-purple-700' },
  publicado:    { label: 'Publicado',    color: 'bg-green-100 text-green-800',      bgColor: 'bg-green-100',       textColor: 'text-green-800' },
  arquivado:    { label: 'Arquivado',    color: 'bg-gray-100 text-gray-400',        bgColor: 'bg-gray-100',        textColor: 'text-gray-400' },
}

// Transições de status permitidas (de → para[])
export const POST_STATUS_TRANSITIONS: Record<PostStatus, PostStatus[]> = {
  ideia:       ['roteiro', 'arquivado'],
  roteiro:     ['em_producao', 'ideia', 'arquivado'],
  em_producao: ['revisao', 'roteiro', 'arquivado'],
  revisao:     ['pronto', 'em_producao', 'arquivado'],
  pronto:      ['agendado', 'revisao', 'arquivado'],
  agendado:    ['publicado', 'pronto', 'arquivado'],
  publicado:   ['arquivado'],     // post publicado só pode ser arquivado
  arquivado:   [],                // estado final — sem transições
}

export const POST_STATUS_ORDER: PostStatus[] = [
  'ideia', 'roteiro', 'em_producao', 'revisao', 'pronto', 'agendado', 'publicado', 'arquivado',
]
