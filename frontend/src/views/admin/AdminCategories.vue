<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <div class="mb-8">
      <router-link
        to="/admin/dashboard"
        class="text-gray-500 hover:text-[var(--espace-vert)] transition-colors mb-4 inline-block"
      >
        <i class="fas fa-arrow-left mr-2"></i> Retour au Dashboard
      </router-link>
      <h1 class="text-3xl font-bold text-gray-800">Gestion des Catégories</h1>
    </div>

    <!-- Quick Add Category -->
    <div class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
      <h2 class="text-lg font-bold text-gray-800 mb-4">
        Ajouter une catégorie
      </h2>
      <div class="flex flex-col gap-4">
        <div class="flex flex-col md:flex-row gap-4">
          <input
            v-model="newCat.nom"
            type="text"
            placeholder="Nom de la catégorie"
            class="flex-grow px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[var(--espace-vert)]"
          />
          <select
            v-model="newCat.type"
            class="px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[var(--espace-vert)]"
          >
            <option value="product">Produit</option>
            <option value="service">Service</option>
          </select>
        </div>
        <div class="flex flex-col md:flex-row items-center gap-4">
          <div class="w-full md:flex-grow">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Image de la catégorie</label
            >
            <input
              type="file"
              @change="handleImageUpload"
              accept="image/*"
              class="w-full px-4 py-2 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[var(--espace-vert)] text-sm"
            />
          </div>
          <button
            @click="addCategory"
            :disabled="isSubmitting"
            class="w-full md:w-auto px-8 py-3 bg-[var(--espace-vert)] text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-green-500/20 transition-all disabled:opacity-50"
          >
            <span v-if="isSubmitting"
              ><i class="fas fa-spinner animate-spin mr-2"></i
              >Chargement...</span
            >
            <span v-else>Ajouter</span>
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Product Categories -->
      <div class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h2
          class="text-xl font-bold text-gray-800 mb-6 flex items-center justify-between"
        >
          <span>Catégories Produits</span>
          <span
            class="text-sm bg-orange-100 text-orange-600 px-2 py-1 rounded-full uppercase"
            >{{ adminStore.categories.products.length }}</span
          >
        </h2>
        <div class="space-y-3">
          <div
            v-for="cat in adminStore.categories.products"
            :key="cat.id"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group hover:bg-gray-100 transition-colors"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 rounded-xl bg-gray-200 overflow-hidden flex-shrink-0"
              >
                <img
                  v-if="cat.image"
                  :src="cat.image"
                  class="w-full h-full object-cover"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center text-gray-400"
                >
                  <i class="fas fa-image"></i>
                </div>
              </div>
              <div class="font-medium text-gray-700">{{ cat.nom }}</div>
            </div>
            <div
              class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <button
                @click="editCategory(cat, 'product')"
                class="p-2 text-blue-600 hover:bg-white rounded-lg transition-all"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button
                @click="deleteCategory(cat.id, 'product')"
                class="p-2 text-red-600 hover:bg-white rounded-lg transition-all"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Service Categories -->
      <div class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h2
          class="text-xl font-bold text-gray-800 mb-6 flex items-center justify-between"
        >
          <span>Catégories Services</span>
          <span
            class="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded-full uppercase"
            >{{ adminStore.categories.services.length }}</span
          >
        </h2>
        <div class="space-y-3">
          <div
            v-for="cat in adminStore.categories.services"
            :key="cat.id"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group hover:bg-gray-100 transition-colors"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 rounded-xl bg-gray-200 overflow-hidden flex-shrink-0"
              >
                <img
                  v-if="cat.image"
                  :src="cat.image"
                  class="w-full h-full object-cover"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center text-gray-400"
                >
                  <i class="fas fa-image"></i>
                </div>
              </div>
              <div class="font-medium text-gray-700">{{ cat.nom }}</div>
            </div>
            <div
              class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <button
                @click="editCategory(cat, 'service')"
                class="p-2 text-blue-600 hover:bg-white rounded-lg transition-all"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button
                @click="deleteCategory(cat.id, 'service')"
                class="p-2 text-red-600 hover:bg-white rounded-lg transition-all"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Category Modal -->
    <div
      v-if="editModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4"
    >
      <div
        class="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up"
      >
        <div
          class="p-6 border-b border-gray-100 flex justify-between items-center"
        >
          <h3 class="text-xl font-bold text-gray-800">Modifier la catégorie</h3>
          <button
            @click="closeEditModal"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Nom de la catégorie</label
            >
            <input
              v-model="editForm.nom"
              type="text"
              class="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[var(--espace-vert)]"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Image actuelle</label
            >
            <div
              class="w-full h-32 bg-gray-100 rounded-2xl overflow-hidden mb-2 flex items-center justify-center"
            >
              <img
                v-if="editForm.currentImage && !editForm.previewImage"
                :src="editForm.currentImage"
                class="w-full h-full object-cover"
              />
              <img
                v-if="editForm.previewImage"
                :src="editForm.previewImage"
                class="w-full h-full object-cover"
              />
              <div
                v-if="!editForm.currentImage && !editForm.previewImage"
                class="text-gray-400"
              >
                <i class="fas fa-image text-3xl"></i>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Changer l'image</label
            >
            <input
              type="file"
              @change="handleEditImageUpload"
              accept="image/*"
              class="w-full px-4 py-2 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[var(--espace-vert)] text-sm"
            />
          </div>
        </div>

        <div class="p-6 pt-0 flex gap-3">
          <button
            @click="closeEditModal"
            class="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-colors"
          >
            Annuler
          </button>
          <button
            @click="submitEdit"
            :disabled="isSubmitting"
            class="flex-1 px-4 py-3 bg-[var(--espace-vert)] text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-green-500/20 transition-all disabled:opacity-50"
          >
            <span v-if="isSubmitting"
              ><i class="fas fa-spinner animate-spin mr-2"></i
              >Enregistrement...</span
            >
            <span v-else>Enregistrer</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { useAdminStore } from "../../stores/admin";

const adminStore = useAdminStore();
const newCat = ref({ nom: "", type: "product" });
const selectedImage = ref<File | null>(null);
const isSubmitting = ref(false);

// Edit Modal State
const editModalOpen = ref(false);
const editForm = reactive({
  id: "",
  nom: "",
  type: "product",
  currentImage: "",
  imageFile: null as File | null,
  previewImage: "",
});

onMounted(() => {
  adminStore.fetchCategories();
});

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    selectedImage.value = target.files[0];
  }
};

const handleEditImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    editForm.imageFile = target.files[0];
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      editForm.previewImage = e.target?.result as string;
    };
    reader.readAsDataURL(target.files[0]);
  }
};

const addCategory = async () => {
  if (!newCat.value.nom) return;
  isSubmitting.value = true;
  try {
    await adminStore.createCategory(
      newCat.value.nom,
      newCat.value.type as "product" | "service",
      selectedImage.value,
    );
    newCat.value.nom = "";
    selectedImage.value = null;
    // Reset file input
    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  } catch (e) {
    alert("Erreur lors de l'ajout de la catégorie");
  } finally {
    isSubmitting.value = false;
  }
};

const editCategory = (cat: any, type: string) => {
  editForm.id = cat.id;
  editForm.nom = cat.nom;
  editForm.type = type;
  editForm.currentImage = cat.image;
  editForm.imageFile = null;
  editForm.previewImage = "";
  editModalOpen.value = true;
};

const closeEditModal = () => {
  editModalOpen.value = false;
  editForm.imageFile = null;
  editForm.previewImage = "";
};

const submitEdit = async () => {
  if (!editForm.nom) return;
  isSubmitting.value = true;
  try {
    await adminStore.updateCategory(
      editForm.id,
      editForm.nom,
      editForm.type as "product" | "service",
      editForm.imageFile,
    );
    closeEditModal();
  } catch (e) {
    alert("Erreur lors de la modification");
  } finally {
    isSubmitting.value = false;
  }
};

const deleteCategory = async (id: string, type: string) => {
  if (confirm("Voulez-vous vraiment supprimer cette catégorie ?")) {
    try {
      await adminStore.deleteCategory(id, type as "product" | "service");
    } catch (e) {
      alert("Erreur lors de la suppression");
    }
  }
};
</script>
