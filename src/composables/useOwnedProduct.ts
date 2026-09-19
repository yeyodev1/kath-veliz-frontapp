import { onMounted, ref } from 'vue'
import { studentService } from '@/services/student.service'
import { useUserStore } from '@/stores/user'

/**
 * ¿La persona ya tiene acceso vigente a este producto? Solo se pregunta si hay
 * sesión guardada. Si el API falla se asume que no: lo peor que pasa es que vea
 * "Comprar", y el checkout igual le avisa que ya lo tiene.
 */
export function useOwnedProduct(slug: string) {
  const userStore = useUserStore()
  const owned = ref(false)

  onMounted(async () => {
    if (!userStore.hasToken) return
    try {
      const items = await studentService.myProducts()
      owned.value = items.some(
        (item) => item.product.slug === slug && item.access.status === 'vigente',
      )
    } catch {
      owned.value = false
    }
  })

  return { owned }
}
