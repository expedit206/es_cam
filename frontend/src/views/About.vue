<template>
  <div class="min-h-screen bg-white">
    <!-- HERO - Vitrine du commerce camerounais -->
    <section
      class="relative pt-9 pb-6 md:pt-14 md:pb-10 border-b border-gray-100"
    >
      <!-- Pattern décoratif -->
      <div
        class="absolute inset-0 opacity-[0.02]"
        style="
          background-image: repeating-linear-gradient(
            45deg,
            #0b4f2e 0px,
            #0b4f2e 2px,
            transparent 2px,
            transparent 8px
          );
        "
      ></div>

      <div class="w-full max-w-7xl mx-auto px-4 relative">
        <div
          class="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-10 items-center"
        >
          <!-- BLOC GAUCHE -->
          <div class="space-y-4">
            <!-- Label identité -->
            <div class="flex items-center gap-2">
              <div class="flex -space-x-1.5">
                <div
                  class="w-5 h-5 bg-emerald-600 rounded-full border-2 border-white"
                ></div>
                <div
                  class="w-5 h-5 bg-yellow-500 rounded-full border-2 border-white"
                ></div>
                <div
                  class="w-5 h-5 bg-emerald-400 rounded-full border-2 border-white"
                ></div>
              </div>
              <span
                class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.25em]"
                >ANNUAIRE OFFICIEL</span
              >
            </div>

            <!-- Titre principal -->
            <h1
              class="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight"
            >
              <span class="relative inline-block">
                <span class="relative z-10">La vitrine</span>
                <span
                  class="absolute bottom-1 left-0 w-full h-3 bg-yellow-200/60 -z-0"
                ></span>
              </span>
              <span class="block text-gray-800">
                de tout commerce camerounais.
              </span>
            </h1>

            <!-- Sous-titre -->
            <p class="text-sm sm:text-sm text-gray-700 font-medium max-w-lg">
              <span
                class="bg-emerald-50 px-1.5 py-0.5 rounded text-[var(--espace-vert)]"
                >Espace Cameroun</span
              >
              donne une identité numérique à chaque commerçant. Visible dans 237
              localités, accessible sur tout téléphone.
            </p>

            <!-- Stats -->
            <div class="grid grid-cols-3 gap-2 pt-1">
              <div
                class="bg-gray-50 p-2 rounded-lg border-l-2 border-[var(--espace-vert)]"
              >
                <span class="text-sm font-black text-[var(--espace-vert)]"
                  >10K+</span
                >
                <span
                  class="block text-[8px] text-gray-500 uppercase tracking-wide"
                  >Commerces</span
                >
              </div>
              <div
                class="bg-gray-50 p-2 rounded-lg border-l-2 border-yellow-500"
              >
                <span class="text-sm font-black text-gray-900">237</span>
                <span
                  class="block text-[8px] text-gray-500 uppercase tracking-wide"
                  >Localités</span
                >
              </div>
              <div
                class="bg-gray-50 p-2 rounded-lg border-l-2 border-emerald-400"
              >
                <span class="text-sm font-black text-gray-900">47K+</span>
                <span
                  class="block text-[8px] text-gray-500 uppercase tracking-wide"
                  >Annonces</span
                >
              </div>
            </div>

            <!-- Contact WhatsApp - Sans numéro visible -->
            <div class="flex items-center gap-3 pt-2">
              <a
                href="https://wa.me/237678647742"
                target="_blank"
                class="inline-flex items-center gap-2 bg-[#25D366] text-white text-[10px] px-4 py-2 rounded-full font-bold hover:bg-[#20B859] transition-all shadow-md"
              >
                <i class="fab fa-whatsapp text-sm"></i>
                Écrire sur WhatsApp
                <span class="text-[8px] bg-white/20 px-1.5 py-0.5 rounded-full"
                  >BodyMac Labs</span
                >
              </a>
              <span class="text-[8px] text-gray-500"
                >Solutions web sur mesure</span
              >
            </div>
          </div>

          <!-- BLOC DROIT - Logo -->
          <div class="relative flex flex-col items-center md:items-end gap-3">
            <div class="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36">
              <div
                class="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-yellow-500/10 rounded-full blur-2xl"
              ></div>
              <div
                class="relative bg-white p-2 rounded-2xl shadow-xl border border-gray-100 rotate-1 hover:rotate-0 transition-transform duration-300"
              >
                <img
                  src="../assets/images/logo/LOGO_vert_all.png"
                  alt="Espace Cameroun"
                  class="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- PROBLÈME / SOLUTION - Invisibilité → Visibilité -->
    <section class="py-5 bg-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid grid-cols-2 gap-3">
          <!-- Avant -->
          <div class="bg-gray-50 rounded-lg p-3">
            <div class="flex items-center gap-1.5 mb-1.5">
              <span class="text-gray-400 text-[10px]"
                ><i class="fas fa-eye-slash"></i
              ></span>
              <span
                class="text-[9px] font-bold text-gray-600 uppercase tracking-wider"
                >SANS VITRINE</span
              >
            </div>
            <ul class="space-y-1">
              <li class="flex items-center gap-1.5 text-[9px] text-gray-600">
                <span class="text-gray-400">•</span> Visible seulement au
                quartier
              </li>
              <li class="flex items-center gap-1.5 text-[9px] text-gray-600">
                <span class="text-gray-400">•</span> Dépend du bouche-à-oreille
              </li>
            </ul>
          </div>
          <!-- Après -->
          <div class="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
            <div class="flex items-center gap-1.5 mb-1.5">
              <span class="text-[var(--espace-vert)] text-[10px]"
                ><i class="fas fa-eye"></i
              ></span>
              <span
                class="text-[9px] font-bold text-[var(--espace-vert)] uppercase tracking-wider"
                >AVEC ESPACE</span
              >
            </div>
            <ul class="space-y-1">
              <li class="flex items-center gap-1.5 text-[9px] text-gray-700">
                <span class="text-emerald-600">✓</span> Visible dans 237
                localités
              </li>
              <li class="flex items-center gap-1.5 text-[9px] text-gray-700">
                <span class="text-emerald-600">✓</span> Contact direct WhatsApp
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- CE QUE NOUS OFFRONS - Solutions concrètes -->
    <section class="py-6 bg-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center gap-2 mb-3">
          <span class="w-1.5 h-1.5 bg-[var(--espace-vert)] rounded-full"></span>
          <h2
            class="text-sm font-black text-gray-900 uppercase tracking-[0.2em]"
          >
            VITRINE NUMÉRIQUE
          </h2>
          <span class="w-1.5 h-1.5 bg-[var(--espace-vert)] rounded-full"></span>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div class="bg-white p-2.5 rounded-lg border border-gray-200">
            <span class="text-emerald-600 text-[14px] block mb-1">📋</span>
            <span class="text-[10px] font-black text-gray-900 block"
              >Catalogue produits</span
            >
            <span class="text-[8px] text-gray-600"
              >Photos, prix, description</span
            >
          </div>
          <div class="bg-white p-2.5 rounded-lg border border-gray-200">
            <span class="text-emerald-600 text-[14px] block mb-1">🔍</span>
            <span class="text-[10px] font-black text-gray-900 block"
              >Recherche par ville</span
            >
            <span class="text-[8px] text-gray-600"
              >Trouver un commerce près de chez soi</span
            >
          </div>
          <div class="bg-white p-2.5 rounded-lg border border-gray-200">
            <span class="text-emerald-600 text-[14px] block mb-1">📞</span>
            <span class="text-[10px] font-black text-gray-900 block"
              >Contact direct</span
            >
            <span class="text-[8px] text-gray-600"
              >Numéro WhatsApp affiché</span
            >
          </div>
          <div class="bg-white p-2.5 rounded-lg border border-gray-200">
            <span class="text-emerald-600 text-[14px] block mb-1">📍</span>
            <span class="text-[10px] font-black text-gray-900 block"
              >Géolocalisation</span
            >
            <span class="text-[8px] text-gray-600"
              >Savoir exactement où aller</span
            >
          </div>
        </div>
      </div>
    </section>

    <!-- 3 TÉMOIGNAGES - Preuve sociale -->
    <section class="py-6 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center justify-between mb-3">
          <h2
            class="text-sm font-black text-gray-900 uppercase tracking-[0.2em]"
          >
            ILS ONT UNE VITRINE
          </h2>
          <span
            class="text-[8px] bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full"
            >+850 commerces</span
          >
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <!-- Témoignage 1 - Douala -->
          <div class="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
            <div class="flex items-center gap-2 mb-2">
              <div
                class="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 text-sm font-bold"
              >
                AM
              </div>
              <div>
                <span class="text-[10px] font-bold text-gray-900 block"
                  >Amina M.</span
                >
                <span class="text-[7px] text-gray-500"
                  >Douala • Pagnes & Wax</span
                >
              </div>
            </div>
            <p class="text-[9px] text-gray-700 italic leading-relaxed">
              "Des clientes viennent de Yaoundé spécialement pour mes pagnes.
              Elles les ont vus sur Espace Cameroun. Je n'avais jamais eu cette
              visibilité avant."
            </p>
            <div class="flex items-center gap-1 mt-2">
              <span
                class="text-[8px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full"
                >+2 ans</span
              >
              <span class="text-[8px] text-gray-400">⭐ 4.9</span>
            </div>
          </div>

          <!-- Témoignage 2 - Bafoussam -->
          <div class="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
            <div class="flex items-center gap-2 mb-2">
              <div
                class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-700 text-sm font-bold"
              >
                JB
              </div>
              <div>
                <span class="text-[10px] font-bold text-gray-900 block"
                  >Jean B.</span
                >
                <span class="text-[7px] text-gray-500"
                  >Bafoussam • Menuiserie</span
                >
              </div>
            </div>
            <p class="text-[9px] text-gray-700 italic leading-relaxed">
              "Un client m'a contacté pour 20 chaises d'hôtel. Je n'ai même pas
              de boutique en centre-ville. Il m'a trouvé ici. Aujourd'hui je
              refuse du travail."
            </p>
            <div class="flex items-center gap-1 mt-2">
              <span
                class="text-[8px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full"
                >+150 commandes</span
              >
              <span class="text-[8px] text-gray-400">⭐ 4.8</span>
            </div>
          </div>

          <!-- Témoignage 3 - Ngaoundéré -->
          <div class="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
            <div class="flex items-center gap-2 mb-2">
              <div
                class="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 text-sm font-bold"
              >
                MH
              </div>
              <div>
                <span class="text-[10px] font-bold text-gray-900 block"
                  >Mamadou H.</span
                >
                <span class="text-[7px] text-gray-500"
                  >Ngaoundéré • Élevage</span
                >
              </div>
            </div>
            <p class="text-[9px] text-gray-700 italic leading-relaxed">
              "J'exporte maintenant mes volailles jusqu'à Douala et Yaoundé. Les
              acheteurs me font confiance parce qu'ils voient ma vitrine avant
              même de m'appeler."
            </p>
            <div class="flex items-center gap-1 mt-2">
              <span
                class="text-[8px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full"
                >+3 ans</span
              >
              <span class="text-[8px] text-gray-400">⭐ 5.0</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- BODYMAC LABS - Studio web -->
    <section
      class="py-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white"
    >
      <div class="max-w-7xl mx-auto px-4">
        <div
          class="flex flex-col md:flex-row items-start md:items-center gap-4"
        >
          <!-- Identité studio -->
          <div class="flex items-center gap-3 flex-1">
            <div
              class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg"
            >
              <span class="text-white text-xl font-black">B</span>
            </div>
            <div>
              <div class="flex items-center gap-2 mb-0.5">
                <h3 class="text-base font-black text-white">BodyMac Labs</h3>
                <span
                  class="bg-yellow-500/20 text-yellow-300 text-[7px] px-1.5 py-0.5 rounded-full border border-yellow-500/30"
                  >STUDIO</span
                >
              </div>
              <p class="text-[9px] text-gray-300">
                Solutions web sur mesure · Développement · Design · Conseil
              </p>
            </div>
          </div>

          <!-- Contact WhatsApp - Sans numéro -->
          <div class="flex items-center gap-2 w-full md:w-auto">
            <a
              href="https://wa.me/237678647742"
              target="_blank"
              class="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-[#25D366] text-white text-[10px] px-4 py-2.5 rounded-xl font-bold hover:bg-[#20B859] transition-all"
            >
              <i class="fab fa-whatsapp text-sm"></i>
              Discuter sur WhatsApp
            </a>
            <a
              href="https://github.com/mciagnessi"
              target="_blank"
              class="bg-white/10 text-white text-[10px] px-3 py-2.5 rounded-xl hover:bg-white/20 transition-colors"
            >
              <i class="fab fa-github"></i>
            </a>
          </div>
        </div>

        <!-- Expertises -->
        <div class="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-white/10">
          <span
            class="text-[7px] bg-white/5 px-2 py-1 rounded-full text-gray-300"
            >Sites vitrines</span
          >
          <span
            class="text-[7px] bg-white/5 px-2 py-1 rounded-full text-gray-300"
            >Applications web</span
          >
          <span
            class="text-[7px] bg-white/5 px-2 py-1 rounded-full text-gray-300"
            >Systèmes de gestion</span
          >
          <span
            class="text-[7px] bg-white/5 px-2 py-1 rounded-full text-gray-300"
            >API sur mesure</span
          >
          <span
            class="text-[7px] bg-white/5 px-2 py-1 rounded-full text-gray-300"
            >Maintenance</span
          >
          <span
            class="text-[7px] bg-white/5 px-2 py-1 rounded-full text-gray-300"
            >Conseil technique</span
          >
        </div>
      </div>
    </section>

    <!-- IMPACT NATIONAL -->
    <section class="py-6 bg-emerald-950 text-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-3">
          <span class="text-[20px] block mb-1">🇨🇲</span>
          <h3 class="text-sm font-black text-white uppercase tracking-[0.2em]">
            DÉPLOIEMENT NATIONAL
          </h3>
        </div>

        <div class="grid grid-cols-4 gap-2 text-center">
          <div>
            <span class="text-lg font-black text-yellow-400">10K+</span>
            <span
              class="block text-[7px] uppercase tracking-wider text-emerald-200/80"
              >Commerces</span
            >
          </div>
          <div>
            <span class="text-lg font-black text-yellow-400">47K+</span>
            <span
              class="block text-[7px] uppercase tracking-wider text-emerald-200/80"
              >Annonces</span
            >
          </div>
          <div>
            <span class="text-lg font-black text-yellow-400">237</span>
            <span
              class="block text-[7px] uppercase tracking-wider text-emerald-200/80"
              >Localités</span
            >
          </div>
          <div>
            <span class="text-lg font-black text-yellow-400">100%</span>
            <span
              class="block text-[7px] uppercase tracking-wider text-emerald-200/80"
              >Gratuit</span
            >
          </div>
        </div>
      </div>
    </section>

    <!-- CONTACT FINAL - BodyMac Labs / WhatsApp -->
    <section class="py-6 bg-white border-t border-gray-100">
      <div class="max-w-7xl mx-auto px-4">
        <div class="max-w-lg mx-auto text-center">
          <div class="flex justify-center mb-2">
            <div
              class="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center"
            >
              <span class="text-white text-xl font-black">B</span>
            </div>
          </div>

          <h4 class="text-sm font-black text-gray-900 mb-1">BodyMac Labs</h4>
          <p class="text-[9px] text-gray-600 mb-3">
            Vous avez un projet web ? Une idée d'application ? Une solution à
            développer ?
          </p>

          <div class="flex flex-col sm:flex-row gap-2 justify-center">
            <a
              href="https://wa.me/237678647742"
              target="_blank"
              class="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white text-[10px] px-5 py-3 rounded-full font-bold hover:bg-[#20B859] transition-all shadow-md"
            >
              <i class="fab fa-whatsapp text-sm"></i>
              Écrire à BodyMac Labs
            </a>
            <a
              href="https://github.com/mciagnessi"
              target="_blank"
              class="inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-800 text-[10px] px-5 py-3 rounded-full font-bold hover:bg-gray-200 transition-all"
            >
              <i class="fab fa-github"></i>
              GitHub
            </a>
          </div>

          <div class="flex items-center justify-center gap-2 mt-4">
            <span class="w-4 h-[1px] bg-gray-300"></span>
            <span class="text-[7px] font-mono text-gray-400 tracking-[0.2em]"
              >SOLUTIONS WEB SUR MESURE</span
            >
            <span class="w-4 h-[1px] bg-gray-300"></span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Ultra compact - aucun espace perdu */
@media (max-width: 640px) {
  .py-9 {
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
  }
  .py-6 {
    padding-top: 1.25rem;
    padding-bottom: 1.25rem;
  }
  .py-5 {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
  .gap-2 {
    gap: 0.4rem;
  }
  .p-2 {
    padding: 0.4rem;
  }
  .p-3 {
    padding: 0.7rem;
  }
}

/* Micro-typographie optimisée */
.text-\[7px\] {
  font-size: 7px;
  letter-spacing: 0.3px;
  line-height: 1.2;
}
.text-\[8px\] {
  font-size: 8px;
  line-height: 1.25;
}
.text-\[9px\] {
  font-size: 9px;
  line-height: 1.35;
}
.text-\[10px\] {
  font-size: 10px;
  line-height: 1.4;
}

/* Performance */
img {
  content-visibility: auto;
}
</style>
