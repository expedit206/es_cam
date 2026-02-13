<template>
  <div class="min-h-screen bg-gray-50 pb-12">
    <!-- Header Hero Section -->
    <div
      class="bg-[var(--espace-vert)] text-white pt-12 pb-24 relative overflow-hidden"
    >
      <!-- Decorative circles -->
      <div
        class="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"
      ></div>
      <div
        class="absolute bottom-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"
      ></div>

      <div class="max-w-4xl mx-auto px-4 text-center relative z-10">
        <h1 class="text-3xl md:text-5xl font-bold mb-6">
          Comment pouvons-nous vous aider ?
        </h1>
        <p class="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto">
          Trouvez des réponses rapides à vos questions sur l'achat, la vente et
          la sécurité sur Espace Cameroun.
        </p>

        <!-- Search Bar -->
        <div class="relative max-w-2xl mx-auto">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher une question (ex: comment vendre ?)"
            class="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 shadow-xl focus:ring-4 focus:ring-yellow-400/50 outline-none transition-all placeholder-gray-400"
          />
          <i
            class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl"
          ></i>
        </div>
      </div>
    </div>

    <!-- Main Content Container -->
    <div class="max-w-7xl mx-auto px-4 -mt-12 relative z-20">
      <!-- Quick Categories Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div
          v-for="(cat, index) in helpCategories"
          :key="index"
          class="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 group cursor-pointer text-center md:text-left"
        >
          <div
            class="w-14 h-14 rounded-full bg-emerald-50 text-[var(--espace-vert)] flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform mx-auto md:mx-0"
          >
            <i :class="cat.icon"></i>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-3">{{ cat.title }}</h3>
          <p class="text-gray-500 text-sm mb-4 leading-relaxed">
            {{ cat.description }}
          </p>
          <span
            class="text-[var(--espace-vert)] font-semibold text-sm flex items-center justify-center md:justify-start gap-2 group-hover:gap-3 transition-all"
          >
            En savoir plus <i class="fas fa-arrow-right"></i>
          </span>
        </div>
      </div>

      <!-- FAQ Accordion Section -->
      <div class="grid md:grid-cols-12 gap-12">
        <!-- Sidebar Navigation (Desktop) -->
        <div class="hidden md:block md:col-span-4 lg:col-span-3">
          <div
            class="sticky top-24 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div
              class="p-4 bg-gray-50 border-b border-gray-100 font-bold text-gray-800"
            >
              Sujets Populaires
            </div>
            <nav class="p-2 space-y-1">
              <button
                v-for="(section, id) in faqSections"
                :key="id"
                @click="activeSection = id"
                class="w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-between"
                :class="
                  activeSection === id
                    ? 'bg-emerald-50 text-[var(--espace-vert)]'
                    : 'text-gray-600 hover:bg-gray-50'
                "
              >
                {{ section.title }}
                <i
                  v-if="activeSection === id"
                  class="fas fa-chevron-right text-xs"
                ></i>
              </button>
            </nav>
          </div>
        </div>

        <!-- Questions Content -->
        <div class="md:col-span-8 lg:col-span-9">
          <h2
            class="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3"
          >
            <i
              :class="faqSections[activeSection].icon"
              class="text-[var(--espace-vert)]"
            ></i>
            {{ faqSections[activeSection].title }}
          </h2>

          <div class="space-y-4">
            <div
              v-for="(qa, index) in filteredFaqs"
              :key="index"
              class="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300"
              :class="
                openedFaq === index
                  ? 'shadow-md border-[var(--espace-vert)]/30 ring-1 ring-[var(--espace-vert)]/30'
                  : 'hover:border-gray-300'
              "
            >
              <button
                @click="toggleFaq(index)"
                class="w-full px-6 py-5 text-left flex justify-between items-center gap-4 focus:outline-none"
              >
                <span class="font-semibold text-gray-900 text-lg">{{
                  qa.question
                }}</span>
                <span
                  class="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center shrink-0 transition-transform duration-300"
                  :class="
                    openedFaq === index
                      ? 'rotate-180 bg-gray-100 text-[var(--espace-vert)]'
                      : 'bg-white text-gray-400'
                  "
                >
                  <i class="fas fa-chevron-down text-sm"></i>
                </span>
              </button>

              <div
                v-show="openedFaq === index"
                class="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-100 pt-4 bg-gray-50/50"
              >
                {{ qa.answer }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact CTA -->
      <div
        class="mt-20 bg-emerald-900 rounded-3xl p-8 md:p-12 text-center md:text-left relative overflow-hidden"
      >
        <div
          class="absolute top-0 right-0 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl -mr-16 -mt-16"
        ></div>

        <div
          class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div>
            <h3 class="text-2xl md:text-3xl font-bold text-white mb-3">
              Vous ne trouvez pas votre réponse ?
            </h3>
            <p class="text-emerald-100/80 max-w-xl">
              Notre équipe de support est disponible 24/7 pour vous aider à
              résoudre le moindre problème.
            </p>
          </div>
          <div class="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <RouterLink
              to="/contact"
              class="bg-yellow-400 text-emerald-950 px-8 py-3 rounded-xl font-bold hover:bg-yellow-300 transition-colors shadow-lg shadow-yellow-400/20 text-center"
            >
              Contactez-nous
            </RouterLink>
            <a
              href="mailto:support@espacecameroun.com"
              class="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-3 rounded-xl font-bold hover:bg-white/20 transition-colors text-center"
            >
              Email Support
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const searchQuery = ref("");
const activeSection = ref("general");
const openedFaq = ref<number | null>(0);

const helpCategories = [
  {
    icon: "fas fa-user-shield",
    title: "Compte & Sécurité",
    description:
      "Gérer votre profil, changer de mot de passe et sécuriser vos transactions.",
  },
  {
    icon: "fas fa-shopping-bag",
    title: "Acheter",
    description:
      "Comment passer commande, contacter un vendeur et suivre vos achats.",
  },
  {
    icon: "fas fa-store",
    title: "Vendre",
    description:
      "Créer une boutique, publier vos annonces et booster votre visibilité.",
  },
];

const faqSections: Record<string, any> = {
  general: {
    title: "Questions Générales",
    icon: "fas fa-info-circle",
    questions: [
      {
        question: "C'est quoi Espace Cameroun ?",
        answer:
          "Espace Cameroun est la première plateforme de marketplace locale qui connecte directement les acheteurs et les vendeurs camerounais sans intermédiaire. Nous facilitons le commerce de proximité.",
      },
      {
        question: "Est-ce que l'inscription est payante ?",
        answer:
          "Non, l'inscription est 100% gratuite pour tous les utilisateurs, acheteurs comme vendeurs.",
      },
      {
        question: "Comment télécharger l'application ?",
        answer:
          "Nous sommes actuellement disponibles en version Web optimisée pour mobile (PWA). Vous pouvez l'ajouter à votre écran d'accueil depuis votre navigateur.",
      },
    ],
  },
  compte: {
    title: "Mon Compte",
    icon: "fas fa-user-cog",
    questions: [
      {
        question: "Comment récupérer mon mot de passe ?",
        answer:
          "Cliquez sur 'Mot de passe oublié' lors de la connexion. Nous vous enverrons un lien de réinitialisation par email.",
      },
    ],
  },
  vente: {
    title: "Vente & Boutique",
    icon: "fas fa-tag",
    questions: [
      {
        question: "Combien d'annonces puis-je publier ?",
        answer:
          "En tant que particulier, vous pouvez publier jusqu'à 30 annonces gratuites par mois. Les comptes Pro ont des limites plus élevées.",
      },
    ],
  },
};

const toggleFaq = (index: number) => {
  openedFaq.value = openedFaq.value === index ? null : index;
};

const filteredFaqs = computed(() => {
  return faqSections[activeSection.value].questions;
});
</script>
