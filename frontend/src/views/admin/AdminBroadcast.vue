<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <div class="mb-8">
      <router-link
        to="/admin/dashboard"
        class="text-gray-500 hover:text-[var(--espace-vert)] transition-colors mb-4 inline-block"
      >
        <i class="fas fa-arrow-left mr-2"></i> Retour au Dashboard
      </router-link>
      <h1 class="text-3xl font-bold text-gray-800">Diffusion de Message</h1>
    </div>

    <div
      class="max-w-2xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 p-8"
    >
      <div
        class="mb-6 bg-blue-50 text-blue-800 p-4 rounded-xl flex items-start gap-3"
      >
        <i class="fas fa-info-circle mt-1"></i>
        <div>
          <h3 class="font-bold">Information</h3>
          <p class="text-sm">
            Ce message sera envoyé individuellement à tous les utilisateurs
            enregistrés. Lorsqu'un utilisateur répondra, sa réponse apparaîtra
            dans votre messagerie privée habituelle.
          </p>
        </div>
      </div>

      <form @submit.prevent="sendBroadcast" class="space-y-6">
        <!-- Message Type -->
        <div>
          <label class="block text-gray-700 font-bold mb-2"
            >Type de message</label
          >
          <div class="flex gap-4">
            <label
              class="flex items-center gap-2 cursor-pointer p-3 rounded-xl border"
              :class="
                messageType === 'text'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-gray-50 border-gray-200'
              "
            >
              <input
                type="radio"
                v-model="messageType"
                value="text"
                class="text-[var(--espace-vert)] focus:ring-[var(--espace-vert)]"
              />
              <i class="fas fa-comment-alt"></i> Texte
            </label>
            <label
              class="flex items-center gap-2 cursor-pointer p-3 rounded-xl border"
              :class="
                messageType === 'image'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-gray-50 border-gray-200'
              "
            >
              <input
                type="radio"
                v-model="messageType"
                value="image"
                class="text-[var(--espace-vert)] focus:ring-[var(--espace-vert)]"
              />
              <i class="fas fa-image"></i> Image + Texte
            </label>
          </div>
        </div>

        <!-- Content -->
        <div>
          <label class="block text-gray-700 font-bold mb-2">Message</label>
          <textarea
            v-model="messageContent"
            rows="6"
            class="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[var(--espace-vert)] transition-all resize-none"
            placeholder="Écrivez votre annonce ici..."
            required
          ></textarea>
        </div>

        <!-- Image Upload -->
        <div v-if="messageType === 'image'" class="space-y-2">
          <label class="block text-gray-700 font-bold mb-2">Image</label>
          <div
            class="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors relative"
            @click="$refs.fileInput.click()"
          >
            <input
              type="file"
              ref="fileInput"
              accept="image/*"
              class="hidden"
              @change="handleFileSelect"
            />

            <div v-if="imagePreview" class="relative inline-block">
              <img :src="imagePreview" class="max-h-48 rounded-lg mx-auto" />
              <button
                @click.stop="clearImage"
                class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm shadow-md"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div v-else class="text-gray-500">
              <i class="fas fa-cloud-upload-alt text-3xl mb-2"></i>
              <p>Cliquez pour ajouter une image</p>
            </div>
          </div>
        </div>

        <!-- Submit -->
        <button
          type="submit"
          class="w-full bg-[var(--espace-vert)] text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-900/10 hover:shadow-xl hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          :disabled="isLoading || (messageType === 'image' && !selectedFile)"
        >
          <i v-if="isLoading" class="fas fa-spinner fa-spin"></i>
          <span v-else>Envoyer à tous</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import apiClient from "../../api/index";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";

const toast = useToast();
const router = useRouter();

const messageType = ref<"text" | "image">("text");
const messageContent = ref("");
const selectedFile = ref<File | null>(null);
const imagePreview = ref<string | null>(null);
const isLoading = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    selectedFile.value = input.files[0];
    imagePreview.value = URL.createObjectURL(selectedFile.value);
  }
};

const clearImage = () => {
  selectedFile.value = null;
  imagePreview.value = null;
  if (fileInput.value) fileInput.value.value = "";
};

const sendBroadcast = async () => {
  if (
    !confirm(
      "Êtes-vous sûr de vouloir envoyer ce message à TOUS les utilisateurs ?",
    )
  )
    return;

  isLoading.value = true;
  try {
    const formData = new FormData();
    formData.append("content", messageContent.value);
    if (messageType.value === "image" && selectedFile.value) {
      formData.append("type", "image");
      formData.append("image", selectedFile.value);
    } else {
      formData.append("type", "text");
    }

    const response = await apiClient.post("/admin/chat/broadcast", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    toast.success(
      `Message envoyé avec succès (${response.data.count} destinataires)`,
    );
    router.push("/admin/dashboard");
  } catch (error: any) {
    console.error(error);
    toast.error(error.response?.data?.message || "Erreur lors de l'envoi");
  } finally {
    isLoading.value = false;
  }
};
</script>
