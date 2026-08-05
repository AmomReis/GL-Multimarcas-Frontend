// src/lib/api.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'
const TOKEN_KEY = 'gl_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

async function apiFetch(path, options = {}) {
  const token = getToken()
  const headers = { ...options.headers }
  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(`${API_URL}${path}`, { ...options, headers })

  if (!response.ok) {
    const problema = await response.json().catch(() => null)
    throw new Error(problema?.detail || `Erro HTTP ${response.status}`)
  }

  if (response.status === 204) return null
  return response.json()
}

function jsonRequest(path, options = {}) {
  return apiFetch(path, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  })
}

export function montarUrlImagem(imagemUrl) {
  if (!imagemUrl) return ''
  if (imagemUrl.startsWith('http')) return imagemUrl
  const path = imagemUrl.startsWith('/') ? imagemUrl : `/${imagemUrl}`
  return `${API_URL}${path}`
}

export function apenasDigitos(valor) {
  return (valor || '').replace(/\D/g, '')
}

function buildQuery(params = {}) {
  const entradas = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== '',
  )
  if (entradas.length === 0) return ''
  return '?' + new URLSearchParams(entradas).toString()
}

export function extrairLinkPagamento(pagamento) {
  if (!pagamento) return null
  return (
    pagamento.linkPagamento ||
    pagamento.linkPagamentoSandbox ||
    pagamento.initPoint ||
    pagamento.init_point ||
    pagamento.sandboxInitPoint ||
    pagamento.sandbox_init_point ||
    null
  )
}

export const api = {
  // Produtos
  getProdutos: (filtros = {}) => apiFetch(`/api/produtos${buildQuery(filtros)}`),
  getProduto: (id) => apiFetch(`/api/produtos/${id}`),

  // Checkout
  checkout: (dados) => jsonRequest('/api/pedidos/checkout', { method: 'POST', body: JSON.stringify(dados) }),
  getPedidos: () => apiFetch('/api/pedidos'),
  getPedido: (id) => apiFetch(`/api/pedidos/${id}`),
  getPedidoStatusPublico: (id) => apiFetch(`/api/pedidos/${id}/status-publico`),
  atualizarStatusPedido: (id, status) =>
    jsonRequest(`/api/pedidos/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  // Auth — ainda precisa existir no backend, ver observação abaixo
  login: (email, senha) =>
    jsonRequest('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, senha }) }),
  registrar: (nome, email, senha) =>
    jsonRequest('/api/auth/registrar', { method: 'POST', body: JSON.stringify({ nome, email, senha }) }),
  
  // Admin — produtos
  criarProduto: (dadosProduto, arquivoImagem) => {
    const formData = new FormData()
    formData.append('dados', new Blob([JSON.stringify(dadosProduto)], { type: 'application/json' }))
    if (arquivoImagem) formData.append('imagem', arquivoImagem)
    // Sem Content-Type manual: o navegador define o boundary do multipart sozinho.
    return apiFetch('/api/produtos', { method: 'POST', body: formData })
  },
  atualizarProduto: (id, dadosProduto) =>
    jsonRequest(`/api/produtos/${id}`, { method: 'PUT', body: JSON.stringify(dadosProduto) }),
  excluirProduto: (id) => apiFetch(`/api/produtos/${id}`, { method: 'DELETE' }),
}

export const CATEGORIAS = [
  'CAMISA', 'BERMUDA', 'CALCA', 'SANDALIA', 'TENIS',
  'RELOGIO', 'OCULOS', 'ANEL', 'BONE', 'COLAR',
]

export const CATEGORIA_LABEL = {
  CAMISA: 'Camisas', BERMUDA: 'Bermudas', CALCA: 'Calças',
  SANDALIA: 'Sandálias', TENIS: 'Tênis', RELOGIO: 'Relógios',
  OCULOS: 'Óculos', ANEL: 'Anéis', BONE: 'Bonés', COLAR: 'Colares',
}