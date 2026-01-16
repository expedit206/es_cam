<template>
    <transition name="slide-fade">
        
        <div v-if="isSidebarOpen || !isMobile"
            class="bg-white pt-4 shadow-md p-4 overflow-y-auto transition-all h-full h-full min-h-full w-full"
            :class="isMobile ? 'absolute top-0 left-0 h-full z-150 w-full' : 'w-[400px]'">
            <h2 class="text-lg font-semibold text-[var(--espace-vert)] mb-4">Contacts</h2>
            <div v-for="conv in conversations" :key="conv.user_id" @click="$emit('select-conversation', conv.user_id)"
                class="p-2 hover:bg-gray-100 cursor-pointer rounded flex items-center justify-between transition-colors hiddn">
                <div class="flex items-center">
                    <div @click.stop="$emit('view-profile', conv.user_id)"
                        class="w-10 h-10 bg-[var(--espace-or)] rounded-full mr-2 flex items-center justify-center overflow-hidden cursor-pointer">
                        <img v-if="conv.profile_photo" :src="storageUrl + conv.profile_photo" alt="Photo de profil"
                            class="w-full h-full object-cover" />
                        <i v-else class="fas fa-user-circle text-2xl text-gray-500"></i>
                    </div>
                    <div class="min-w-0">
                        <p class="font-semibold text-[var(--espace-vert)] truncate">{{ conv.name }}</p>
                        <div class="text-xs text-[var(--espace-gris)] overflow-wrap break-words max-w-[200px]">
                            <span v-if="conv.last_message_type == 'text'">{{ conv.last_message }}</span>
                            <div v-else class="flex items-center gap-2 text-[var(--espace-gris)]">
                                <i class="fas fa-play-circle text-[var(--espace-vert)] text-sm"></i>
                                <div class="w-16 h-[4px] rounded bg-gray-300 overflow-hidden">
                                    <div class="h-full bg-[var(--espace-vert)] animate-progress"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex items-center">
                    <div v-if="conv.unread_count > 0"
                        class="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mr-2">
                        {{ conv.unread_count }}
                    </div>
                    <div class="text-xs text-[var(--espace-gris)] ml-2 whitespace-nowrap">
                        {{ new Date(conv.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
import { computed } from 'vue';
defineProps<{
    conversations: any[];
    isSidebarOpen: boolean;
    isMobile: boolean;
    storageUrl?: string;
}>();

defineEmits(['select-conversation', 'toggle-sidebar', 'view-profile']);
</script>

<style scoped>
/* Styles inchangés */
</style>