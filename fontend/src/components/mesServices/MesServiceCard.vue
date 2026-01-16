<template>
    <div
        class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden group hover:-translate-y-1" v-if="service">

        <!-- Section image avec ratio fixe -->
        <div class="relative aspect-[4/3] overflow-hidden" v-if="service">
            <router-link :to="`/services/${service.id}`"
                class="h-full w-full flex items-center justify-center bg-gray-50">
                <div v-if="service.images && service.images.length > 0" class="h-full w-full">
                    <img :src="service.images[0]"
                        class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        :alt="service.titre" />
                </div>
                <div v-else class="text-gray-300 text-3xl">
                    <i class="fas fa-concierge-bell"></i>
                </div>
            </router-link>

            <!-- Badge disponibilité -->
            <div class="absolute top-2 left-2">
                <span v-if="service.disponibilite === 'disponible'"
                    class="bg-green-500 text-white text-[10px] font-medium px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
                    <i class="fas fa-check-circle text-[8px]"></i>
                    <span class="hidden xs:inline">Dispo</span>
                </span>
                <span v-else
                    class="bg-red-500 text-white text-[10px] font-medium px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
                    <i class="fas fa-times-circle text-[8px]"></i>
                    <span class="hidden xs:inline">Indispo</span>
                </span>
            </div>

            <!-- Menu d'actions -->
            <div class="absolute top-2 right-2">
                <div class="relative">
                    <button @click.stop="toggleMenu"
                        class="w-7 h-7 bg-white/90 backdrop-blur-sm text-gray-600 rounded-lg flex items-center justify-center hover:bg-white hover:text-green-600 transition-all duration-200 shadow-sm">
                        <i class="fas fa-ellipsis-h text-xs"></i>
                    </button>

                    <div v-if="showMenu"
                        class="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 animate-fade-in">
                        <button @click="handleEdit"
                            class="w-full text-left px-3 py-1 text-xs hover:bg-green-50 transition-colors flex items-center gap-2">
                            <i class="fas fa-edit text-xs"></i>
                            <span>Modifier</span>
                        </button>

                        <button @click="handleToggleAvailability"
                            class="w-full text-left px-3 py-1 text-xs hover:bg-blue-50 transition-colors flex items-center gap-2">
                            <i :class="service.disponibilite === 'disponible' ? 'fas fa-pause' : 'fas fa-play'"
                                class="text-xs"></i>
                            <span>{{ service.disponibilite === 'disponible' ? 'Désactiver' : 'Activer' }}</span>
                        </button>

                        <div class="border-t border-gray-200 my-1"></div>
                        <button @click="handleDelete"
                            class="w-full text-left px-3 py-1 text-xs hover:bg-red-50 transition-colors flex items-center gap-2">
                            <i class="fas fa-trash text-xs"></i>
                            <span>Supprimer</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Contenu du service -->
        <div class="p-3">
            <!-- Titre -->
            <h3 class="font-semibold text-gray-900 text-sm leading-tight mb-2 line-clamp-1">
                {{ service.titre }}
            </h3>

            <!-- Note et étoiles -->
            <div class="flex items-center gap-2 mb-1">
                <!-- Étoiles -->
                <div class="flex items-center gap-0.5">
                    <i v-for="star in 5" :key="star" :class="[
                        'text-[4px]',
                        star <= Math.round(service.note_moyenne || 0)
                            ? 'fas fa-star text-yellow-400'
                            : 'far fa-star text-gray-300'
                    ]">
                    </i>
                </div>

                <!-- Moyenne et nombre d'avis -->
                <div class="flex items-center gap-1 text-xs text-gray-600">
                    <span class="font-semibold text-gray-900">{{ service.note_moyenne }}</span>
                    <span>({{ service.nombre_avis || 0 }})</span>
                </div>
            </div>

            <!-- Description -->
            <p class="text-xs text-gray-600 mb-2 line-clamp-2 leading-relaxed">
                {{ service.description || 'Aucune description' }}
            </p>

            <!-- Compétences -->
            <div v-if="service.competences && service.competences.length > 0" class="mb-2">
                <div class="flex flex-wrap gap-1">
                    <span v-for="(competence, index) in service.competences.slice(0, 2)" :key="index"
                        class="bg-gray-100 text-gray-700 text-[9px] px-1.5 py-0.5 rounded">
                        {{ competence }}
                    </span>
                    <span v-if="service.competences.length > 2"
                        class="bg-gray-100 text-gray-500 text-[9px] px-1.5 py-0.5 rounded">
                        +{{ service.competences.length - 2 }}
                    </span>
                </div>
            </div>

            <!-- Catégorie et expérience -->
            <div class="flex items-center justify-between mb-2">
                <span v-if="service.category?.nom"
                    class="inline-block bg-gray-100 text-gray-700 text-[10px] font-medium px-2 py-0.5 rounded-full truncate max-w-[60%]">
                    {{ service.category.nom }}
                </span>

                <span v-if="service.annees_experience"
                    class="text-[10px] text-gray-500 flex items-center gap-1 whitespace-nowrap">
                    <i class="fas fa-briefcase text-[8px]"></i>
                    {{ service.annees_experience }}an{{ service.annees_experience > 1 ? 's' : '' }}
                </span>
            </div>

            <!-- Localisation -->
            <div class="text-[10px] text-gray-500 flex items-center gap-1 truncate">
                <i class="fas fa-map-marker-alt text-[8px]"></i>
                <span class="truncate">{{ service.ville }}{{ service.localisation ? ', ' + service.localisation : ''
                }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import type { Service } from '../types/index';

interface Props {
    service: Service;
}

const props = defineProps<Props>();
const emit = defineEmits<{
    (e: 'edit', service: Service): void;
    (e: 'delete', serviceId: string): void;
    (e: 'toggle-availability', serviceId: string): void;
}>();

const showMenu = ref(false);

const toggleMenu = () => {
    showMenu.value = !showMenu.value;
};

const handleEdit = () => {
    emit('edit', props.service);
    showMenu.value = false;
};

const handleDelete = () => {
    if (confirm('Voulez-vous vraiment supprimer ce service ?')) {
        emit('delete', props.service.id.toString());
    }
    showMenu.value = false;
};

const handleToggleAvailability = () => {
    emit('toggle-availability', props.service.id.toString());
    showMenu.value = false;
};

// Fermer le menu en cliquant ailleurs
const handleClickOutside = (event: MouseEvent) => {
    if (showMenu.value) {
        showMenu.value = false;
    }
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-5px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* Pour les très petits écrans */
@media (max-width: 360px) {
    .min-h-\[2\.5rem\] {
        min-height: 2rem;
    }

    .min-h-\[2rem\] {
        min-height: 1.5rem;
    }
}
</style>