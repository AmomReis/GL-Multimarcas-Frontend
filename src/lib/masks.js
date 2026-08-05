// src/lib/masks.js
// Máscaras de exibição para telefone, CEP e CPF, aplicadas durante a
// digitação. O valor "limpo" (só dígitos) pra mandar pro backend continua
// vindo de `apenasDigitos()` em `lib/api.js`.

export function formatTelefone(valor) {
  const digitos = (valor || '').replace(/\D/g, '').slice(0, 11)
  if (!digitos) return ''
  const ddd = digitos.slice(0, 2)
  if (digitos.length <= 2) return `(${ddd}`

  const numero = digitos.slice(2)
  const celular = digitos.length > 10
  const meio = celular ? numero.slice(0, 5) : numero.slice(0, 4)
  const fim = celular ? numero.slice(5) : numero.slice(4)
  return fim ? `(${ddd}) ${meio}-${fim}` : `(${ddd}) ${meio}`
}

export function formatCEP(valor) {
  return (valor || '')
    .replace(/\D/g, '')
    .slice(0, 8)
    .replace(/^(\d{5})(\d)/, '$1-$2')
}

export function formatCPF(valor) {
  const digitos = (valor || '').replace(/\D/g, '').slice(0, 11)
  const p1 = digitos.slice(0, 3)
  const p2 = digitos.slice(3, 6)
  const p3 = digitos.slice(6, 9)
  const p4 = digitos.slice(9, 11)
  let saida = p1
  if (p2) saida += `.${p2}`
  if (p3) saida += `.${p3}`
  if (p4) saida += `-${p4}`
  return saida
}
