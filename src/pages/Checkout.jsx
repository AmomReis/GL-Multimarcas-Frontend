import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, apenasDigitos, extrairLinkPagamento } from '../lib/api'
import { formatarCep, formatarCpf, formatarTelefone } from '../lib/masks'
import { useCart } from '../context/CartContext'

function formatPrice(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const ENDERECO_VAZIO = { cep: '', rua: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '' }
const CLIENTE_VAZIO = { nome: '', email: '', telefone: '', cpf: '' }

export default function Checkout() {
  const { itens, totalPreco, clear } = useCart()
  const [cliente, setCliente] = useState(CLIENTE_VAZIO)
  const [endereco, setEndereco] = useState(ENDERECO_VAZIO)

  const [buscandoCep, setBuscandoCep] = useState(false)
  const [cepNaoEncontrado, setCepNaoEncontrado] = useState(false)

  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState(null)
  const [redirecionando, setRedirecionando] = useState(false)

  function campo(setter) {
    return (chave) => (e) => setter((prev) => ({ ...prev, [chave]: e.target.value }))
  }
  function campoFormatado(setter, formatador) {
    return (chave) => (e) => setter((prev) => ({ ...prev, [chave]: formatador(e.target.value) }))
  }
  const setClienteCampo = campo(setCliente)
  const setEnderecoCampo = campo(setEndereco)
  const setTelefoneCampo = campoFormatado(setCliente, formatarTelefone)('telefone')
  const setCpfCampo = campoFormatado(setCliente, formatarCpf)('cpf')
  const setCepCampo = campoFormatado(setEndereco, formatarCep)('cep')

  // Autocompleta rua/bairro/cidade/estado a partir do CEP (ViaCEP), pra
  // poupar digitação em teclado de celular. Não bloqueia o envio se falhar
  // — o cliente sempre pode preencher manualmente.
  async function buscarCep() {
    const cepLimpo = apenasDigitos(endereco.cep)
    if (cepLimpo.length !== 8) return

    setBuscandoCep(true)
    setCepNaoEncontrado(false)
    try {
      const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
      const dados = await resposta.json()
      if (dados.erro) {
        setCepNaoEncontrado(true)
        return
      }
      setEndereco((prev) => ({
        ...prev,
        rua: dados.logradouro || prev.rua,
        bairro: dados.bairro || prev.bairro,
        cidade: dados.localidade || prev.cidade,
        estado: dados.uf || prev.estado,
      }))
    } catch {
      // Sem internet ou ViaCEP fora do ar — segue o formulário normalmente.
    } finally {
      setBuscandoCep(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setEnviando(true)
    setErro(null)

    // Formato do payload de exemplo — confirme com o contrato real do
    // endpoint /api/pedidos/checkout no backend e ajuste se necessário.
    const payload = {
      cliente: {
        ...cliente,
        telefone: apenasDigitos(cliente.telefone),
        cpf: apenasDigitos(cliente.cpf),
      },
      enderecoEntrega: {
        ...endereco,
        cep: apenasDigitos(endereco.cep),
      },
      itens: itens.map((i) => ({ produtoId: i.id, quantidade: i.quantidade, tamanho: i.tamanho || null })),
    }

    try {
      const resposta = await api.checkout(payload)
      const urlPagamento = extrairLinkPagamento(resposta.pagamento)

      if (!urlPagamento) {
        setErro('Pedido criado, mas não recebemos o link de pagamento do Mercado Pago. Tente novamente em instantes.')
        return
      }

      setRedirecionando(true)
      clear()
      window.location.assign(urlPagamento)
    } catch (e2) {
      setErro(e2.message)
    } finally {
      setEnviando(false)
    }
  }

  if (itens.length === 0 && !redirecionando) {
    return (
      <div className="pagina-status">
        <p>Sua sacola está vazia.</p>
        <Link to="/loja" className="btn btn--gold">Ver produtos</Link>
      </div>
    )
  }

  // ---- Pedido criado: indo pro checkout do Mercado Pago ----
  if (redirecionando) {
    return (
      <div className="pagina-status">
        <div className="spinner" aria-hidden="true" />
        <p>Levando você pro ambiente seguro do Mercado Pago...</p>
        <p className="pagina-status__aviso">Não feche esta página.</p>
      </div>
    )
  }

  // ---- Formulário de checkout ----
  return (
    <section className="checkout">
      <h1 className="section-title">Finalizar pedido</h1>
      <p className="checkout__mp-aviso">
        O pagamento (Pix, cartão ou boleto) é feito direto no ambiente seguro do Mercado Pago,
        depois de você confirmar seus dados aqui.
      </p>

      <form className="auth-form checkout__form" onSubmit={handleSubmit}>
        <p className="checkout__secao">Seus dados</p>
        <label>
          Nome completo
          <input
            required
            autoComplete="name"
            value={cliente.nome}
            onChange={setClienteCampo('nome')}
          />
        </label>
        <div className="checkout__linha">
          <label>
            E-mail
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={cliente.email}
              onChange={setClienteCampo('email')}
            />
          </label>
          <label>
            Telefone
            <input
              type="tel"
              name="tel"
              inputMode="tel"
              autoComplete="tel"
              required
              value={cliente.telefone}
              onChange={setTelefoneCampo}
              placeholder="(11) 99999-9999"
              maxLength={15}
            />
          </label>
        </div>
        <label>
          CPF
          <input
            name="cpf"
            id="cpf"
            inputMode="numeric"
            required
            value={cliente.cpf}
            onChange={setCpfCampo}
            placeholder="000.000.000-00"
            maxLength={14}
          />
        </label>

        <p className="checkout__secao">Endereço de entrega</p>
        <div className="checkout__linha">
          <label>
            CEP
            <input
              name="postal-code"
              inputMode="numeric"
              autoComplete="postal-code"
              required
              value={endereco.cep}
              onChange={setCepCampo}
              onBlur={buscarCep}
              placeholder="00000-000"
              maxLength={9}
            />
          </label>
          <label>
            Número
            <input
              inputMode="numeric"
              autoComplete="address-line2"
              required
              value={endereco.numero}
              onChange={setEnderecoCampo('numero')}
            />
          </label>
        </div>
        {buscandoCep && <p className="checkout__cep-status">Buscando endereço...</p>}
        {cepNaoEncontrado && <p className="checkout__cep-status checkout__cep-status--erro">CEP não encontrado, preencha manualmente.</p>}
        <label>
          Rua
          <input required autoComplete="address-line1" value={endereco.rua} onChange={setEnderecoCampo('rua')} />
        </label>
        <label>
          Complemento
          <input autoComplete="off" value={endereco.complemento} onChange={setEnderecoCampo('complemento')} />
        </label>
        <div className="checkout__linha">
          <label>
            Bairro
            <input required value={endereco.bairro} onChange={setEnderecoCampo('bairro')} />
          </label>
          <label>
            Cidade
            <input required autoComplete="address-level2" value={endereco.cidade} onChange={setEnderecoCampo('cidade')} />
          </label>
        </div>
        <label>
          Estado (UF)
          <input required maxLength={2} autoComplete="address-level1" value={endereco.estado} onChange={setEnderecoCampo('estado')} />
        </label>

        <div className="carrinho__resumo checkout__resumo">
          <span>Subtotal dos produtos</span>
          <strong>{formatPrice(totalPreco)}</strong>
        </div>
        <p className="checkout__frete-aviso">+ frete calculado pelo backend na confirmação do pedido</p>

        {erro && <p className="auth-form__erro">{erro}</p>}

        <button type="submit" className="btn btn--gold btn--lg" disabled={enviando}>
          {enviando ? 'Enviando pedido...' : 'Ir para pagamento'}
        </button>
      </form>
    </section>
  )
}
