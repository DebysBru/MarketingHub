import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { cn } from '@/lib/utils'

const SIDEBAR_STORAGE_KEY = 'nea-sidebar-collapsed'

export function AppLayout() {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    return localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true'
  })

  function handleToggle() {
    setCollapsed(prev => {
      const next = !prev
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(next))
      return next
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar collapsed={collapsed} onToggle={handleToggle} />
      <Header sidebarCollapsed={collapsed} />

      {/* Área de conteúdo principal */}
      <main
        className={cn(
          'transition-all duration-300 pt-16',
          collapsed ? 'pl-16' : 'pl-60'
        )}
      >
        <div className="p-6 min-h-[calc(100vh-64px)]">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
