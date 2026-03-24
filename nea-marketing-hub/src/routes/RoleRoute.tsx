import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import type { UserRole } from '@/types/models'

interface RoleRouteProps {
  allowedRoles: UserRole[]
}

// Protege rotas que exigem role específico
export function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const { role, loading } = useAuth()

  if (loading) return null

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
