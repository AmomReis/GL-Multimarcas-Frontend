import { apenasDigitos } from './api'

export function formatarTelefone(valor) {
  const digitos = apenasDigitos(valor).slice(0, 11)
  if (digitos.length <= 2) return digitos.replace(/^(\d{0,2})/, '($1')
  if (digitos.length <= 6) return digitos.replace(/^(\d{2})(\d{0,4})/, '($1) $2')
  if (digitos.length <= 10) return digitos.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
  return digitos.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3')
}

export function formatarCep(valor) {
  const digitos = apenasDigitos(valor).slice(0, 8)
  if (digitos.length <= 5) return digitos
  return digitos.replace(/^(\d{5})(\d{0,3})/, '$1-$2')
}

export function formatarCpf(valor) {
  const digitos = apenasDigitos(valor).slice(0, 11)
  if (digitos.length <= 3) return digitos
  if (digitos.length <= 6) return digitos.replace(/^(\d{3})(\d{0,3})/, '$1.$2')
  if (digitos.length <= 9) return digitos.replace(/^(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3')
  return digitos.replace(/^(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4')
}
