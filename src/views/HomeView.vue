<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { site } from '@/config/site'
import { useCatalog } from '@/composables/useCatalog'
import HomeHero from '@/components/home/HomeHero.vue'
import HomeAbout from '@/components/home/HomeAbout.vue'
import HomeOfferings from '@/components/home/HomeOfferings.vue'
import HomeFreebies from '@/components/home/HomeFreebies.vue'
import HomeTestimonials from '@/components/home/HomeTestimonials.vue'
import HomeCommunity from '@/components/home/HomeCommunity.vue'

// Una sola llamada al catálogo: lo de pago va a "Servicios" y lo gratuito a
// "Recursos". Si el API falla, products queda vacío y HomeOfferings cae a site.ts.
const { products, loading, load } = useCatalog()

const paid = computed(() => products.value.filter((p) => p.type !== 'free'))
const free = computed(() => products.value.filter((p) => p.type === 'free'))
const hasTestimonials = site.home.testimonials.items.length > 0

onMounted(load)
</script>

<template>
  <div class="home">
    <HomeHero />
    <HomeAbout />
    <HomeOfferings :products="paid" :loading="loading" />
    <HomeFreebies v-if="free.length" :products="free" />
    <HomeTestimonials v-if="hasTestimonials" />
    <HomeCommunity />
  </div>
</template>
