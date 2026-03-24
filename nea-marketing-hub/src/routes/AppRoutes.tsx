import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { PrivateRoute } from './PrivateRoute'
import { RoleRoute } from './RoleRoute'
import { AppLayout } from '@/components/layout/AppLayout'
import { Skeleton } from '@/components/ui/skeleton'

// Lazy loading de cada módulo — carregado sob demanda
const LoginPage        = lazy(() => import('@/features/auth/pages/LoginPage'))
const DashboardPage    = lazy(() => import('@/features/dashboard/pages/DashboardPage'))
const IdeasPage        = lazy(() => import('@/features/ideas/pages/IdeasPage'))
const StrategiesPage   = lazy(() => import('@/features/strategies/pages/StrategiesPage'))
const StoriesPage      = lazy(() => import('@/features/stories/pages/StoriesPage'))
const PostsPage        = lazy(() => import('@/features/posts/pages/PostsPage'))
const TasksPage        = lazy(() => import('@/features/tasks/pages/TasksPage'))
const CalendarPage     = lazy(() => import('@/features/calendar/pages/CalendarPage'))
const MediaPage        = lazy(() => import('@/features/media/pages/MediaPage'))
const DocumentsPage    = lazy(() => import('@/features/documents/pages/DocumentsPage'))
const MetricsPage      = lazy(() => import('@/features/metrics/pages/MetricsPage'))
const ReviewsPage      = lazy(() => import('@/features/reviews/pages/ReviewsPage'))
const NotificationsPage = lazy(() => import('@/features/notifications/pages/NotificationsPage'))
const AIPage           = lazy(() => import('@/features/ai/pages/AIPage'))
const UsersPage        = lazy(() => import('@/features/users/pages/UsersPage'))
const NotFoundPage     = lazy(() => import('@/features/auth/pages/NotFoundPage'))

function PageLoader() {
  return (
    <div className="space-y-4 p-6">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-96" />
      <div className="grid grid-cols-4 gap-4 mt-6">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
      </div>
      <Skeleton className="h-64 rounded-xl mt-4" />
    </div>
  )
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Rota pública */}
          <Route path="/login" element={<LoginPage />} />

          {/* Rotas protegidas — exigem autenticação */}
          <Route element={<PrivateRoute />}>
            <Route element={<AppLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard"     element={<DashboardPage />} />
              <Route path="/ideas"         element={<IdeasPage />} />
              <Route path="/strategies"    element={<StrategiesPage />} />
              <Route path="/stories"       element={<StoriesPage />} />
              <Route path="/posts"         element={<PostsPage />} />
              <Route path="/tasks"         element={<TasksPage />} />
              <Route path="/calendar"      element={<CalendarPage />} />
              <Route path="/media"         element={<MediaPage />} />
              <Route path="/documents"     element={<DocumentsPage />} />
              <Route path="/metrics"       element={<MetricsPage />} />
              <Route path="/reviews"       element={<ReviewsPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/ai"            element={<AIPage />} />

              {/* Rotas exclusivas de Admin */}
              <Route element={<RoleRoute allowedRoles={['admin']} />}>
                <Route path="/users" element={<UsersPage />} />
              </Route>
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
