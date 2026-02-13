<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4"
  >
    <div
      class="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden animate-modal-in pb-4"
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
              <i class="fas fa-concierge-bell text-sm sm:text-base"></i>
            </div>
            <div>
              <h2 class="text-lg sm:text-xl font-bold">
                {{ isEditMode ? t("edit_service") : t("new_service") }}
              </h2>
              <p class="text-white/80 text-xs sm:text-sm">
                {{
                  isEditMode
                    ? t("edit_service_description")
                    : t("create_service_description")
                }}
              </p>
            </div>
          </div>
          <button
            @click="close"
            class="text-white/80 hover:text-white transition-colors"
          >
            <i class="fas fa-times text-lg sm:text-xl"></i>
          </button>
        </div>
      </div>

      <!-- Formulaire -->
      <div class="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
        <form @submit.prevent="submit" class="space-y-4 sm:space-y-6">
          <!-- Photos -->
          <div>
            <label
              class="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3"
            >
              {{ t("service_photos") }} ({{ t("max_5_photos") }})
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
                    class="absolute top-0 right-0 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] sm:text-xs hover:bg-red-600 transition-colors"
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
                :disabled="imagePreviews.length >= 5"
                :class="[
                  'w-full bg-gray-100 text-gray-700 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium flex items-center justify-center gap-2 text-sm transition-colors',
                  imagePreviews.length >= 5
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-gray-200',
                ]"
              >
                <i class="fas fa-camera text-xs sm:text-sm"></i>
                {{
                  imagePreviews.length ? t("add_more_photos") : t("add_photos")
                }}
                <span class="text-xs text-gray-500"
                  >({{ imagePreviews.length }}/5)</span
                >
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
                v-model="categorySearch"
                type="text"
                :placeholder="t('search_category')"
                class="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg sm:rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                @focus="showCategoryDropdown = true"
                @blur="hideCategoryDropdown"
              />

              <ul
                v-if="showCategoryDropdown && filteredCategories.length"
                class="absolute z-50 w-full bg-white border border-gray-300 rounded-lg sm:rounded-xl mt-1 max-h-32 sm:max-h-48 overflow-y-auto shadow-lg text-sm"
              >
                <li
                  v-for="cat in filteredCategories"
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
                {{ t("service_title") }} *
              </label>
              <input
                v-model="form.titre"
                type="text"
                required
                maxlength="255"
                class="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg sm:rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                :placeholder="t('service_title_placeholder')"
              />
            </div>
          </div>

          <!-- Localisation -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label
                class="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2"
              >
                {{ t("city") }} *
              </label>
              <input
                v-model="form.ville"
                type="text"
                required
                class="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg sm:rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                :placeholder="t('city_placeholder')"
              />
            </div>

            <div>
              <label
                class="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2"
              >
                {{ t("location") }} *
              </label>
              <input
                v-model="form.localisation"
                type="text"
                required
                class="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg sm:rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                :placeholder="t('location_placeholder')"
              />
            </div>
          </div>

          <!-- Expérience et compétences -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label
                class="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2"
              >
                {{ t("years_experience") }}
              </label>
              <input
                v-model.number="form.annees_experience"
                type="number"
                min="0"
                max="50"
                class="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg sm:rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                :placeholder="t('years_experience_placeholder')"
              />
            </div>

            <div>
              <label
                class="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2"
              >
                {{ t("skills") }}
              </label>
              <div class="flex flex-wrap gap-2 mb-2">
                <span
                  v-for="(skill, index) in form.competences"
                  :key="index"
                  class="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full flex items-center gap-1"
                >
                  {{ skill }}
                  <button
                    type="button"
                    @click="removeSkill(index)"
                    class="hover:text-green-900"
                  >
                    <i class="fas fa-times text-[10px]"></i>
                  </button>
                </span>
              </div>
              <div class="flex gap-2">
                <input
                  v-model="newSkill"
                  type="text"
                  @keydown.enter.prevent="addSkill"
                  class="flex-1 p-2.5 sm:p-3 border border-gray-300 rounded-lg sm:rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                  :placeholder="t('add_skill_placeholder')"
                />
                <button
                  type="button"
                  @click="addSkill"
                  class="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  {{ t("add") }}
                </button>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div>
            <label
              class="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2"
            >
              {{ t("description") }} *
            </label>
            <textarea
              v-model="form.description"
              rows="4"
              required
              class="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg sm:rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
              :placeholder="t('service_description_placeholder')"
            ></textarea>
            <p class="text-xs text-gray-500 mt-1">
              {{ form.description.length }}/2000
            </p>
          </div>

          <!-- Statut de disponibilité -->
          <div
            class="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl"
          >
            <input
              id="disponible"
              type="checkbox"
              v-model="form.disponibilite"
              true-value="disponible"
              false-value="indisponible"
              class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label for="disponible" class="text-sm font-medium text-gray-700">
              {{ t("make_service_available") }}
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
                class="fas fa-spinner fa-spin text-xs sm:text-sm"
              ></i>
              <i
                v-else
                :class="isEditMode ? 'fas fa-save' : 'fas fa-plus'"
                class="text-xs sm:text-sm"
              ></i>
              {{ isEditMode ? t("save") : t("create_service") }}
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
import { ref, computed, watch, nextTick } from "vue";
import { useToast } from "vue-toastification";
import { useI18n } from "../useI18n";
import apiClient from "../../api";
import type { Service, Category } from "../types";

const { t } = useI18n();
const toast = useToast();

// Props
interface Props {
  visible: boolean;
  service?: Service | null;
  categories: Category[];
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  service: null,
  categories: () => [],
});

// Emits
const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
  (e: "saved"): void;
  (e: "closed"): void;
}>();

// États locaux
const loading = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const oldImages = ref<string[]>([]);
const newImages = ref<File[]>([]);
const showCategoryDropdown = ref(false);
const categorySearch = ref("");
const newSkill = ref("");

// Formulaire simplifié
const form = ref({
  titre: "",
  description: "",
  category_id: "",
  annees_experience: null as number | null,
  competences: [] as string[],
  localisation: "",
  ville: "",
  disponibilite: "disponible",
});

// Computed
const isEditMode = computed(() => !!props.service);
const imagePreviews = computed(() => [
  ...oldImages.value,
  ...newImages.value.map((f) => URL.createObjectURL(f)),
]);

const filteredCategories = computed(() =>
  props.categories.filter((cat) =>
    cat.nom.toLowerCase().includes(categorySearch.value.toLowerCase()),
  ),
);

// Méthodes
const close = () => {
  emit("update:visible", false);
  emit("closed");
  resetForm();
};

const resetForm = () => {
  form.value = {
    titre: "",
    description: "",
    category_id: "",
    annees_experience: null,
    competences: [],
    localisation: "",
    ville: "",
    disponibilite: "disponible",
  };
  oldImages.value = [];
  newImages.value = [];
  categorySearch.value = "";
  newSkill.value = "";
  showCategoryDropdown.value = false;
};

const selectCategory = (category: Category) => {
  form.value.category_id = category.id.toString();
  categorySearch.value = category.nom;
  showCategoryDropdown.value = false;
};

const hideCategoryDropdown = () => {
  setTimeout(() => {
    showCategoryDropdown.value = false;
  }, 200);
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && imagePreviews.value.length + target.files.length <= 5) {
    const files = Array.from(target.files);
    newImages.value.push(...files);
    if (fileInput.value) fileInput.value.value = "";
  } else {
    toast.error(t("max_5_photos_error"));
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

const addSkill = () => {
  if (
    newSkill.value.trim() &&
    !form.value.competences.includes(newSkill.value.trim())
  ) {
    form.value.competences.push(newSkill.value.trim());
    newSkill.value = "";
  }
};

const removeSkill = (index: number) => {
  form.value.competences.splice(index, 1);
};

const submit = async () => {
  // Validation
  if (
    !form.value.titre.trim() ||
    !form.value.description.trim() ||
    !form.value.category_id
  ) {
    toast.error(t("fill_required_fields"));
    return;
  }

  if (!form.value.ville.trim() || !form.value.localisation.trim()) {
    toast.error(t("location_required"));
    return;
  }

  if (imagePreviews.value.length === 0) {
    toast.error(t("at_least_one_photo"));
    return;
  }

  loading.value = true;

  try {
    const formData = new FormData();

    // Données de base
    formData.append("titre", form.value.titre);
    formData.append("description", form.value.description);
    formData.append("category_id", form.value.category_id);
    formData.append("localisation", form.value.localisation);
    formData.append("ville", form.value.ville);
    formData.append("disponibilite", form.value.disponibilite);

    // Données optionnelles
    if (form.value.annees_experience) {
      formData.append(
        "annees_experience",
        form.value.annees_experience.toString(),
      );
    }

    // Compétences
    form.value.competences.forEach((comp, index) => {
      formData.append(`competences[${index}]`, comp);
    });

    // Images
    oldImages.value.forEach((photo) => formData.append("old_photos[]", photo));
    newImages.value.forEach((image) => formData.append("photos[]", image));
    const res = ref();
    if (isEditMode.value && props.service) {
      res.value = await apiClient.post(
        `/services/${props.service.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      toast.success(t("service_updated_success"));
    } else {
      res.value = await apiClient.post("/services", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }

    emit("saved", res.value.data.service);
    close();
  } catch (error: any) {
    console.error("Erreur sauvegarde service:", error);
    toast.error(error.response?.data?.message || t("error_saving_service"));
  } finally {
    loading.value = false;
  }
};

// Watchers
watch(
  () => props.visible,
  (newVal) => {
    if (newVal && props.service) {
      // Mode édition - initialiser avec les données du service
      nextTick(() => {
        form.value = {
          titre: props.service?.titre || "",
          description: props.service?.description || "",
          category_id: props.service?.category_id?.toString() || "",
          annees_experience: props.service?.annees_experience || null,
          competences: props.service?.competences || [],
          localisation: props.service?.localisation || "",
          ville: props.service?.ville || "",
          disponibilite: props.service?.disponibilite || "disponible",
        };

        oldImages.value = props.service?.images
          ? [...props.service.images]
          : [];
        newImages.value = [];
        categorySearch.value =
          props.categories.find(
            (c) => c.id.toString() === props.service?.category_id?.toString(),
          )?.nom || "";
      });
    }
  },
);

watch(
  () => props.service,
  (newService) => {
    if (newService) {
      form.value = {
        titre: newService.titre,
        description: newService.description,
        category_id: newService.category_id.toString(),
        annees_experience: newService.annees_experience,
        competences: newService.competences || [],
        localisation: newService.localisation,
        ville: newService.ville,
        disponibilite: newService.disponibilite,
      };
      oldImages.value = newService.images ? [...newService.images] : [];
      newImages.value = [];
      categorySearch.value =
        props.categories.find(
          (c) => c.id.toString() === newService.category_id.toString(),
        )?.nom || "";
    }
  },
);
</script>
