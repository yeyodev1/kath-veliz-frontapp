<script setup lang="ts">
import { onMounted, ref } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminState from '@/components/admin/AdminState.vue'
import ProductRow from '@/components/admin/ProductRow.vue'
import { adminProductsService } from '@/services/adminProducts.service'
import { useConfirm } from '@/composables/admin/useConfirm'
import { useProductOptions } from '@/composables/admin/useProductOptions'
import { useToastStore } from '@/stores/toast'
import { adminCopy } from '@/config/admin'
import type { ApiError } from '@/types'
import type { AdminProduct } from '@/types/admin'

const copy = adminCopy.products
const toast = useToastStore()
const confirm = useConfirm()
const { load: refreshOptions } = useProductOptions()

const products = ref<AdminProduct[]>([])
const loading = ref(true)
const error = ref('')

async function load() {
  loading.value = true
  error.value = ''
  try {
    const list = await adminProductsService.list()
    products.value = [...list].sort((a, b) => (a.order || 0) - (b.order || 0))
  } catch (err) {
    error.value = (err as ApiError).message || adminCopy.genericError
  } finally {
    loading.value = false
  }
}

async function togglePublish(product: AdminProduct) {
  try {
    const next = !product.isPublished
    await adminProductsService.updateProduct(product.id, { isPublished: next })
    product.isPublished = next
    toast.success(next ? 'Producto publicado: ya se ve en la web.' : 'Producto despublicado: ya no se ve en la web.')
  } catch (err) {
    toast.error((err as ApiError).message || adminCopy.genericError)
  }
}

function askDelete(product: AdminProduct) {
  confirm.ask(
    { title: copy.deleteTitle, message: `${product.title}. ${copy.deleteMessage}`, confirmLabel: 'Sí, borrar', danger: true },
    async () => {
      await adminProductsService.deleteProduct(product.id)
      toast.success('Producto borrado.')
      await load()
      // Los selectores de otras pantallas no deben ofrecer un producto que ya no existe.
      refreshOptions(true)
    },
  )
}

onMounted(load)
</script>

<template>
  <section class="adm-page">
    <AdminPageHeader :title="copy.title" :subtitle="copy.subtitle">
      <RouterLink :to="{ name: 'AdminProductNew' }" class="btn btn--primary">
        <i class="fa-solid fa-plus"></i>
        {{ copy.create }}
      </RouterLink>
    </AdminPageHeader>

    <AdminState
      :loading="loading"
      :error="error"
      :empty="!products.length"
      :empty-text="copy.empty"
      empty-icon="fa-solid fa-box-open"
      @retry="load"
    >
      <div class="adm-list">
        <ProductRow
          v-for="product in products"
          :key="product.id"
          :product="product"
          @toggle-publish="togglePublish(product)"
          @remove="askDelete(product)"
        />
      </div>
    </AdminState>

    <BaseModal v-bind="confirm.modal" @confirm="confirm.accept" @cancel="confirm.cancel" />
  </section>
</template>
