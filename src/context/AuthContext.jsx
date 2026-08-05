import { createContext, useContext, useEffect, useState } from 'react'
import { api, getToken, setToken } from '../lib/api'

const AuthContext = createContext(null)
const USER_KEY = 'gl_user'

function loadUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
    else localStorage.removeItem(USER_KEY)
  }, [user])

  async function login(email, senha) {
    setCarregando(true)
    setErro(null)
    try {
      const resposta = await api.login(email, senha)
      setToken(resposta.token)
      setUser(resposta.usuario)
      return true
    } catch (e) {
      setErro(e.message)
      return false
    } finally {
      setCarregando(false)
    }
  }

  function logout() {
    setToken(null)
    setUser(null)
  }

  const value = {
    user,
    autenticado: Boolean(user && getToken()),
    carregando,
    erro,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth precisa estar dentro de <AuthProvider>')
  return ctx
}
