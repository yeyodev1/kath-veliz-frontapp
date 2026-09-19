<script setup lang="ts">
import { site, whatsappLink } from '@/config/site'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { vReveal } from '@/composables/useReveal'

const copy = site.home.community
</script>

<template>
  <section id="contacto" class="community">
    <div v-reveal class="community__inner">
      <SectionHeading
        :eyebrow="copy.eyebrow"
        :title="copy.title"
        :text="copy.text"
        align="center"
      />

      <BaseButton :href="site.social.community" icon="fa-brands fa-whatsapp">{{
        copy.cta
      }}</BaseButton>

      <div class="community__follow">
        <p>{{ copy.follow }}</p>
        <div class="community__links">
          <a :href="site.social.instagram" target="_blank" rel="noopener">
            <i class="fa-brands fa-instagram" aria-hidden="true"></i> Instagram
          </a>
          <a :href="site.social.tiktok" target="_blank" rel="noopener">
            <i class="fa-brands fa-tiktok" aria-hidden="true"></i> TikTok
          </a>
          <a v-if="site.whatsapp" :href="whatsappLink()" target="_blank" rel="noopener">
            <i class="fa-regular fa-comment-dots" aria-hidden="true"></i> {{ copy.doubts }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.community {
  background: $clay-soft;

  &__inner {
    @include container(820px);
    @include flex(column, center, flex-start, 1.8rem);
    padding-block: $space-section;
    text-align: center;
  }

  &__follow {
    @include flex(column, center, flex-start, 0.8rem);
    width: 100%;
    margin-top: 1rem;
    padding-top: 1.8rem;
    border-top: 1px solid rgba($ink, 0.18);

    p {
      @include eyebrow;
    }
  }

  &__links {
    @include flex(row, center, center, 0.4rem 1.6rem);
    flex-wrap: wrap;

    a {
      @include flex(row, center, flex-start, 0.45rem);
      font-weight: 600;
      padding: 0.5rem 0;
      border-bottom: 1px solid transparent;
      @include transition;

      &:hover {
        color: $clay-deep;
        border-color: currentColor;
      }
    }
  }
}
</style>
