import { useNavigate } from 'react-router-dom'
import { Leaf, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-6">
        <Leaf className="h-8 w-8 text-muted-foreground" />
      </div>
      <h1 className="text-5xl font-bold text-foreground mb-2">404</h1>
      <h2 className="text-xl font-semibold mb-2">Página não encontrada</h2>
      <p className="text-muted-foreground max-w-sm mb-8">
        A página que você está procurando não existe ou foi movida.
      </p>
      <Button onClick={() => navigate('/dashboard')}>
        <ArrowLeft className="h-4 w-4" />
        Voltar ao Dashboard
      </Button>
    </div>
  )
}
