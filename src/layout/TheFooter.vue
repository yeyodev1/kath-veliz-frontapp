<script setup lang="ts">
import { site, whatsappLink } from '@/config/site'
import LeadForm from '@/components/ui/LeadForm.vue'

const year = new Date().getFullYear()
const copy = site.footer

const socials = [
  { label: 'Instagram', href: site.social.instagram, icon: 'fa-brands fa-instagram' },
  { label: 'TikTok', href: site.social.tiktok, icon: 'fa-brands fa-tiktok' },
  { label: copy.community, href: site.social.community, icon: 'fa-brands fa-whatsapp' },
]
</script>

<template>
  <footer class="footer">
    <div class="footer__inner">
      <div class="footer__brand">
        <img :src="site.logo.full" :alt="site.logo.alt" class="footer__logo" loading="lazy" />
        <p class="footer__tagline">{{ copy.text }}</p>
        <ul class="footer__social">
          <li v-for="social in socials" :key="social.label">
            <a :href="social.href" target="_blank" rel="noopener" :aria-label="social.label">
              <i :class="social.icon" aria-hidden="true"></i>
            </a>
          </li>
        </ul>
      </div>

      <nav class="footer__col" :aria-label="copy.explore">
        <h2 class="footer__heading">{{ copy.explore }}</h2>
        <RouterLink v-for="link in site.nav" :key="link.to" :to="link.to">{{ link.label }}</RouterLink>
        <a v-if="site.whatsapp" :href="whatsappLink()" target="_blank" rel="noopener">WhatsApp</a>
        <a v-if="site.email" :href="`mailto:${site.email}`">{{ site.email }}</a>
      </nav>

      <div class="footer__news">
        <h2 class="footer__news-title">{{ copy.newsletter.title }}</h2>
        <p class="footer__news-text">{{ copy.newsletter.text }}</p>
        <LeadForm
          kind="newsletter"
          source="footer"
          :ask-name="false"
          :cta="copy.newsletter.cta"
          :success="copy.newsletter.success"
          id-prefix="footer-news"
          inline
          on-dark
        />
      </div>
    </div>

    <div class="footer__bar">
      <span>© {{ year }} {{ site.name }}. {{ copy.rights }}</span>
      <span>{{ copy.disclaimer }}</span>
      <span class="footer__credit">
        Hecho por <a href="https://bakano.ec" target="_blank" rel="noopener">Bakano</a>
      </span>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  background: $accent-deep;
  color: rgba($paper, 0.86);
  margin-top: auto;

  &__inner {
    @include container;
    @include flex-cards(240px, 2.5rem);
    padding-block: $space-xl 2.5rem;
  }

  &__brand {
    flex: 1.4 1 260px;
  }

  &__logo {
    height: 64px;
    width: auto;
    // El logo es verde sobre transparente: esto lo deja en crema sobre el fondo oscuro.
    filter: brightness(0) invert(0.93) sepia(0.12);
    margin-bottom: 1rem;
  }

  &__tagline {
    font-family: $font-display;
    font-style: italic;
    font-size: $text-xl;
    line-height: 1.2;
    color: $paper;
    max-width: 22ch;
  }

  &__social {
    @include flex(row, center, flex-start, 0.6rem);
    list-style: none;
    margin-top: 1.4rem;

    a {
      @include flex(row, center, center);
      width: 2.75rem;
      height: 2.75rem;
      border: 1px solid rgba($paper, 0.3);
      border-radius: 50%;
      font-size: 1.05rem;
      @include transition;
      @include focus-ring($butter);

      &:hover {
        background: $paper;
        color: $accent-deep;
      }
    }
  }

  &__col {
    @include flex(column, flex-start, flex-start, 0.2rem);
    flex: 0.6 1 160px;
    font-size: $text-sm;

    a {
      padding: 0.35rem 0;
      color: rgba($paper, 0.86);
      @include transition(color);
      @include focus-ring($butter);

      &:hover {
        color: $butter;
      }
    }
  }

  &__heading {
    @include eyebrow;
    color: $butter;
    margin-bottom: 0.6rem;
  }

  &__news {
    flex: 1.6 1 280px;
  }

  &__news-title {
    @include display($text-xl, 600);
    color: $paper;
    margin-bottom: 0.4rem;
  }

  &__news-text {
    font-size: $text-sm;
    margin-bottom: 1.1rem;
  }

  &__bar {
    @include container;
    @include flex(row, center, space-between, 0.6rem 1.5rem);
    flex-wrap: wrap;
    padding-block: 1.3rem;
    border-top: 1px solid rgba($paper, 0.14);
    font-size: $text-xs;
    color: rgba($paper, 0.72);
  }

  &__credit a {
    color: $paper;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
}
</style>
