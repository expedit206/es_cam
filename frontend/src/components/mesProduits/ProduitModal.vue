<!-- src/components/ProductModal.vue -->
<template>
  <div
    v-if="store.visible"
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-3 sm:p-4"
  >
    <div
      class="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-2xl max-h-[100vh] overflow-hidden animate-modal-in pb-4"
    >
      <!-- Header du modal -->
      <div
        class="bg-primary p-4 sm:p-6 text-white border-b-2 border-primary-dark"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 sm:gap-3">
            <div
              class="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center"
            >
              <i class="fas fa-box text-sm sm:text-base"></i>
            </div>
            <div>
              <h2 class="text-lg sm:text-xl font-bold">
                {{ isEditMode ? t("edit_product") : t("new_product") }}
              </h2>
            </div>
          </div>
          <button
            @click="store.closeModal()"
            class="text-white/80 hover:text-white transition-colors"
          >
            <i class="fas fa-times text-lg sm:text-xl"></i>
          </button>
        </div>
      </div>

      <!-- Formulaire -->
      <div class="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
        <form @submit.prevent="submit" class="space-y-4 sm:space-y-6">
          <!-- Photos -->
          <div>
            <label
              class="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3"
            >
              {{ t("product_photos") }}
            </label>
            <div
              class="border-2 border-dashed border-gray-300 rounded-xl sm:rounded-2xl p-3 sm:p-4"
            >
              <div
                v-if="imagePreviews.length"
                class="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4"
              >
                <div
                  v-for="(preview, index) in imagePreviews"
                  :key="index"
                  class="relative aspect-square bg-gray-50 rounded-lg overflow-hidden"
                >
                  <img
                    :src="preview"
                    class="w-full h-full object-contain p-1 sm:p-2"
                    :alt="t('image_preview')"
                  />
                  <button
                    @click.prevent="removeImage(index)"
                    class="absolute top-0 right-0 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] sm:text-sm hover:bg-red-600 transition-colors"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>

              <input
                ref="fileInput"
                type="file"
                multiple
                @change="handleFileChange"
                class="hidden"
                accept="image/*"
              />
              <button
                type="button"
                @click="fileInput?.click()"
                class="w-full bg-gray-100 text-gray-700 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2 text-sm"
              >
                <i class="fas fa-camera text-sm sm:text-sm"></i>
                {{
                  imagePreviews.length ? t("add_more_photos") : t("add_photos")
                }}
              </button>
            </div>
          </div>

          <!-- Informations de base -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div class="relative">
              <label
                class="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2"
              >
                {{ t("category") }} *
              </label>
              <input
                v-model="categoryProduitSearch"
                type="text"
                :placeholder="t('search_category')"
                class="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg sm:rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                @focus="showDropdown = true"
                @blur="hideDropdown"
              />

              <ul
                v-if="showDropdown && filteredCategoryProduits.length"
                class="absolute z-50 w-full bg-white border border-gray-300 rounded-lg sm:rounded-xl mt-1 max-h-32 sm:max-h-48 overflow-y-auto shadow-lg text-sm"
              >
                <li
                  v-for="cat in filteredCategoryProduits"
                  :key="cat.id"
                  @mousedown="selectCategory(cat)"
                  class="px-3 sm:px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  {{ cat.nom }}
                </li>
              </ul>
            </div>

            <div>
              <label
                class="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2"
              >
                {{ t("product_name") }} *
              </label>
              <input
                v-model="form.nom"
                type="text"
                required
                class="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg sm:rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label
                class="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2"
              >
                {{ t("available_stock") }} *
              </label>
              <input
                v-model.number="form.stock"
                type="number"
                min="0"
                required
                class="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg sm:rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
              />
            </div>

            <div>
              <label
                class="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2"
              >
                {{ t("price_fcfa") }} *
              </label>
              <input
                v-model.number="form.prix"
                type="number"
                min="0"
                required
                class="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg sm:rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
              />
            </div>
          </div>

          <!-- État du produit - Checkboxes -->
          <div>
            <label
              class="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3"
            >
              {{ t("product_condition") }} *
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
              <label
                v-for="condition in productConditions"
                :key="condition.value"
                :class="[
                  'flex items-center gap-3 p-1 sm:p-2 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-200',
                  form.condition === condition.value
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-300 bg-white hover:border-gray-400',
                ]"
              >
                <input
                  type="radio"
                  v-model="form.condition"
                  :value="condition.value"
                  required
                  class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <div class="flex items-center gap-2 text-sm font-medium">
                  <i
                    :class="
                      form.condition === condition.value
                        ? 'text-primary'
                        : 'text-gray-600'
                    "
                  ></i>
                  <span
                    :class="
                      form.condition === condition.value
                        ? 'text-primary'
                        : 'text-gray-700'
                    "
                  >
                    {{ condition.label }}
                  </span>
                </div>
              </label>
            </div>
            <p class="text-sm text-gray-500 mt-2">
              {{ t("select_one_condition") }}
            </p>
          </div>

          <div>
            <label
              class="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2"
            >
              {{ t("city") }} *
            </label>
            <input
              v-model="form.ville"
              type="text"
              class="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg sm:rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
            />
          </div>

          <!-- Sélection Partenaire (Admin Only) -->
          <div
            v-if="
              authStore.user?.role === 'admin' &&
              adminStore.partenaires.length > 0
            "
          >
            <label
              class="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2"
            >
              <i class="fas fa-handshake text-primary mr-1"></i>
              Associer à un commerçant
            </label>
            <div class="relative">
              <input
                v-model="partnerSearch"
                type="text"
                placeholder="Rechercher un commerçant..."
                class="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg sm:rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm pl-9"
                @focus="showPartnerDropdown = true"
                @blur="hidePartnerDropdown"
              />
              <i
                class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              ></i>

              <ul
                v-if="showPartnerDropdown && filteredPartners.length"
                class="absolute z-50 w-full bg-white border border-gray-300 rounded-lg sm:rounded-xl mt-1 max-h-48 overflow-y-auto shadow-lg text-sm"
              >
                <li
                  @mousedown="selectPartner(null)"
                  class="px-3 sm:px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 italic text-gray-500"
                >
                  Aucun (Mes produits)
                </li>
                <li
                  v-for="partner in filteredPartners"
                  :key="partner.id"
                  @mousedown="selectPartner(partner)"
                  class="px-3 sm:px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <div class="font-bold text-gray-800">
                    {{ partner.nom_boutique }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ partner.nom_responsable }} - {{ partner.marche }}
                  </div>
                </li>
              </ul>
            </div>
            <div
              v-if="selectedPartnerName"
              class="mt-2 text-sm text-primary font-medium flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-lg"
            >
              <i class="fas fa-check-circle"></i> Sélectionné :
              {{ selectedPartnerName }}
            </div>
          </div>

          <div>
            <label
              class="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2"
            >
              {{ t("description") }}
            </label>
            <textarea
              v-model="form.description"
              rows="2"
              class="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg sm:rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
            ></textarea>
          </div>

          <!-- Options supplémentaires -->
          <div
            class="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl"
          >
            <input
              id="revendable"
              type="radio"
              v-model="form.revendable"
              class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label for="revendable" class="text-sm font-medium text-gray-700">
              {{ t("make_revendable") }}
            </label>
          </div>

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4">
            <button
              type="submit"
              :disabled="loading"
              :class="[
                'flex-1 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-sm',
                loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-primary-dark',
              ]"
            >
              <i
                v-if="loading"
                class="fas fa-spinner fa-spin text-sm sm:text-sm"
              ></i>
              <i
                v-else
                :class="isEditMode ? 'fas fa-save' : 'fas fa-plus'"
                class="text-sm sm:text-sm"
              ></i>
              {{ isEditMode ? t("save") : t("new_product") }}
            </button>

            <button
              type="button"
              @click="close"
              class="px-4 sm:px-6 py-3 sm:py-4 border border-gray-300 text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-all font-semibold text-sm"
            >
              {{ t("cancel") }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from "vue";
import { useToast } from "vue-toastification";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "../useI18n";
import apiClient from "../../api";
import type { Product, Category } from "../types";
import { useProductModalStore } from "../../stores/productModalStore";
import { useAuthStore } from "../../stores/Auth";
import { useAdminStore } from "../../stores/admin";

const { t } = useI18n();
const toast = useToast();
const store = useProductModalStore();
const authStore = useAuthStore();
const adminStore = useAdminStore();
const router = useRouter();
const route = useRoute();

// Emits
const emit = defineEmits<{
  (e: "saved", product: Product): void;
}>();

// États locaux
const loading = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const oldImages = ref<string[]>([]);
const newImages = ref<File[]>([]);
const showDropdown = ref(false);
const categoryProduitSearch = ref("");

// Partner Selection (Admin)
const partnerSearch = ref("");
const showPartnerDropdown = ref(false);
const selectedPartnerName = ref("");

// Options pour l'état du produit
const productConditions = ref([
  {
    value: "neuf",
    label: "Neuf",
  },
  {
    value: "occasion",
    label: "Occasion",
  },
  {
    value: "reconditionne",
    label: "Reconditionné",
  },
]);

// Formulaire
const form = ref({
  nom: "",
  description: "",
  prix: 0,
  stock: 1,
  category_id: "",
  ville: "",
  condition: "neuf", // Valeur par défaut
  revendable: false,
  marge_min: 0,
  commercant_id: null as string | null,
});

// Computed
const isEditMode = computed(() => !!store.product);
const imagePreviews = computed(() => [
  ...oldImages.value,
  ...newImages.value.map((f) => URL.createObjectURL(f)),
]);

const filteredCategoryProduits = computed(() =>
  store.categoryProduits.filter((cat) =>
    cat.nom.toLowerCase().includes(categoryProduitSearch.value.toLowerCase()),
  ),
);

const filteredPartners = computed(() => {
  if (!partnerSearch.value) return adminStore.partenaires;
  const q = partnerSearch.value.toLowerCase();
  return adminStore.partenaires.filter(
    (p) =>
      p.nom_boutique.toLowerCase().includes(q) ||
      p.nom_responsable.toLowerCase().includes(q),
  );
});

// Méthodes
onMounted(() => {
  if (authStore.user?.role === "admin") {
    adminStore.fetchPartenaires();
  }
});

const close = () => {
  store.closeModal();
  resetForm();
};

const resetForm = () => {
  form.value = {
    nom: "",
    description: "",
    prix: 0,
    stock: 1,
    category_id: "",
    ville: "",
    condition: "neuf",
    revendable: false,
    marge_min: 0,
    commercant_id: null,
  };
  oldImages.value = [];
  newImages.value = [];
  categoryProduitSearch.value = "";
  partnerSearch.value = "";
  selectedPartnerName.value = "";
  showDropdown.value = false;
};

const selectCategory = (category: Category) => {
  form.value.category_id = category.id;
  categoryProduitSearch.value = category.nom;
  showDropdown.value = false;
};

const hideDropdown = () => {
  setTimeout(() => {
    showDropdown.value = false;
  }, 200);
};

const selectPartner = (partner: any) => {
  if (partner) {
    form.value.commercant_id = partner.id;
    selectedPartnerName.value = partner.nom_boutique;
    partnerSearch.value = ""; // Clear search or keep name? keeping name is better UX usually but custom input here
  } else {
    form.value.commercant_id = null;
    selectedPartnerName.value = "";
  }
  showPartnerDropdown.value = false;
};

const hidePartnerDropdown = () => {
  setTimeout(() => {
    showPartnerDropdown.value = false;
  }, 200);
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    const files = Array.from(target.files);
    newImages.value.push(...files);
    if (fileInput.value) fileInput.value.value = "";
  }
};

const removeImage = (index: number) => {
  if (index < oldImages.value.length) {
    oldImages.value.splice(index, 1);
  } else {
    const newIndex = index - oldImages.value.length;
    newImages.value.splice(newIndex, 1);
  }
};

const submit = async () => {
  if (
    !form.value.nom.trim() ||
    form.value.prix <= 0 ||
    !form.value.category_id ||
    !form.value.condition
  ) {
    toast.error("Veuillez remplir les champs obligatoires");
    return;
  }

  loading.value = true;

  try {
    const formData = new FormData();
    formData.append("nom", form.value.nom);
    formData.append("description", form.value.description);
    formData.append("prix", form.value.prix.toString());
    formData.append("stock", form.value.stock.toString());
    formData.append("category_id", form.value.category_id);
    formData.append("ville", form.value.ville);
    formData.append("condition", form.value.condition);
    formData.append("revendable", form.value.revendable ? "1" : "0");
    formData.append("marge_min", form.value.marge_min.toString());

    if (form.value.commercant_id) {
      formData.append("commercant_id", form.value.commercant_id);
    }

    oldImages.value.forEach((photo) => formData.append("old_photos[]", photo));
    newImages.value.forEach((image) => formData.append("photos[]", image));

    let res = ref();
    let message = "";
    if (isEditMode.value && store.product) {
      res.value = await apiClient.post(
        `/user/produits/${store.product.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      message = "modifié";
    } else {
      res.value = await apiClient.post("/user/produits", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      message = "ajouté";
    }

    emit("saved", res.value.data.produit);
    store.handleSaved(res.value.data.produit); // Optional Store action
    loading.value = false;
    close();
    toast.success(`Produit ${message} avec succès`);

    if (route.path !== "/gallery") {
      router.push("/gallery");
    }
  } catch (error: any) {
    console.error("Erreur sauvegarde produit:", error);
    toast.error(
      error.response?.data?.message || "Erreur lors de la sauvegarde",
    );
  } finally {
    loading.value = false;
  }
};

// Watchers
watch(
  () => store.visible,
  (newVal) => {
    if (newVal) {
      // Mode édition - initialiser avec les données du produit
      nextTick(() => {
        if (store.product) {
          form.value = {
            nom: store.product?.nom || "",
            description: store.product?.description || "",
            prix: store.product?.prix || 0,
            stock: store.product?.quantite || 1,
            category_id: store.product?.category_id || "",
            ville: store.product?.ville || "",
            condition: store.product?.condition || "neuf",
            revendable: !!store.product?.revendable,
            marge_min: store.product?.marge_min || 0,
            commercant_id: store.product?.commercant_id || null,
          };

          if (store.product?.commercant_id) {
            const partner = adminStore.partenaires.find(
              (p) => p.id === store.product?.commercant_id,
            );
            if (partner) selectedPartnerName.value = partner.nom_boutique;
          }

          oldImages.value = store.product?.photos
            ? [...store.product?.photos]
            : [];
          newImages.value = [];
          categoryProduitSearch.value =
            store.categoryProduits.find(
              (c) => c.id === store.product?.category_id,
            )?.nom || "";
        } else {
          resetForm();
        }
      });
    }
  },
);
</script>

<style scoped>
.animate-modal-in {
  animation: modal-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modal-in {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }

  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Style pour les checkboxes personnalisés */
input[type="radio"]:checked + div {
  color: var(--espace-vert);
}
</style>
