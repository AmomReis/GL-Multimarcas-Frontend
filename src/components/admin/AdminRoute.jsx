import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function AdminRoute({ children }) {
  const { autenticado, user } = useAuth()
  const location = useLocation()

  if (!autenticado) {
    return <Navigate to="/entrar" state={{ from: location }} replace />
  }

  if (!user?.admin) {
    return <Navigate to="/" replace />
  }

  return children
}