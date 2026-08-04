import { IconCrown } from './icons'

const SELOS_PADRAO = [
  'Troca fácil em 30 dias',
  'Frete grátis acima de R$299',
  'Até 3x sem juros',
  '100% originais',
]

export default function TopBar({ itens = SELOS_PADRAO }) {
  // Duplicamos a lista pra animação de scroll ficar contínua (mesma técnica do Marquee).
  const volta = [...itens, ...itens]

  return (
    <div className="topbar" role="presentation">
      <div className="topbar__track">
        {volta.map((texto, i) => (
          <span className="topbar__item" key={`${texto}-${i}`}>
            <IconCrown className="topbar__icon" aria-hidden="true" />
            {texto}
          </span>
        ))}
      </div>
    </div>
  )
}
