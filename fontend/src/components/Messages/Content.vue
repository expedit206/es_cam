<template>
    <div class="h-full overflow-y-auto flex flex-col">
        <div class="h-full overflow-y-scroll flex-1 p-2 md:p-4 space-y-3 bg-gray-100 z-50 messages-container"
            ref="messagesContainer">
            <div v-for="group in messages" :key="group.date" class="space-y-3">
                <div class="flex justify-center my-4">
                    <span class="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full shadow">
                        {{ group.date }}
                    </span>
                </div>

                <!-- 🔹 Message individuel -->
                <div v-for="message in group.messages" :key="message.id"
                    class="relative p-3 rounded-lg break-words group" :class="{
                        'bg-blue-200 ml-auto max-w-[85%] md:max-w-[70%]': message.sender_id === authStore.user.id,
                        'bg-gray-200 max-w-[85%] md:max-w-[70%]': message.sender_id !== authStore.user.id
                    }">


                    <!-- 🟢 Contenu texte -->
                    <p v-if="message.type === 'text' && message.content"
                        class="text-gray-800 flex items-center gap-2 overflow-wrap break-words">
                        <router-link v-if="message.product?.id"
                            :to="{ name: 'produit', params: { id: message.product.id } }"
                            class="text-blue-500 underline hover:text-blue-700 ml-1">
                            [Produit {{ message.product.nom }}]
                        </router-link>
                        {{ message.content }}
                    </p>

                    <!-- 🟢 Contenu audio -->
                    <audio v-if="message.type === 'audio' && message.content" controls
                        class="w-full  rounded-lg bg-blue-200 p-2">
                        <source :src="message.content" type="audio/webm" class="!bg-blue-200" />
                        Votre navigateur ne supporte pas l'audio.
                    </audio>

                    <!-- 🟢 Contenu image -->
                    <div v-if="message.type === 'image' && message.content" class="rounded-lg overflow-hidden">
                        <img :src="message.content" alt="Image partagée" class="max-w-full h-auto max-h-64 object-cover" @click="viewImage(message.content)" />
                    </div>

                    <!-- 🟢 Heure + statut -->
                    <div class="flex justify-between items-center mt-1 text-xs text-[var(--espace-gris)]">
                        <span>{{ new Date(message.created_at).toLocaleTimeString() }}</span>
                        <span v-if="message.sender_id === authStore.user.id" class="flex items-center space-x-2">
                            <i v-if="message.is_read" class="fas fa-check-double text-green-500" title="Vu"></i>
                            <i v-else class="fas fa-check-double text-gray-400" title="Non vu"></i>
                        </span>
                    </div>

                    <!-- ⋮ Menu d'options -->
                    <div v-if="message.sender_id === authStore.user.id" class="absolute top-2 right-2">
                        <div class="relative" @click.stop="toggleMenu(message.id)">
                            <button class="text-gray-600 hover:text-gray-800 pb-2 
                            cursor-pointer
                            pl-3">
                                <i class="fas fa-ellipsis-v"></i>
                            </button>

                            <!-- Menu déroulant -->
                            <transition name="fade">
                                <div v-if="openMenuId === message.id"
                                    class="absolute right-0 bottom-7  w-28 bg-white rounded-lg shadow-lg border border-gray-200  z-151 ">
                                    <button @click="editMessage(message)" v-if=" message.type==='text'"
                                        class="flex items-center gap-2 w-full px-3 py-2 text-left text-sm  ">
                                        {{t('edit')}}
                                    </button>
                                    <button @click="deleteMessage(message.id)"
                                        class="flex items-center gap-2 w-full px-3 py-2 text-left text-sm ">
                                        {{t('delete')}}
                                    </button>
                                </div>
                            </transition>
                        </div>
                    </div>

                </div>
            </div>

            <div v-if="typingUser" class="flex items-center gap-2 px-4 py-2">
                <i class="fas fa-pen text-[var(--espace-gris)]"></i>
                <span class="text-xs text-[var(--espace-gris)] font-semibold">
                    {{ selectedConversation?.name }} est en train d' écrire... </span>
                                </div>

                                <div v-if="isLoading" class="text-center text-[var(--espace-gris)]">Chargement...</div>
                        </div>
                    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import apiClient from '../../api/index'
import { Message } from '../types/index'
import { useI18n } from '../useI18n';

const { t } = useI18n();

const props = defineProps<{
    messages: { date: string; messages: Message[] }[]
    isLoading: boolean
    typingUser: boolean
    selectedConversation: any
    authStore: any
}>()

const openMenuId = ref<number | null>(null)

const toggleMenu = (id: number) => {
    openMenuId.value = openMenuId.value === id ? null : id
}

// Ferme le menu quand on clique ailleurs
document.addEventListener('click', () => (openMenuId.value = null))


const emit = defineEmits(['mounted', 'edit-message', 'delete-message'])
const messagesContainer = ref<HTMLElement | null>(null)
const toast = useToast()

onMounted(() => {
    if (messagesContainer.value) emit('mounted', messagesContainer.value)
})

const editMessage = (message: Message) => {
    if (message.isTemporary) {
        toast.error("Message en cours d'envoi")
        return
    }
    const newContent = prompt('Modifier le message :', message.content)
    if (newContent && newContent.trim() !== message.content) {
        apiClient
            .put(`/chat/message/${message.id}`, { content: newContent.trim() })
            .then(() => {
                emit('edit-message', { id: message.id, content: newContent.trim() })
            })
            .catch(() => toast.error('Échec de la modification du message'))
    }
}

const deleteMessage = (messageId: number) => {
    const message = props.messages.flatMap((g) => g.messages).find((m) => m.id === messageId)
    if (message?.isTemporary) {
        toast.error('Message en cours d’envoi')
        return
    }

    if (confirm('Voulez-vous vraiment supprimer ce message ?')) {
        apiClient
            .delete(`/chat/message/${messageId}`)
            .then(() => emit('delete-message', messageId))
            .catch(() => toast.error('Échec de la suppression du message'))
    }
}
const viewImage = (url: string) => {
    window.open(url, '_blank');
}
</script>

<style scoped>

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
.action-btn {

    /* @apply w-7 h-7 flex items-center justify-center rounded-full transition-all; */
    width: 1.75rem;
    height: 1.75rem;

    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 9999px;
    transition: all 0.2s;

}

.group:hover .action-btn {
    opacity: 1;
}

@media (max-width: 768px) {

    /* Sur mobile, toujours visibles */
    .action-btn {
        opacity: 1 !important;
    }
}
</style>
