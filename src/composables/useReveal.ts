import type { ObjectDirective } from 'vue'

/**
 * v-reveal: el elemento sube y aparece al entrar en pantalla. Un solo observer
 * para toda la página. Con prefers-reduced-motion (o sin IntersectionObserver)
 * no se esconde nada: el contenido está visible desde el principio.
 * Los estilos (.reveal / .reveal--in) viven en global.scss.
 */
let observer: IntersectionObserver | null = null

function canAnimate(): boolean {
  return (
    typeof window !== 'undefined' &&
    'IntersectionObserver' in window &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function getObserver(): IntersectionObserver {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('reveal--in')
          observer?.unobserve(entry.target)
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    )
  }
  return observer
}

export const vReveal: ObjectDirective<HTMLElement, number | undefined> = {
  mounted(el, binding) {
    if (!canAnimate()) return
    el.classList.add('reveal')
    // El valor es el orden dentro de un grupo: escalona la entrada.
    if (binding.value) el.style.transitionDelay = `${Math.min(binding.value, 6) * 70}ms`
    getObserver().observe(el)
  },
  unmounted(el) {
    observer?.unobserve(el)
  },
}
