const itens = [
  {
    titulo: 'Autenticidade garantida',
    texto: 'Todas as marcas parceiras passam por curadoria antes de entrar na vitrine.',
  },
  {
    titulo: 'Troca sem burocracia',
    texto: 'Não serviu ou não curtiu? Você tem 30 dias pra trocar, sem enrolação.',
  },
  {
    titulo: 'Entrega para todo o Brasil',
    texto: 'Enviamos pra qualquer estado, com frete grátis acima de R$ 300.',
  },
]

export default function ValueProps() {
  return (
    <section id="diferenciais" className="value-props">
      <p className="section-label">Por que a GL</p>
      <div className="value-props__grid">
        {itens.map((item, i) => (
          <div className="value-props__item" key={item.titulo}>
            <span className="value-props__mark">{String(i + 1).padStart(2, '0')}</span>
            <h3>{item.titulo}</h3>
            <p>{item.texto}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
