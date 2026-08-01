import { useState } from 'react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [enviado, setEnviado] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!email) return
    setEnviado(true)
  }

  return (
    <section id="clube" className="clube">
      <div className="clube__inner">
        <h2>
          Entre para o <span className="text-outline">Clube GL</span>
        </h2>
        <p>
          Acesso antecipado a novas coleções, descontos exclusivos e convite
          pros eventos da loja. Sem spam, só o essencial.
        </p>

        {enviado ? (
          <p className="clube__sucesso">
            Boa! Enviamos a confirmação para <strong>{email}</strong>.
          </p>
        ) : (
          <form className="clube__form" onSubmit={handleSubmit}>
            <input
              type="email"
              required
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Seu e-mail"
            />
            <button type="submit" className="btn btn--dark">
              Quero entrar
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
