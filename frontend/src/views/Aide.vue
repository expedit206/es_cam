<template>
  <div class="min-h-screen bg-gray-50">
    <!-- HEADER - Compact & impactant -->
    <div
      class="bg-[var(--espace-vert)] text-white pt-12 pb-16 md:pt-16 md:pb-20 relative overflow-hidden"
    >
      <!-- Éléments décoratifs subtils -->
      <div
        class="absolute inset-0 opacity-10"
        style="
          background-image: radial-gradient(
            circle at 2px 2px,
            white 1px,
            transparent 1px
          );
          background-size: 24px 24px;
        "
      ></div>
      <div
        class="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"
      ></div>
      <div
        class="absolute bottom-0 right-0 w-64 h-64 bg-yellow-400/10 rounded-full translate-x-1/3 translate-y-1/3 blur-2xl"
      ></div>

      <div class="max-w-4xl mx-auto px-4 relative z-10">
        <!-- Label catégorie -->
        <div class="flex justify-center mb-4">
          <span
            class="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20"
          >
            <span class="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
            <span class="text-[11px] font-semibold uppercase tracking-wider"
              >Support & Assistance</span
            >
          </span>
        </div>

        <h1
          class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-3 leading-tight"
        >
          Besoin d'aide ?<br class="hidden sm:block" />
          <span class="relative inline-block">
            <span class="relative z-10">On est là pour vous</span>
            <span
              class="absolute bottom-1 left-0 w-full h-2 bg-yellow-400/30 -z-0"
            ></span>
          </span>
        </h1>

        <p class="text-emerald-100 text-sm sm:text-base max-w-2xl mx-auto mb-6">
          <span class="font-bold text-white">Chat en direct</span> avec nos
          équipes • Réponse moyenne
          <span class="font-bold text-white">3 minutes</span>
        </p>

        <!-- BOUTONS CHAT - Au lieu de la recherche -->
        <div
          class="flex flex-col sm:flex-row gap-3 justify-center max-w-lg mx-auto"
        >
          <a
            href="#chat-client"
            class="flex-1 inline-flex items-center justify-center gap-2 bg-yellow-400 text-gray-900 text-sm px-4 py-3 rounded-xl font-bold hover:bg-yellow-300 transition-all shadow-lg shadow-yellow-400/20"
          >
            <i class="fas fa-comment-dots"></i>
            Chat service client
          </a>
          <a
            href="#chat-commercant"
            class="flex-1 inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm px-4 py-3 rounded-xl font-bold hover:bg-white/20 transition-all"
          >
            <i class="fas fa-store"></i>
            Espace commerçant
          </a>
        </div>

        <!-- Tags d'aide rapide -->
        <div class="flex flex-wrap items-center justify-center gap-2 mt-6">
          <span class="text-[9px] text-emerald-200/80">Aide rapide :</span>
          <button
            class="text-[9px] bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-full text-white border border-white/20 transition-colors"
          >
            Comment vendre ?
          </button>
          <button
            class="text-[9px] bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-full text-white border border-white/20 transition-colors"
          >
            Mot de passe oublié
          </button>
          <button
            class="text-[9px] bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-full text-white border border-white/20 transition-colors"
          >
            Contacter un vendeur
          </button>
        </div>
      </div>
    </div>

    <!-- CONTENU PRINCIPAL -->
    <div class="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
      <!-- CHAT MISE EN AVANT - Section hero -->
      <div
        class="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-2xl p-5 mb-8 shadow-lg"
      >
        <div
          class="flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center"
            >
              <i class="fas fa-comments text-white text-xl"></i>
            </div>
            <div>
              <h3 class="text-white font-bold text-sm">Chat en ligne 24/7</h3>
              <p class="text-emerald-100 text-[10px] max-w-md">
                Discutez directement avec nos conseillers, les commerçants ou
                les acheteurs.
              </p>
            </div>
          </div>
          <div class="flex gap-2 w-full sm:w-auto">
            <span
              class="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full"
            >
              <span
                class="w-2 h-2 bg-green-400 rounded-full animate-pulse"
              ></span>
              <span class="text-white text-[9px]">5 conseillers en ligne</span>
            </span>
          </div>
        </div>
      </div>

      <!-- 3 CATÉGORIES DE CHAT -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
        <!-- Chat Client -->
        <div
          class="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 group cursor-pointer"
        >
          <div class="flex items-start gap-3">
            <div
              class="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-base group-hover:scale-110 transition-transform shrink-0"
            >
              <i class="fas fa-user-headset"></i>
            </div>
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-bold text-gray-900">Service client</h3>
                <span
                  class="text-[8px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full"
                  >En ligne</span
                >
              </div>
              <p class="text-[9px] text-gray-500 mt-0.5 mb-2">
                Questions, factures, réclamations
              </p>
              <div class="flex items-center justify-between">
                <span class="text-[8px] text-gray-400">⏱️ 2min réponse</span>
                <a
                  href="#chat"
                  class="text-[9px] text-blue-600 font-semibold inline-flex items-center gap-1"
                >
                  Ouvrir le chat <i class="fas fa-arrow-right text-[7px]"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Commerçant -->
        <div
          class="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 group cursor-pointer"
        >
          <div class="flex items-start gap-3">
            <div
              class="w-10 h-10 rounded-lg bg-emerald-50 text-[var(--espace-vert)] flex items-center justify-center text-base group-hover:scale-110 transition-transform shrink-0"
            >
              <i class="fas fa-store"></i>
            </div>
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-bold text-gray-900">
                  Support commerçant
                </h3>
                <span
                  class="text-[8px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full"
                  >En ligne</span
                >
              </div>
              <p class="text-[9px] text-gray-500 mt-0.5 mb-2">
                Annonces, boutique, visibilité
              </p>
              <div class="flex items-center justify-between">
                <span class="text-[8px] text-gray-400">⏱️ 5min réponse</span>
                <a
                  href="#chat"
                  class="text-[9px] text-[var(--espace-vert)] font-semibold inline-flex items-center gap-1"
                >
                  Ouvrir le chat <i class="fas fa-arrow-right text-[7px]"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Acheteur/Vendeur -->
        <div
          class="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 group cursor-pointer"
        >
          <div class="flex items-start gap-3">
            <div
              class="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-base group-hover:scale-110 transition-transform shrink-0"
            >
              <i class="fas fa-handshake"></i>
            </div>
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-bold text-gray-900">
                  Chat acheteur → vendeur
                </h3>
                <span
                  class="text-[8px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full"
                  >Actif</span
                >
              </div>
              <p class="text-[9px] text-gray-500 mt-0.5 mb-2">
                Discutez directement avec les commerçants
              </p>
              <div class="flex items-center justify-between">
                <span class="text-[8px] text-gray-400">🔵 47 en ligne</span>
                <a
                  href="#chat"
                  class="text-[9px] text-purple-600 font-semibold inline-flex items-center gap-1"
                >
                  Voir mes conversations
                  <i class="fas fa-arrow-right text-[7px]"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- FAQ ACCORDÉON - Compacte -->
      <div
        class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-8"
      >
        <div class="flex items-center gap-2 mb-4">
          <div
            class="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center"
          >
            <i
              class="fas fa-question text-[10px] text-[var(--espace-vert)]"
            ></i>
          </div>
          <h2 class="text-sm font-black text-gray-900">Questions fréquentes</h2>
          <span class="text-[8px] bg-gray-100 px-2 py-0.5 rounded-full ml-auto"
            >12 réponses</span
          >
        </div>

        <div class="space-y-2">
          <div
            v-for="(faq, idx) in faqList"
            :key="idx"
            class="border border-gray-100 rounded-lg overflow-hidden"
          >
            <button
              @click="toggleFaq(idx)"
              class="w-full px-3 py-2.5 text-left flex justify-between items-center"
            >
              <span class="text-[11px] font-medium text-gray-800">{{
                faq.q
              }}</span>
              <span
                class="w-5 h-5 rounded-full bg-gray-50 flex items-center justify-center"
              >
                <i
                  class="fas fa-chevron-down text-[8px]"
                  :class="openedFaq === idx ? 'rotate-180' : ''"
                ></i>
              </span>
            </button>
            <div
              v-show="openedFaq === idx"
              class="px-3 pb-2.5 text-[10px] text-gray-600 bg-gray-50/50 border-t border-gray-100"
            >
              {{ faq.a }}
            </div>
          </div>
        </div>

        <div class="mt-3 text-center">
          <a
            href="#chat"
            class="text-[9px] text-[var(--espace-vert)] font-semibold inline-flex items-center gap-1"
          >
            Pas trouvé ? Discuter avec nous
            <i class="fas fa-comment-dots text-[8px]"></i>
          </a>
        </div>
      </div>

      <!-- STATS CHAT & SUPPORT -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        <div class="bg-white p-3 rounded-lg border border-gray-100 text-center">
          <span class="text-base font-black text-[var(--espace-vert)]">15</span>
          <span class="block text-[7px] uppercase text-gray-500"
            >Conseillers</span
          >
        </div>
        <div class="bg-white p-3 rounded-lg border border-gray-100 text-center">
          <span class="text-base font-black text-[var(--espace-vert)]"
            >3min</span
          >
          <span class="block text-[7px] uppercase text-gray-500"
            >Réponse moy.</span
          >
        </div>
        <div class="bg-white p-3 rounded-lg border border-gray-100 text-center">
          <span class="text-base font-black text-[var(--espace-vert)]"
            >24/7</span
          >
          <span class="block text-[7px] uppercase text-gray-500"
            >Disponible</span
          >
        </div>
        <div class="bg-white p-3 rounded-lg border border-gray-100 text-center">
          <span class="text-base font-black text-[var(--espace-vert)]"
            >98%</span
          >
          <span class="block text-[7px] uppercase text-gray-500"
            >Satisfait</span
          >
        </div>
      </div>

      <!-- CHAT BANNIÈRE FINALE -->
      <div
        class="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-5 text-white mb-6"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center"
          >
            <i class="fas fa-comment-dots text-gray-900 text-sm"></i>
          </div>
          <div class="flex-1">
            <h4 class="text-sm font-bold mb-0.5">
              Une question ? Un problème ?
            </h4>
            <p class="text-[9px] text-gray-300">
              Nos équipes sont en ligne et prêtes à vous répondre.
            </p>
          </div>
          <a
            href="#chat"
            class="bg-yellow-500 text-gray-900 text-[10px] px-3 py-2 rounded-lg font-bold whitespace-nowrap"
          >
            Ouvrir le chat
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const openedFaq = ref(0);

const faqList = [
  {
    q: "Comment contacter un vendeur ?",
    a: "Rendez-vous sur la fiche du produit, cliquez sur 'Contacter le vendeur'. Le chat s'ouvrira directement avec le commerçant.",
  },
  {
    q: "Le chat est-il gratuit ?",
    a: "Oui, 100% gratuit. Vous pouvez échanger avec tous les vendeurs et avec notre service client sans aucun frais.",
  },
  {
    q: "Comment parler au service client ?",
    a: "Cliquez sur l'icône chat en bas à droite de l'application, sélectionnez 'Service client' et posez votre question.",
  },
  {
    q: "Les commerçants répondent vite ?",
    a: "La plupart répondent en moins de 10 minutes. Vous voyez quand ils sont en ligne (point vert).",
  },
  {
    q: "Puis-je envoyer des photos dans le chat ?",
    a: "Oui, le chat accepte les images. Pratique pour montrer un produit ou un problème.",
  },
];

const toggleFaq = (index) => {
  openedFaq.value = openedFaq.value === index ? null : index;
};
</script>
