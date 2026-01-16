<!-- components/SeoHead.vue -->
<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useI18n } from '../components/useI18n';
import { computed } from 'vue';

const { t } = useI18n();

interface SeoMeta {
    title: string;
    description: string;
    keywords?: string;
    image?: string | null;
    url?: string;
    type?: string;
}

const props = defineProps<SeoMeta>();

const siteName = t('espace_cameroun');
const baseUrl = "https://espacecameroun.com";

// Mots-clés par défaut basés sur la langue
const defaultKeywords = computed(() => {
    return props.keywords || t('default_seo_keywords');
});

// Image par défaut basée sur la langue
const defaultImage = computed(() => {
    return props.image || `${baseUrl}/images/og-image-${t('current_language_code')}.jpg`;
});

// URL canonique
const canonicalUrl = computed(() => {
    return props.url || baseUrl;
});

useHead({
    title: props.title,
    meta: [
        { name: 'description', content: props.description },
        { name: 'keywords', content: defaultKeywords.value },
        { property: 'og:title', content: props.title },
        { property: 'og:description', content: props.description },
        { property: 'og:image', content: defaultImage.value },
        { property: 'og:url', content: canonicalUrl.value },
        { property: 'og:type', content: props.type || 'website' },
        { property: 'og:site_name', content: siteName },
        { property: 'og:locale', content: t('og_locale') },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: props.title },
        { name: 'twitter:description', content: props.description },
        { name: 'twitter:image', content: defaultImage.value },
        { name: 'robots', content: 'index, follow' },
        { name: 'author', content: siteName },
        // Remove the meta tags with hreflang - they don't belong here
    ],
    link: [
        { rel: 'canonical', href: canonicalUrl.value },
        // Links pour les langues alternatives - CORRECT: hreflang belongs here
        { rel: 'alternate', href: `${baseUrl}?lang=fr`, hreflang: 'fr' },
        { rel: 'alternate', href: `${baseUrl}?lang=en`, hreflang: 'en' },
        { rel: 'alternate', href: baseUrl, hreflang: 'x-default' },
    ],
    htmlAttrs: {
        lang: t('current_language_code')
    }
})
</script>

<template>
    <!-- Ce composant ne rend rien visuellement -->
</template>