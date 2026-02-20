<template>
  <div class="h-full py-2 md:py-4">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section pour le filleul non vérifié -->
      <div v-if="userEstFilleul && !userEstFilleul.email_verifie" class="mb-8">
        <div class="bg-white rounded-2xl shadow-lg p-6 sm:p-8 max-w-md mx-auto">
          <!-- En-tête -->
          <div class="flex items-center gap-3 mb-4">
            <div
              class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center"
            >
              <i class="fas fa-gift text-green-600 text-lg"></i>
            </div>
            <h2 class="text-xl font-bold text-gray-900">
              Invité par
              <span class="text-green-600 italic">{{
                userEstFilleul.parrain_nom
              }}</span>
            </h2>
          </div>

          <p class="text-gray-600 mb-6">
            Vérifiez que vous n'êtes pas un robot et gagnez
            <span class="text-green-600 font-semibold"
              >{{ bonusParrain }} jetons</span
            >
          </p>

          <!-- Étape 1: Demande de code -->
          <div v-if="!verificationEnvoyee">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Email de vérification
              </label>
              <div class="relative">
                <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <i class="fas fa-envelope text-gray-400"></i>
                </div>
                <input
                  v-model="emailVerification"
                  type="email"
                  class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                  placeholder="Entrez votre email"
                  :class="{ 'border-red-500': emailError }"
                />
              </div>
              <p v-if="emailError" class="mt-1 text-sm text-red-600">
                {{ emailError }}
              </p>
            </div>

            <button
              @click="demanderVerification"
              :disabled="!emailValide || loadingVerification"
              class="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <i v-if="loadingVerification" class="fas fa-spinner fa-spin"></i>
              <i v-else class="fas fa-paper-plane"></i>
              {{
                loadingVerification ? "Envoi en cours..." : "Recevoir le code"
              }}
            </button>
          </div>

          <!-- Étape 2: Saisie du code -->
          <div v-else>
            <div
              class="bg-green-50 border border-green-200 rounded-xl p-4 mb-6"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <i class="fas fa-check-circle text-green-600"></i>
                  <p class="text-green-800 text-sm">
                    Code envoyé à <strong>{{ emailVerification }}</strong>
                  </p>
                </div>
                <button
                  @click="modifierEmail"
                  class="text-green-600 hover:text-green-800 text-sm flex items-center gap-1 transition-colors"
                >
                  <i class="fas fa-edit text-sm"></i>
                  Modifier
                </button>
              </div>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Code de vérification (6 chiffres)
              </label>
              <div class="relative">
                <input
                  v-model="codeVerification"
                  type="text"
                  maxlength="6"
                  class="block w-full px-4 py-3 text-center text-xl font-bold tracking-widest border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                  placeholder="000000"
                  :class="{ 'border-red-500': codeError }"
                  @input="formatCode"
                />
                <button
                  v-if="codeVerification.length === 6"
                  @click="verifierEmail"
                  :disabled="loadingVerification"
                  class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white p-2 rounded-lg transition-colors"
                >
                  <i
                    v-if="loadingVerification"
                    class="fas fa-spinner fa-spin w-4 h-4"
                  ></i>
                  <i v-else class="fas fa-check w-4 h-4"></i>
                </button>
              </div>
              <p v-if="codeError" class="mt-1 text-sm text-red-600">
                {{ codeError }}
              </p>

              <div
                class="flex justify-between items-center mt-3 text-sm text-gray-500"
              >
                <div class="flex items-center gap-1">
                  <i class="fas fa-clock"></i>
                  <span>Expire dans 24h</span>
                </div>
                <button
                  @click="renvoyerCode"
                  class="text-green-600 hover:text-green-800 transition-colors"
                >
                  Renvoyer le code
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section pour le filleul vérifié -->
      <div v-if="userEstFilleul && userEstFilleul.email_verifie" class="mb-8">
        <div
          class="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto text-center"
        >
          <div
            class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <i class="fas fa-check-circle text-green-600 text-2xl"></i>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Email vérifié !</h2>
          <p class="text-gray-600 mb-4">
            Vous avez reçu
            <span class="text-green-600 font-semibold"
              >{{ userEstFilleul.bonus_parrain }} jetons</span
            >
          </p>
          <p class="text-gray-500 text-sm">
            Parrainé par <strong>{{ userEstFilleul.parrain_nom }}</strong>
          </p>
        </div>
      </div>
      <!-- Section pour le parrain -->
      <div v-if="userEstParrain" class="space-y-8">
        <!-- En-tête avec lien de parrainage -->
        <div class="border-b-2 p-4">
          <div
            class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2"
          >
            <div>
              <h2 class="text-md md:text-2xl font-bold text-gray-900 mb-1">
                Mon Réseau de Parrainage
              </h2>
              <p class="text-gray-600 text-sm md:text-xl">
                Partagez votre lien et gagnez des jetons
              </p>
            </div>
            <div class="flex-1 max-w-lg">
              <p class="text-sm font-medium text-gray-700 mb-1">
                Lien de parrainage :
              </p>
              <div class="flex flex-col sm:flex-row gap-3">
                <!-- Lien avec copie -->
                <div class="flex gap-2 flex-1">
                  <code
                    class="flex-1 bg-gray-100 px-2 py-2 rounded-lg text-sm border truncate"
                  >
                    {{ lienParrainage }}
                  </code>
                  <button
                    @click="copierLien"
                    class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 flex-shrink-0"
                    :class="{ 'bg-green-700': copieReussie }"
                  >
                    <i
                      class="fas"
                      :class="copieReussie ? 'fa-check' : 'fa-copy'"
                    ></i>
                    <span class="hidden sm:inline">{{
                      copieReussie ? "Copié !" : "Copier"
                    }}</span>
                  </button>
                </div>

                <!-- Bouton de partage natif -->
                <button
                  v-if="partageSupporté"
                  @click="partagerLien"
                  class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 flex-shrink-0"
                >
                  <i class="fas fa-share-alt"></i>
                  <span class="sm:inline">Partager</span>
                </button>

                <!-- Fallback pour navigateurs sans support -->
                <div v-else class="relative group">
                  <button
                    class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 flex-shrink-0"
                  >
                    <i class="fas fa-share-alt"></i>
                    <span class="sm:inline">Partager</span>
                  </button>

                  <!-- Tooltip d'information -->
                  <div
                    class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block"
                  >
                    <div
                      class="bg-gray-800 text-white text-sm rounded py-1 px-2 whitespace-nowrap"
                    >
                      Partage non supporté
                      <div
                        class="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Options de partage alternatives -->
              <div v-if="!partageSupporté" class="mt-3 flex flex-wrap gap-2">
                <button
                  v-for="reseau in reseauxSociaux"
                  :key="reseau.nom"
                  @click="partagerReseau(reseau)"
                  class="text-sm px-3 py-1 rounded-full border transition-colors flex items-center gap-1"
                  :class="reseau.classes"
                >
                  <i :class="reseau.icone"></i>
                  {{ reseau.nom }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Statistiques -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-2">
          <div class="bg-white rounded-xl shadow-lg p-1">
            <div class="flex items-center flex flex-col">
              <div class="text-lg font-bold text-gray-900">
                {{ stats.total_bonus || 0 }}
              </div>
              <div class="text-sm text-gray-500">Filleuls total</div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-lg p-1">
            <div class="flex items-center flex flex-col">
              <div class="text-lg font-bold text-yellow-800">
                {{ stats.en_attente || 0 }}
              </div>
              <div class="text-sm text-gray-500">En attente</div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-lg p-1">
            <div class="flex items-center flex flex-col">
              <div class="text-lg font-bold text-gray-900">
                {{ stats.actifs || 0 }}
              </div>
              <div class="text-sm text-gray-500">Bonus activés</div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-lg p-1">
            <div class="flex items-center flex flex-col">
              <div class="text-lg font-bold text-green-900">
                {{ stats.total_bonus || 0 }}
              </div>
              <div class="text-sm text-gray-500">Tokens gagnés</div>
            </div>
          </div>
        </div>

        <!-- Liste des filleuls -->
        <div class="bg-white rounded-2xl shadow-lg px-2 pb-8">
          <div v-if="parrainages.length === 0" class="text-center py-12">
            <div
              class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <i class="fas fa-user-plus text-gray-400 text-xl"></i>
            </div>
            <p class="text-gray-500 mb-2">Vous n'avez pas encore de filleuls</p>
            <p class="text-gray-400 text-sm">
              Partagez votre lien de parrainage pour inviter des amis
            </p>
          </div>

          <div v-else class="grid gap-4">
            <div
              v-for="parrainage in parrainages"
              :key="parrainage.id"
              class="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
            >
              <div class="flex items-start gap-1">
                <!-- Avatar -->
                <div
                  class="w-8 h-8 md:w-12 md:h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0"
                >
                  <i class="fas fa-user text-gray-600"></i>
                </div>

                <!-- Informations -->
                <div class="flex-1 min-w-0">
                  <div
                    class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2"
                  >
                    <h4 class="font-semibold text-gray-900 truncate">
                      {{ parrainage.filleul?.nom }}
                    </h4>
                  </div>
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium"
                    :class="{
                      'bg-yellow-100 text-yellow-800':
                        parrainage.statut === 'en_attente',
                      'bg-green-100 text-green-800':
                        parrainage.statut === 'bonus_attribue',
                      'bg-red-100 text-red-800':
                        parrainage.statut === 'rejected',
                    }"
                  >
                    {{ getStatusLabel(parrainage.statut) }}
                  </span>

                  <p class="text-gray-600 text-sm mb-1">
                    {{ parrainage.filleul?.email }}
                    <span
                      v-if="parrainage.email_verification"
                      class="text-gray-400"
                    >
                      (vérification: {{ parrainage.email_verification }})
                    </span>
                  </p>

                  <p class="text-gray-400 text-sm">
                    Inscrit le {{ formatDate(parrainage.created_at) }}
                  </p>
                </div>

                <!-- Bonus -->
                <div class="text-right flex-shrink-0">
                  <div
                    v-if="parrainage.bonus_attribue"
                    class="text-green-600 font-semibold"
                  >
                    +{{ parrainage.bonus_parrain }} tokens
                  </div>
                  <div v-else class="text-gray-400 text-sm">En attente</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de succès -->
    <div
      v-if="showSuccess"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-2xl p-8 max-w-sm w-full text-center">
        <div
          class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <i class="fas fa-check-circle text-green-600 text-2xl"></i>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">Félicitations !</h3>
        <p class="text-gray-600 mb-6">
          Email vérifié avec succès. Vous avez reçu {{ bonusAttribue }} jetons.
        </p>
        <button
          @click="showSuccess = false"
          class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
        >
          Compris
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import apiClient from "../api";
import emailjs from "../utils/emailjsConfig";
import { useAuthStore } from "../stores/Auth";

const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();
const user = computed(() => authStore.user);

// Refs
const emailVerification = ref("");
const codeVerification = ref("");
const verificationEnvoyee = ref(false);
const loadingVerification = ref(false);
const emailError = ref("");
const codeError = ref("");
const parrainages = ref([]);
const stats = ref({});
const showSuccess = ref(false);
const bonusAttribue = ref(0);
const userEstFilleul = ref(null);

// Computed properties
const userEstParrain = computed(() => {
  return parrainages.value.length > 0 || user.value?.parrainage_code;
});

const emailValide = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(emailVerification.value);
});

const lienParrainage = computed(() => {
  const baseUrl = window.location.origin;
  const code = user.value?.parrainage_code;
  return code ? `${baseUrl}/register?code=${code}` : "";
});

const bonusParrain = computed(() => {
  return userEstFilleul.value?.bonus_parrain || 3;
});

// Méthodes
const formatCode = () => {
  codeVerification.value = codeVerification.value.replace(/\D/g, "");
  if (codeVerification.value.length > 6) {
    codeVerification.value = codeVerification.value.slice(0, 6);
  }
};

// Refs supplémentaires
const copieReussie = ref(false);
const partageSupporté = ref(false);

// Réseaux sociaux pour le fallback
const reseauxSociaux = [
  {
    nom: "WhatsApp",
    icone: "fab fa-whatsapp",
    classes: "border-green-200 bg-green-50 text-green-700 hover:bg-green-100",
    url: (lien, texte) =>
      `https://wa.me/?text=${encodeURIComponent(texte + " " + lien)}`,
  },
  {
    nom: "Facebook",
    icone: "fab fa-facebook",
    classes: "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100",
    url: (lien, texte) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(lien)}&quote=${encodeURIComponent(texte)}`,
  },
  {
    nom: "Twitter",
    icone: "fab fa-twitter",
    classes: "border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100",
    url: (lien, texte) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(texte)}&url=${encodeURIComponent(lien)}`,
  },
  {
    nom: "Email",
    icone: "fas fa-envelope",
    classes: "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100",
    url: (lien, texte) =>
      `mailto:?subject=${encodeURIComponent("Rejoins-moi sur Espace Cameroun")}&body=${encodeURIComponent(texte + "\n\n" + lien)}`,
  },
];

// Vérifier le support du partage natif
const verifierSupportPartage = () => {
  partageSupporté.value = navigator.share !== undefined;
};

// Partage natif
const partagerLien = async () => {
  if (!partageSupporté.value) return;

  const textePartage = `Rejoins-moi sur Espace Cameroun ! Utilise mon lien de parrainage pour obtenir des avantages exclusifs 🚀`;

  try {
    await navigator.share({
      title: "Espace Cameroun - Parrainage",
      text: textePartage,
      url: lienParrainage.value,
    });
  } catch (error) {
    // L'utilisateur a annulé le partage, on ne fait rien
    if (error.name !== "AbortError") {
      console.error("Erreur lors du partage:", error);
      toast.error("Erreur lors du partage");
    }
  }
};

// Partage via réseaux sociaux (fallback)
const partagerReseau = (reseau: any) => {
  const textePartage = `Rejoins-moi sur Espace Cameroun ! Utilise mon lien de parrainage pour obtenir des avantages exclusifs 🚀`;
  const urlPartage = reseau.url(lienParrainage.value, textePartage);

  window.open(urlPartage, "_blank", "width=600,height=400");
};

// Copie améliorée avec feedback
const copierLien = async () => {
  try {
    await navigator.clipboard.writeText(lienParrainage.value);
    copieReussie.value = true;
    toast.success("Lien copié dans le presse-papier !");

    // Réinitialiser après 2 secondes
    setTimeout(() => {
      copieReussie.value = false;
    }, 2000);
  } catch (err) {
    toast.error("Erreur lors de la copie du lien");
  }
};

// Initialisation
onMounted(() => {
  chargerParrainages();
  verifierSupportPartage();
});

const modifierEmail = () => {
  verificationEnvoyee.value = false;
  emailError.value = "";
  codeVerification.value = "";
  codeError.value = "";
};

const demanderVerification = async () => {
  if (!emailValide.value) {
    emailError.value = "Veuillez entrer un email valide";
    return;
  }

  loadingVerification.value = true;
  emailError.value = "";

  try {
    const response = await apiClient.post("/parrainage/demander-verification", {
      email: emailVerification.value,
    });

    if (response.data.success) {
      verificationEnvoyee.value = true;
      toast.success("Code de vérification envoyé !");
    }
  } catch (error: any) {
    emailError.value =
      error.response?.data?.message || "Erreur lors de l'envoi du code";
    toast.error(emailError.value);
  } finally {
    loadingVerification.value = false;
  }
};

const verifierEmail = async () => {
  if (codeVerification.value.length !== 6) {
    codeError.value = "Le code doit contenir 6 chiffres";
    return;
  }

  loadingVerification.value = true;
  codeError.value = "";

  try {
    const response = await apiClient.post("/parrainage/verifier-email", {
      email: emailVerification.value,
      code_verification: codeVerification.value,
    });

    if (response.data.success) {
      bonusAttribue.value = response.data.bonus_attribue;
      showSuccess.value = true;

      await chargerParrainages();
      toast.success("Email vérifié avec succès !");
    }
  } catch (error: any) {
    codeError.value =
      error.response?.data?.message || "Erreur lors de la vérification";
    toast.error(codeError.value);
  } finally {
    loadingVerification.value = false;
  }
};

const renvoyerCode = async () => {
  await demanderVerification();
  toast.info("Nouveau code envoyé !");
};

const chargerParrainages = async () => {
  try {
    const response = await apiClient.get("/parrainage/mes-parrainages");
    parrainages.value = response.data.parrainages;
    userEstFilleul.value = response.data.parrainageEnAttente;
    stats.value = response.data.statistiques;

    // Pré-remplir l'email si déjà défini
    if (userEstFilleul.value?.email_verification) {
      emailVerification.value = userEstFilleul.value.email_verification;
      verificationEnvoyee.value = true;
    }
  } catch (error) {
    console.error("Erreur chargement parrainages:", error);
    toast.error("Erreur lors du chargement des données");
  }
};

const getStatusLabel = (statut: string) => {
  const labels: { [key: string]: string } = {
    en_attente: "En attente",
    bonus_attribue: "verifié",
    rejected: "Rejeté",
  };
  return labels[statut] || statut;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("fr-FR");
};

// Initialisation
onMounted(() => {
  chargerParrainages();
});
</script>
