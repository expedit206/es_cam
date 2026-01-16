<template>
    <div>
        <!-- Bouton pour ouvrir le formulaire -->
        <div v-if="!isFormVisible" class=" flex justify-end">

            <button @click="showForm" class="bg-green-100 hover:bg-green-300  p-1 rounded-lg transition-colors px-2  ">
                <i class="fas fa-comment-dots"></i> </button>
        </div>

        <!-- Formulaire -->
        <div v-else class="bg-white rounded-lg p-3 shadow-lg border">
            <!-- En-tête avec bouton fermer -->
            <button @click="hideForm" class="text-gray-500 hover:text-gray-700">
                <i class="fas fa-times"></i>
            </button>

            <form @submit.prevent="submitReview" class="space-y-1">
                <!-- Étoiles -->
                <div class="flex justify-center space-x-1">
                    <button v-for="star in 5" :key="star" type="button" @click="form.rating = star"
                        class="text-2xl transition-colors"
                        :class="star <= form.rating ? 'text-yellow-400' : 'text-gray-300'">
                        ★
                    </button>
                </div>

                <!-- Commentaire -->
                <textarea v-model="form.comment" rows="1" placeholder="Votre commentaire..."
                    class="w-full p-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500"
                    required></textarea>

                <!-- Actions -->
                <div class="flex gap-2">
                    <button type="button" @click="hideForm"
                        class="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                        Annuler
                    </button>
                    <button type="submit" :disabled="isSubmitting || !form.rating || !form.comment.trim()"
                        class="flex-1 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed">
                        <span v-if="isSubmitting">
                            <i class="fas fa-spinner fa-spin mr-1"></i>
                        </span>
                        <span v-else>Envoyer</span>
                    </button>
                </div>
            </form>
        </div>

        <!-- Overlay mobile -->
        <div v-if="isFormVisible" class="fixed  bg-black bg-opacity-50 z-40 lg:hidden" @click="hideForm"></div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import apiClient from '../../api/index';

interface Props {
    serviceId: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
    (e: 'review-submitted'): void;
}>();

// États
const isFormVisible = ref(false);
const isSubmitting = ref(false);

const form = reactive({
    rating: 0,
    comment: ''
});

// Méthodes
const showForm = () => {
    isFormVisible.value = true;
    if (window.innerWidth < 1024) {
        document.body.style.overflow = 'hidden';
    }
};

const hideForm = () => {
    isFormVisible.value = false;
    document.body.style.overflow = '';
    resetForm();
};

const submitReview = async () => {
    if (!form.rating || !form.comment.trim() || isSubmitting.value) return;

    try {
        isSubmitting.value = true;
        const response = await apiClient.post(`/services/${props.serviceId}/reviews`, form);

        if (response.data.success) {
            emit('review-submitted');
            resetForm();
            hideForm();
        }
    } catch (err: any) {
        alert(err.response?.data?.message || 'Erreur');
    } finally {
        isSubmitting.value = false;
    }
};

const resetForm = () => {
    form.rating = 0;
    form.comment = '';
};
</script>

<style scoped>
.fixed {
    z-index: 40;
}
</style>