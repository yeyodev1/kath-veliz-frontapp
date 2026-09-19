import { onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue'

/**
 * Barra fija de compra en móvil: aparece cuando el botón principal sale de la
 * pantalla. Mientras está visible le suma su alto al padding inferior del body,
 * para que no tape el final de la página.
 */
export function useBuyBar(target: Ref<HTMLElement | null>, bar: Ref<HTMLElement | null>) {
  const visible = ref(false)
  let observer: IntersectionObserver | null = null

  function observe(el: HTMLElement | null) {
    observer?.disconnect()
    visible.value = false
    if (!el || !('IntersectionObserver' in window)) return
    observer = new IntersectionObserver((entries) => {
      const entry = entries[entries.length - 1]
      if (entry) visible.value = !entry.isIntersecting
    })
    observer.observe(el)
  }

  function syncPadding() {
    // offsetHeight es 0 cuando la barra está oculta por CSS (escritorio).
    const height = visible.value ? (bar.value?.offsetHeight ?? 0) : 0
    document.body.style.paddingBottom = height ? `${height}px` : ''
  }

  onMounted(() => observe(target.value))
  watch(target, observe)
  watch([visible, bar], syncPadding, { flush: 'post' })

  onBeforeUnmount(() => {
    observer?.disconnect()
    document.body.style.paddingBottom = ''
  })

  return { visible }
}
