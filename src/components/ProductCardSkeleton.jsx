// Esqueleto do card enquanto os produtos carregam. Mantém exatamente a
// mesma caixa do ProductCard real (mesma proporção de mídia e mesmas
// alturas de texto) pra que a troca não empurre nada na tela.
export default function ProductCardSkeleton() {
  return (
    <div className="product-card product-card--skeleton" aria-hidden="true">
      <div className="product-card__media skeleton" />
      <div className="product-card__info">
        <span className="skeleton skeleton--linha skeleton--linha-nome" />
        <span className="skeleton skeleton--linha skeleton--linha-preco" />
        <span className="skeleton skeleton--linha skeleton--linha-parcelas" />
      </div>
    </div>
  )
}
