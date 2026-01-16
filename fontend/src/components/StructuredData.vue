<!-- components/StructuredData.vue -->
<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useI18n } from '../components/useI18n';

const { t } = useI18n();

interface StructuredDataProps {
    type: 'product' | 'website' | 'local_business' | 'webpage' | 'service' | 'article' | 'organization' | 'person' | 'itemlist' | 'howto' | 'faq';
    data?: any;
}

const props = defineProps<StructuredDataProps>();

const getStructuredData = () => {
    const baseUrl = "https://espacecameroun.com";

    switch (props.type) {
        case 'service':
            return {
                "@context": "https://schema.org",
                "@type": "Service",
                "name": t('structured_data.service_name'),
                "description": t('structured_data.service_description'),
                "provider": {
                    "@type": "Organization",
                    "name": t('structured_data.organization_name'),
                    "url": baseUrl
                },
                "areaServed": "CM",
                "serviceType": t('structured_data.service_type')
            };

        case 'webpage':
            return {
                "@context": "https://schema.org",
                "@type": "WebPage",
                "name": props.data?.name || t('structured_data.website_name'),
                "description": props.data?.description || t('structured_data.website_description'),
                "url": props.data?.url || baseUrl,
                "publisher": {
                    "@type": "Organization",
                    "name": t('structured_data.organization_name'),
                    "url": baseUrl
                }
            };

        case 'product':
            return {
                "@context": "https://schema.org",
                "@type": "Product",
                "name": props.data?.name || t('structured_data.default_product_name'),
                "description": props.data?.description || t('structured_data.default_product_description'),
                "image": props.data?.image || `${baseUrl}/images/default-product.jpg`,
                "sku": props.data?.id || "",
                "offers": {
                    "@type": "Offer",
                    "price": props.data?.price || 0,
                    "priceCurrency": "XAF",
                    "availability": props.data?.availability || "https://schema.org/InStock",
                    "seller": {
                        "@type": "Organization",
                        "name": t('structured_data.organization_name')
                    }
                }
            };

        case 'local_business':
            return {
                "@context": "https://schema.org",
                "@type": "LocalBusiness",
                "name": props.data?.name || t('structured_data.default_merchant_name'),
                "description": props.data?.description || t('structured_data.default_merchant_description'),
                "url": props.data?.url || baseUrl,
                "telephone": props.data?.telephone || "",
                "address": {
                    "@type": "PostalAddress",
                    "addressLocality": props.data?.city || t('structured_data.cameroon'),
                    "addressCountry": "CM"
                },
                "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": props.data?.latitude,
                    "longitude": props.data?.longitude
                },
                "priceRange": "$$",
                "openingHours": "Mo-Su"
            };

        case 'organization':
            return {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": t('structured_data.organization_name'),
                "description": t('structured_data.organization_description'),
                "url": baseUrl,
                "logo": `${baseUrl}/images/logo.png`,
                "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+237-696-428-651",
                    "contactType": "customer service",
                    "email": "espacecameroun@gmail.com",
                    "areaServed": "CM",
                    "availableLanguage": [t('structured_data.french'), t('structured_data.english')]
                },
                "sameAs": [
                    "https://www.facebook.com/espacecameroun",
                    "https://www.youtube.com/@espacecameroun",
                    "https://www.tiktok.com/@espace.cameroun"
                ]
            };

        case 'article':
            return {
                "@context": "https://schema.org",
                "@type": "Article",
                "headline": props.data?.title || t('structured_data.default_article_title'),
                "description": props.data?.description || t('structured_data.default_article_description'),
                "image": props.data?.image || `${baseUrl}/images/default-article.jpg`,
                "datePublished": props.data?.publishedDate || new Date().toISOString(),
                "dateModified": props.data?.modifiedDate || new Date().toISOString(),
                "author": {
                    "@type": "Organization",
                    "name": t('structured_data.organization_name')
                },
                "publisher": {
                    "@type": "Organization",
                    "name": t('structured_data.organization_name'),
                    "logo": {
                        "@type": "ImageObject",
                        "url": `${baseUrl}/images/logo.png`
                    }
                }
            };

        case 'person':
            return {
                "@context": "https://schema.org",
                "@type": "Person",
                "name": props.data?.name || t('structured_data.default_user_name'),
                "description": props.data?.description || t('structured_data.default_user_description'),
                "url": props.data?.url || baseUrl,
                "image": props.data?.image,
                "memberOf": {
                    "@type": "Organization",
                    "name": t('structured_data.organization_name')
                }
            };

        case 'itemlist':
            return {
                "@context": "https://schema.org",
                "@type": "ItemList",
                "name": props.data?.name || t('structured_data.default_product_list'),
                "description": props.data?.description || t('structured_data.default_product_catalog'),
                "url": props.data?.url || baseUrl,
                "numberOfItems": props.data?.itemCount || 0,
                "itemListElement": props.data?.items?.map((item: any, index: number) => ({
                    "@type": "ListItem",
                    "position": index + 1,
                    "item": {
                        "@type": "Product",
                        "name": item.name,
                        "description": item.description,
                        "url": item.url
                    }
                })) || []
            };

        case 'howto':
            return {
                "@context": "https://schema.org",
                "@type": "HowTo",
                "name": props.data?.name || t('structured_data.default_guide_title'),
                "description": props.data?.description || t('structured_data.default_guide_description'),
                "totalTime": props.data?.duration || "PT10M",
                "step": props.data?.steps?.map((step: any, index: number) => ({
                    "@type": "HowToStep",
                    "position": index + 1,
                    "name": step.name,
                    "text": step.description,
                    "image": step.image
                })) || []
            };

        case 'faq':
            return {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": props.data?.questions?.map((faq: any) => ({
                    "@type": "Question",
                    "name": faq.question,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": faq.answer
                    }
                })) || []
            };

        case 'website':
        default:
            return {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": t('structured_data.website_name'),
                "description": t('structured_data.website_description'),
                "url": baseUrl,
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": {
                        "@type": "EntryPoint",
                        "urlTemplate": `${baseUrl}/search?q={search_term_string}`
                    },
                    "query-input": "required name=search_term_string"
                }
            };
    }
};

const injectStructuredData = () => {
    // Supprimer l'ancien script s'il existe
    const existingScript = document.getElementById('structured-data');
    if (existingScript) {
        existingScript.remove();
    }

    const data = getStructuredData();
    if (Object.keys(data).length === 0) return;

    // Créer et injecter le nouveau script
    const script = document.createElement('script');
    script.id = 'structured-data';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data, null, 2);
    document.head.appendChild(script);
};

// Injecter au montage et quand les props changent
onMounted(() => {
    injectStructuredData();
});

watch(() => props, () => {
    injectStructuredData();
}, { deep: true });
</script>

<template>
    <!-- Ce composant ne rend rien visuellement -->
    <!-- Les données structurées sont injectées directement dans le head -->
</template>