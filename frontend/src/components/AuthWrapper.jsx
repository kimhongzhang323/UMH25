import { useAuth } from '../hooks/useAuth'
import { Navigate } from 'react-router-dom'

export default function AuthWrapper({ children }) {
  const { session, loading } = useAuth()

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
    </div>
  )

  return session ? children : <Navigate to="/login" replace />
}