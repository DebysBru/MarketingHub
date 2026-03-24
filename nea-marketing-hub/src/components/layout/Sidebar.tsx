import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Lightbulb, Target, BookOpen, FileText, CheckSquare,
  Calendar, HardDrive, FolderOpen, BarChart2, RefreshCw, Bell,
  Sparkles, Users, ChevronLeft, ChevronRight, Leaf,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/contexts/AuthContext'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

interface NavItem {
  label: string
  icon: React.ElementType
  to: string
  adminOnly?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard',           icon: LayoutDashboard, to: '/dashboard' },
  { label: 'Banco de Ideias',     icon: Lightbulb,       to: '/ideas' },
  { label: 'Estratégias',         icon: Target,          to: '/strategies' },
  { label: 'Stories',             icon: BookOpen,        to: '/stories' },
  { label: 'Posts',               icon: FileText,        to: '/posts' },
  { label: 'Tarefas',             icon: CheckSquare,     to: '/tasks' },
  { label: 'Calendário',          icon: Calendar,        to: '/calendar' },
  { label: 'Drive & Mídias',      icon: HardDrive,       to: '/media' },
  { label: 'Documentos',          icon: FolderOpen,      to: '/documents' },
  { label: 'Métricas',            icon: BarChart2,       to: '/metrics' },
  { label: 'Revisão Semanal',     icon: RefreshCw,       to: '/reviews' },
  { label: 'Notificações',        icon: Bell,            to: '/notifications' },
  { label: 'IFizinha IA',         icon: Sparkles,        to: '/ai' },
]

const ADMIN_ITEMS: NavItem[] = [
  { label: 'Usuários',            icon: Users,           to: '/users', adminOnly: true },
]

function NavItemComponent({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const location = useLocation()
  const isActive = location.pathname.startsWith(item.to)

  const link = (
    <NavLink
      to={item.to}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent',
        isActive && 'bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 hover:text-sidebar-primary-foreground',
        collapsed && 'justify-center px-2'
      )}
    >
      <item.icon className="h-5 w-5 shrink-0" />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </NavLink>
  )

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right">{item.label}</TooltipContent>
      </Tooltip>
    )
  }

  return link
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { isAdmin } = useAuth()

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300',
          collapsed ? 'w-16' : 'w-60'
        )}
      >
        {/* Logo */}
        <div className={cn(
          'flex items-center h-16 px-4 border-b border-sidebar-border shrink-0',
          collapsed ? 'justify-center' : 'justify-between'
        )}>
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
                <Leaf className="h-5 w-5 text-sidebar-primary-foreground" />
              </div>
              <div className="leading-tight">
                <p className="text-xs font-bold text-sidebar-foreground">NEA</p>
                <p className="text-[10px] text-sidebar-foreground/60">Marketing Hub</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
              <Leaf className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
          )}
          <button
            onClick={onToggle}
            className={cn(
              'flex h-6 w-6 items-center justify-center rounded-md text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors',
              collapsed && 'hidden'
            )}
            aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>

        {/* Botão de expandir quando collapsed */}
        {collapsed && (
          <button
            onClick={onToggle}
            className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-sidebar-border bg-sidebar text-sidebar-foreground/60 hover:text-sidebar-foreground shadow-sm"
            aria-label="Expandir menu"
          >
            <ChevronRight className="h-3 w-3" />
          </button>
        )}

        {/* Navegação principal */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 scrollbar-thin space-y-1">
          {NAV_ITEMS.map(item => (
            <NavItemComponent key={item.to} item={item} collapsed={collapsed} />
          ))}

          {isAdmin && (
            <>
              <Separator className="my-3 bg-sidebar-border" />
              {ADMIN_ITEMS.map(item => (
                <NavItemComponent key={item.to} item={item} collapsed={collapsed} />
              ))}
            </>
          )}
        </nav>

        {/* Rodapé da sidebar */}
        {!collapsed && (
          <div className="px-4 py-3 border-t border-sidebar-border shrink-0">
            <p className="text-[10px] text-sidebar-foreground/40 text-center">
              NEA Vale do Ivaí — IFPR
            </p>
          </div>
        )}
      </aside>
    </TooltipProvider>
  )
}
