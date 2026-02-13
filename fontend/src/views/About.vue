<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section - L'ambition -->
    <section class="relative pt-8 pb-6 md:pt-12 md:pb-8">
      <!-- Élément décoratif minimal -->
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMzAgMTBhMjAgMjAgMCAwIDEgMjAgMjAgMjAgMjAgMCAwIDEtNDAgMCAyMCAyMCAwIDAgMSAyMC0yMHoiIGZpbGw9IiM0YWQ5N2UiIGZpbGwtb3BhY2l0eT0iMC4wMyIvPjwvc3ZnPg==')] opacity-40"></div>

      <div class="w-full max-w-7xl mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-start">
          
          <!-- CONTENU - Mission & vision -->
          <div class="space-y-3">
            <!-- Label identité -->
            <div class="flex items-center gap-1.5">
              <span class="w-1 h-1 bg-yellow-500 rounded-full"></span>
              <span class="text-[10px] font-bold text-[var(--espace-vert)] uppercase tracking-[0.2em]">ESPACE CAMEROUN</span>
              <span class="w-1 h-1 bg-yellow-500 rounded-full"></span>
            </div>

            <!-- Titre : la raison d'être -->
            <h1 class="text-lg sm:text-xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              <span class="bg-gradient-to-r from-[var(--espace-vert)] to-emerald-600 bg-clip-text text-transparent">
                Digitaliser l'informel,
              </span>
              <span class="block">
                sans perdre l'humain.
              </span>
            </h1>

            <!-- La promesse -->
            <p class="text-xs sm:text-sm text-gray-700 leading-relaxed max-w-lg">
              Une vitrine professionnelle pour chaque commerçant. <br class="hidden sm:block">
              <span class="bg-emerald-50 px-1 py-0.5 rounded text-[var(--espace-vert)] font-medium">100% gratuite, 100% camerounaise.</span>
            </p>

            <!-- Stats clés -->
            <div class="flex flex-wrap items-center gap-3 pt-1 border-t border-b border-gray-100 py-2">
              <div>
                <span class="text-sm font-black text-[var(--espace-vert)]">10K+</span>
                <span class="text-[9px] text-gray-500 ml-1">vendeurs</span>
              </div>
              <span class="w-px h-3 bg-gray-200"></span>
              <div>
                <span class="text-sm font-black text-[var(--espace-vert)]">237</span>
                <span class="text-[9px] text-gray-500 ml-1">localités</span>
              </div>
              <span class="w-px h-3 bg-gray-200"></span>
              <div>
                <span class="text-sm font-black text-[var(--espace-vert)]">0%</span>
                <span class="text-[9px] text-gray-500 ml-1">commission</span>
              </div>
            </div>
          </div>

          <!-- LOGO - Symbole -->
          <div class="relative flex justify-center md:justify-end mt-2 md:mt-0">
            <div class="relative w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40">
              <div class="absolute inset-0 bg-gradient-to-br from-emerald-100 to-yellow-100 rounded-full blur-md opacity-60"></div>
              <div class="relative bg-white p-2 rounded-2xl shadow-lg border border-gray-100 rotate-2">
                <img 
                  src="../assets/images/logo/LOGO_vert_all.png" 
                  alt="Espace Cameroun" 
                  class="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- LE DÉFI & NOTRE RÉPONSE -->
    <section class="py-5 bg-gray-50 border-t border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <!-- Le défi -->
          <div class="bg-white p-3 rounded-lg">
            <div class="flex items-start gap-1.5">
              <span class="text-xs text-gray-400 font-mono">01</span>
              <div>
                <h3 class="text-[11px] font-bold text-gray-900 mb-0.5">Le défi</h3>
                <p class="text-[10px] text-gray-600 leading-relaxed">
                  Des milliers de commerçants talents sans visibilité. <br>
                  Un secteur informel dynamique mais invisible.
                </p>
              </div>
            </div>
          </div>
          <!-- Notre réponse -->
          <div class="bg-[var(--espace-vert)]/5 p-3 rounded-lg">
            <div class="flex items-start gap-1.5">
              <span class="text-xs text-[var(--espace-vert)] font-mono">02</span>
              <div>
                <h3 class="text-[11px] font-bold text-[var(--espace-vert)] mb-0.5">Notre réponse</h3>
                <p class="text-[10px] text-gray-700 leading-relaxed">
                  Une vitrine numérique simple, rapide, accessible. <br>
                  Chaque commerçant devient acteur du web.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- VALEURS - Ce en quoi on croit -->
    <section class="py-5 bg-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="space-y-2.5">
          <!-- Titre discret -->
          <div class="flex items-center gap-2">
            <span class="w-4 h-[2px] bg-[var(--espace-vert)]"></span>
            <span class="text-[8px] font-bold text-gray-400 uppercase tracking-widest">NOTRE ADN</span>
          </div>
          
          <!-- 3 piliers -->
          <div class="grid grid-cols-3 gap-2">
            <div class="bg-gray-50 p-2 rounded-lg">
              <span class="text-base mb-0.5 block">📌</span>
              <h4 class="text-[10px] font-bold text-gray-900 mb-0.5">Local</h4>
              <p class="text-[8px] text-gray-600 leading-tight">
                Pensé au Cameroun, pour les Camerounais.
              </p>
            </div>
            <div class="bg-gray-50 p-2 rounded-lg">
              <span class="text-base mb-0.5 block">🛡️</span>
              <h4 class="text-[10px] font-bold text-gray-900 mb-0.5">Équitable</h4>
              <p class="text-[8px] text-gray-600 leading-tight">
                Zéro commission. Zéro frais caché.
              </p>
            </div>
            <div class="bg-gray-50 p-2 rounded-lg">
              <span class="text-base mb-0.5 block">🚀</span>
              <h4 class="text-[10px] font-bold text-gray-900 mb-0.5">Accessible</h4>
              <p class="text-[8px] text-gray-600 leading-tight">
                Simple, rapide, même sur réseau mobile.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- LA PASSION - Le moteur -->
    <section class="py-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-start gap-3">
          
          <!-- Avatar développeur - discret -->
          <div class="relative flex-shrink-0">
            <div class="relative w-12 h-12 rounded-full overflow-hidden border border-gray-600">
              <img 
                src="https://avatars.githubusercontent.com/u/108453424?v=4" 
                alt="Développeur" 
                class="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
          
          <!-- Passion & motivation -->
          <div class="flex-1">
            <div class="flex items-center gap-1.5 mb-1">
              <span class="text-yellow-400 text-[10px]">⚡</span>
              <span class="text-[9px] font-medium text-yellow-400/90 uppercase tracking-wider">DÉVELOPPÉ AVEC PASSION</span>
            </div>
            
            <p class="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Construire une solution qui <span class="text-white font-medium">sert vraiment</span>, pas juste une énième marketplace. 
              Donner aux commerçants locaux les mêmes outils que les grandes enseignes.
            </p>
            
            <div class="flex items-center gap-2 mt-2">
              <span class="text-[9px] bg-white/10 px-2 py-0.5 rounded-full text-gray-300">
                Open source
              </span>
              <span class="text-[9px] bg-white/10 px-2 py-0.5 rounded-full text-gray-300">
                Made in 🇨🇲
              </span>
              <a href="https://github.com/mciagnessi" target="_blank" class="text-[9px] text-gray-400 hover:text-white inline-flex items-center gap-0.5 ml-auto">
                GitHub <i class="fas fa-arrow-right text-[7px]"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- TÉMOIGNAGE - Impact réel -->
    <section class="py-4 bg-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="bg-emerald-50/70 rounded-lg p-3">
          <div class="flex items-start gap-2">
            <span class="text-[var(--espace-vert)] text-[10px] font-mono mt-0.5">“</span>
            <div>
              <p class="text-[10px] italic text-gray-700 leading-relaxed">
                Je suis passé de 2 à 12 ventes par semaine. Mes clients me trouvent maintenant 
                sans que j'aie à aller au carrefour tous les matins.
              </p>
              <div class="flex items-center gap-1 mt-1">
                <span class="w-3 h-3 bg-gray-400 rounded-full"></span>
                <span class="text-[8px] font-medium text-gray-900">Amina</span>
                <span class="text-[7px] text-gray-500">• Vêtements, Yaoundé</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- MANIFESTE - Pourquoi on existe -->
    <section class="py-6 bg-white border-t border-gray-100">
      <div class="max-w-7xl mx-auto px-4">
        <div class="max-w-lg mx-auto text-center space-y-2">
          <span class="text-[20px] block">🌍</span>
          <p class="text-[11px] text-gray-600 leading-relaxed">
            <span class="font-bold text-gray-900">Espace Cameroun</span> est né d'une conviction : 
            le numérique doit être un ascenseur social, pas un mur de plus.
          </p>
          <p class="text-[10px] text-gray-500 italic">
            Donner à l'économie locale les moyens de rayonner au-delà de nos frontières.
          </p>
          <div class="pt-1">
            <span class="text-[7px] font-mono text-gray-400 tracking-[0.2em]">
              #FIERCEMENTCAMEROUNAIS
            </span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Économie d'espace maximale */
@media (max-width: 640px) {
  .py-8 { padding-top: 1.25rem; padding-bottom: 1.25rem; }
  .py-6 { padding-top: 1rem; padding-bottom: 1rem; }
  .py-5 { padding-top: 0.875rem; padding-bottom: 0.875rem; }
  .py-4 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
  .gap-3 { gap: 0.5rem; }
  .p-3 { padding: 0.625rem; }
}

/* Micro-optimisations */
.text-\[10px\] { font-size: 10px; line-height: 1.3; }
.text-\[9px\] { font-size: 9px; line-height: 1.2; }
.text-\[8px\] { font-size: 8px; line-height: 1.2; }
.text-\[7px\] { font-size: 7px; line-height: 1.1; }

/* Animation douce */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

section {
  animation: fadeIn 0.3s ease;
}
</style>