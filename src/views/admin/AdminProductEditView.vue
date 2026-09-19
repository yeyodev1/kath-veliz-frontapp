<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminState from '@/components/admin/AdminState.vue'
import ProductFormBasics from '@/components/admin/ProductFormBasics.vue'
import ProductFormSale from '@/components/admin/ProductFormSale.vue'
import ProductFormDetails from '@/components/admin/ProductFormDetails.vue'
import ProductContentPanel from '@/components/admin/ProductContentPanel.vue'
import { useProductForm } from '@/composables/admin/useProductForm'

const route = useRoute()
const router = useRouter()
const {
  form,
  productId,
  isNew,
  loading,
  error,
  saving,
  slugTouched,
  load,
  save,
  reset,
  onTitleInput,
} = useProductForm()

const hasContent = computed(() => !isNew.value && ['course', 'download'].includes(form.type))
const tab = computed(() =>
  route.query.tab === 'contenido' && hasContent.value ? 'contenido' : 'datos',
)

function setTab(next: 'datos' | 'contenido') {
  router.replace({ query: next === 'contenido' ? { tab: next } : {} })
}

// La misma vista sirve a /nuevo y a /:id. Al crear, el router pasa de una a
// otra sin desmontarla, por eso se escucha el parámetro.
watch(
  () => route.params.id,
  (id) => {
    if (typeof id === 'string' && id) load(id)
    else reset()
  },
  { immediate: true },
)
</script>

<template>
  <section class="adm-page">
    <AdminPageHeader
      :title="isNew ? 'Nuevo producto' : form.title || 'Editar producto'"
      back-to="/admin/productos"
      back-label="Productos"
    />

    <AdminState :loading="loading" :error="error" @retry="load(productId)">
      <nav v-if="hasContent" class="adm-tabs" aria-label="Secciones del producto">
        <button
          class="adm-tabs__tab"
          :class="{ 'adm-tabs__tab--active': tab === 'datos' }"
          @click="setTab('datos')"
        >
          Datos
        </button>
        <button
          class="adm-tabs__tab"
          :class="{ 'adm-tabs__tab--active': tab === 'contenido' }"
          @click="setTab('contenido')"
        >
          Módulos y lecciones
        </button>
      </nav>

      <ProductContentPanel v-if="tab === 'contenido'" :product-id="productId" />

      <form v-else class="product-edit" novalidate @submit.prevent="save">
        <ProductFormBasics
          :form="form"
          :is-new="isNew"
          @title-input="onTitleInput"
          @slug-input="slugTouched = true"
        />
        <ProductFormSale :form="form" />
        <ProductFormDetails :form="form" />

        <p v-if="isNew && ['course', 'download'].includes(form.type)" class="adm-muted">
          Después de guardar vas a poder agregar los módulos, las lecciones y los videos.
        </p>

        <!-- Pegada abajo: en el celular el botón de guardar siempre está a la vista -->
        <div class="product-edit__save">
          <button type="submit" class="btn btn--primary adm-btn-block" :disabled="saving">
            <i :class="saving ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-floppy-disk'"></i>
            {{ saving ? 'Guardando…' : isNew ? 'Crear producto' : 'Guardar cambios' }}
          </button>
        </div>
      </form>
    </AdminState>
  </section>
</template>

<style scoped lang="scss">
.product-edit {
  @include flex(column, stretch, flex-start, 1rem);

  &__save {
    position: sticky;
    bottom: 0;
    z-index: 2;
    padding: 0.75rem 0;
    background: linear-gradient(to top, $paper 70%, transparent);

    @include from('md') {
      align-self: flex-end;
      width: 280px;
    }
  }
}
</style>
