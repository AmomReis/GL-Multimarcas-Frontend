// Animação "voo até a sacola": clona a imagem do produto e anima ela até o
// ícone da sacola numa curva (bézier quadrática), encolhendo e sumindo no
// final. Usada tanto na grade (/loja) quanto na página do produto — qualquer
// elemento de mídia (img ou o SVG de fallback do GarmentIcon) funciona, já
// que clonamos o nó real em vez de recriar um <img>.
//
// O alvo principal (pra onde o clone voa) é marcado com
// data-cart-target="primary" (ícone da sacola na bottom nav, sempre visível
// nesse layout). Todo elemento com data-cart-target (primary ou secondary,
// ex: o ícone do header) recebe o pulso de "chegou" — cobre tanto quem olha
// pro topo quanto pra barra inferior.

function ease(t) {
  // easeInOutCubic: acelera e desacelera suavemente, sem pico de velocidade
  // logo no início (como o easeOutCubic anterior tinha). Isso reduz o salto
  // de posição entre frames em aparelhos que não sustentam 60fps — cada
  // "degrau" da animação fica menor e menos perceptível.
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

// Aparelhos com pouca RAM/poucos núcleos tendem a derrubar frames em
// qualquer animação via JS, não só nessa. Nesses casos pulamos o voo e só
// fazemos o pulso — mesma saída que já existia pra prefers-reduced-motion.
// As APIs usadas aqui só existem no Chromium; em outros navegadores viram
// undefined e a checagem simplesmente não dispara (assume aparelho normal).
function aparelhoFraco() {
  const memoria = navigator.deviceMemory
  const nucleos = navigator.hardwareConcurrency
  return (typeof memoria === 'number' && memoria <= 2) || (typeof nucleos === 'number' && nucleos <= 2)
}

function pulseTargets() {
  const targets = document.querySelectorAll('[data-cart-target]')
  targets.forEach((el) => {
    el.classList.remove('cart-target--pop')
    // força reflow pra reiniciar a animação se o usuário adicionar de novo rápido
    void el.offsetWidth
    el.classList.add('cart-target--pop')
    window.setTimeout(() => el.classList.remove('cart-target--pop'), 550)
  })
}

export function flyToCart(mediaEl) {
  const target = document.querySelector('[data-cart-target="primary"]')

  if (!mediaEl || !target) {
    pulseTargets()
    return
  }

  const startRect = mediaEl.getBoundingClientRect()
  if (startRect.width === 0 || startRect.height === 0) {
    pulseTargets()
    return
  }

  const reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduzMovimento || aparelhoFraco()) {
    pulseTargets()
    return
  }

  const size = 62
  const start = {
    x: startRect.left + startRect.width / 2,
    y: startRect.top + startRect.height / 2,
  }

  const targetRect = target.getBoundingClientRect()
  const end = {
    x: targetRect.left + targetRect.width / 2,
    y: targetRect.top + targetRect.height / 2,
  }

  const control = {
    x: (start.x + end.x) / 2,
    // clamp em 12px: em telas pequenas o produto às vezes já está perto do
    // topo, e sem isso o arco podia "estourar" pra fora da viewport.
    y: Math.max(12, Math.min(start.y, end.y) - Math.max(90, Math.abs(end.x - start.x) * 0.3)),
  }

  const clone = mediaEl.cloneNode(true)
  clone.removeAttribute('id')
  Object.assign(clone.style, {
    position: 'fixed',
    left: `${start.x - size / 2}px`,
    top: `${start.y - size / 2}px`,
    width: `${size}px`,
    height: `${size}px`,
    maxWidth: 'none',
    margin: '0',
    zIndex: '9999',
    pointerEvents: 'none',
    borderRadius: '14px',
    objectFit: 'cover',
    boxShadow: '0 14px 32px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(231, 178, 51, 0.35)',
    willChange: 'transform, opacity',
    transition: 'none',
  })
  document.body.appendChild(clone)

  // Mais lento que o normal de propósito: em celulares fracos, a mesma
  // curva espalhada por mais tempo faz cada frame perdido pesar menos no
  // resultado final, além de ficar com um ritmo mais "premium" (menos
  // afobado) que 700ms.
  const duration = 950
  const startTime = performance.now()

  function frame(now) {
    const t = Math.min(1, (now - startTime) / duration)
    const et = ease(t)
    const mt = 1 - et

    const x = mt * mt * start.x + 2 * mt * et * control.x + et * et * end.x
    const y = mt * mt * start.y + 2 * mt * et * control.y + et * et * end.y
    const scale = 1 - 0.8 * et
    const rotate = et * 16
    const opacity = t < 0.72 ? 1 : Math.max(0, 1 - (t - 0.72) / 0.28)

    clone.style.transform = `translate(${x - start.x}px, ${y - start.y}px) scale(${scale}) rotate(${rotate}deg)`
    clone.style.opacity = String(opacity)

    if (t < 1) {
      requestAnimationFrame(frame)
    } else {
      clone.remove()
      pulseTargets()
    }
  }

  requestAnimationFrame(frame)
}
