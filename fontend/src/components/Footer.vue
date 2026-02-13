<template>
  <footer
    class="relative bg-emerald-950 text-gray-300 pt-16 pb-8 overflow-hidden"
  >
    <div
      class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-50"
    ></div>

    <div class="container mx-auto px-4 relative z-10">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div class="space-y-6">
          <RouterLink
            to="/"
            class="inline-block transition-transform hover:scale-105"
          >
            <img
              src="/src/assets/images/logo/logo_blanc.png"
              class="h-10 w-auto"
              alt="EspaceCameroun"
            />
          </RouterLink>
          <p class="text-sm leading-relaxed text-emerald-100/70">
            La marketplace n°1 au Cameroun. Nous connectons les vendeurs et
            acheteurs locaux en toute sécurité. Transformez vos objets en
            opportunités.
          </p>
          <div class="flex gap-4">
            <a
              href="#"
              class="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-yellow-400 hover:text-emerald-900 transition-all duration-300"
            >
              <i class="fab fa-facebook-f"></i>
            </a>
            <a
              href="#"
              class="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-yellow-400 hover:text-emerald-900 transition-all duration-300"
            >
              <i class="fab fa-whatsapp"></i>
            </a>
            <a
              href="#"
              class="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-yellow-400 hover:text-emerald-900 transition-all duration-300"
            >
              <i class="fab fa-instagram"></i>
            </a>
          </div>
        </div>

        <div>
          <h5
            class="text-white font-bold text-base mb-6 flex items-center gap-2"
          >
            <span class="w-6 h-1 bg-yellow-400 rounded-full"></span>
            Marketplace
          </h5>
          <ul class="space-y-4">
            <li>
              <RouterLink
                to="/market-place"
                class="text-sm hover:text-yellow-400 hover:translate-x-1 inline-block transition-all"
              >
                Toutes les annonces</RouterLink
              >
            </li>
            <li>
              <RouterLink
                to="/categories"
                class="text-sm hover:text-yellow-400 hover:translate-x-1 inline-block transition-all"
              >
                Parcourir par ville</RouterLink
              >
            </li>
            <li>
              <RouterLink
                to="/gallery"
                class="text-sm hover:text-yellow-400 hover:translate-x-1 inline-block transition-all"
              >
                Publier une annonce</RouterLink
              >
            </li>
            <li>
              <RouterLink
                to="/aide"
                class="text-sm hover:text-yellow-400 hover:translate-x-1 inline-block transition-all"
              >
                Conseils de sécurité</RouterLink
              >
            </li>
          </ul>
        </div>

        <div>
          <h5
            class="text-white font-bold text-base mb-6 flex items-center gap-2"
          >
            <span class="w-6 h-1 bg-yellow-400 rounded-full"></span>
            Besoin d'aide ?
          </h5>
          <ul class="space-y-4">
            <li class="flex items-start gap-3 group">
              <i class="fas fa-headset text-yellow-400 mt-1"></i>
              <RouterLink
                to="/contact"
                class="text-sm group-hover:text-yellow-400 transition-colors"
                >Support Client 24/7</RouterLink
              >
            </li>
            <li class="flex items-start gap-3 group">
              <i class="fas fa-envelope text-yellow-400 mt-1"></i>
              <a
                href="mailto:contact@espacecameroun.com"
                class="text-sm group-hover:text-yellow-400 transition-colors"
                >contact@espacecameroun.com</a
              >
            </li>
            <li class="flex items-start gap-3 group">
              <i class="fas fa-map-marker-alt text-yellow-400 mt-1"></i>
              <span class="text-sm italic">Douala, Cameroun</span>
            </li>
          </ul>
        </div>

        <div class="bg-white/5 rounded-2xl p-6 border border-white/10">
          <h5 class="text-white font-bold text-sm mb-4">RESTEZ INFORMÉ</h5>
          <p class="text-xs text-emerald-100/60 mb-4">
            Recevez les meilleures pépites directement par email.
          </p>
          <form class="space-y-2" @submit.prevent>
            <input
              type="email"
              placeholder="Votre email"
              class="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/10 text-white text-sm focus:outline-none focus:border-yellow-400 transition-colors"
            />
            <button
              class="w-full bg-yellow-400 text-emerald-900 font-bold py-2 rounded-lg text-sm hover:bg-yellow-300 transition-all"
            >
              S'inscrire
            </button>
          </form>
        </div>
      </div>

      <div
        class="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6"
      >
        <div
          class="flex flex-col md:flex-row items-center gap-4 text-xs text-emerald-100/50"
        >
          <p>
            &copy; {{ new Date().getFullYear() }} EspaceCameroun. Tous droits
            réservés.
          </p>
          <div class="hidden md:block w-1 h-1 bg-white/20 rounded-full"></div>
          <div class="flex gap-4">
            <RouterLink to="/politique-utilisation" class="hover:underline"
              >Conditions</RouterLink
            >
            <RouterLink to="/politique-confidentialite" class="hover:underline"
              >Confidentialité
            </RouterLink>
          </div>
        </div>

        <div
          class="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10"
        >
          <span class="text-xs font-medium tracking-widest text-emerald-100/80"
            >MADE BY mciagnessi@gmail.com</span
          >
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>
