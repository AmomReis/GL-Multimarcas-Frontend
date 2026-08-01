const ITEM = 'NOVA COLEÇÃO'
const SEP = '✦'

export default function Marquee() {
  const chunk = Array.from({ length: 8 }, () => ITEM).join(`  ${SEP}  `)

  return (
    <div className="marquee" role="presentation">
      <div className="marquee__track">
        <span className="marquee__text">{chunk}</span>
        <span className="marquee__text" aria-hidden="true">{chunk}</span>
      </div>
    </div>
  )
}
