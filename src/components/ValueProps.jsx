import { IconShield, IconTruck, IconCard, IconRefresh } from './icons'

const itens = [
  {
    icone: IconShield,
    titulo: '100% originais',
    texto: 'Peças conferidas uma a uma.',
  },
  {
    icone: IconTruck,
    titulo: 'Frete grátis',
    texto: 'Acima de R$ 299 para todo o Brasil.',
  },
  {
    icone: IconCard,
    titulo: 'Até 3x sem juros',
    texto: 'Pagamento seguro e criptografado.',
  },
  {
    icone: IconRefresh,
    titulo: 'Troca fácil',
    texto: '30 dias para trocar ou devolver.',
  },
]

export default function ValueProps() {
  return (
    <section id="diferenciais" className="value-props">
      <div className="value-props__grid">
        {itens.map((item) => (
          <div className="value-props__item" key={item.titulo}>
            <item.icone className="value-props__icon" aria-hidden="true" />
            <h3>{item.titulo}</h3>
            <p>{item.texto}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
