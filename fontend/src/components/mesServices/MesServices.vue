<template>
    <div>
        <!-- Résultats de recherche -->
        <div v-if="hasActiveFilters" class="mb-4 sm:mb-6">
            <p class="text-gray-600 text-sm sm:text-base">
                {{ t('services_found', { count: services.length }) }}
            </p>
        </div>

        <!-- Grille des services -->
        <div v-if="isLoading" class="flex justify-center py-12 sm:py-16">
            <div class="text-center">
                <div
                    class="w-12 h-12 sm:w-16 sm:h-16 border-4 border-[var(--espace-vert)] border-t-transparent rounded-full animate-spin mx-auto mb-3 sm:mb-4">
                </div>
                <p class="text-gray-600 text-sm sm:text-base">{{ t('loading_services') }}</p>
            </div>
        </div>

        <div v-else-if="services.length"
            class="grid grid-cols-2 md:grid-cols-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6 pb-12 sm:pb-16">
            <ServiceCard v-for="service in services" :key="service?.id" :service="service"
                @edit="$emit('edit-service', service)" @delete="$emit('delete-service', service?.id)"
                @toggle-availability="$emit('toggle-availability', service?.id)" />
        </div>

        <!-- États vides -->
        <div v-else-if="hasActiveFilters" class="text-center py-12 sm:py-16 lg:py-20">
            <div
                class="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-sm border border-gray-100 max-w-md mx-auto">
                <div
                    class="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 lg:mb-8">
                    <i class="fas fa-search text-gray-400 text-2xl sm:text-3xl lg:text-4xl"></i>
                </div>
                <h3 class="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">{{ t('no_services_found') }}</h3>
                <p class="text-gray-600 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8">
                    {{ t('no_services_match_criteria') }}
                </p>
                <button @click="$emit('reset-filters')"
                    class="bg-[var(--espace-vert)] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 sm:gap-3 mx-auto group w-full sm:w-auto">
                    <i class="fas fa-redo text-sm sm:text-lg group-hover:scale-110 transition-transform"></i>
                    <span class="text-sm sm:text-base lg:text-lg">{{ t('reset') }}</span>
                </button>
            </div>
        </div>

        <div v-else class="text-center py-12 sm:py-16 lg:py-20">
            <div
                class="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-sm border border-gray-100 max-w-md mx-auto">
                <div
                    class="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-green-100 to-green-50 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 lg:mb-8">
                    <i class="fas fa-concierge-bell text-[var(--espace-vert)] text-2xl sm:text-3xl lg:text-4xl"></i>
                </div>
                <h3 class="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">{{ t('no_services') }}</h3>
                <p class="text-gray-600 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8">
                    {{ t('start_by_adding_first_service') }}
                </p>
                <button @click="$emit('open-add-modal')"
                    class="bg-[var(--espace-vert)] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 sm:gap-3 mx-auto group w-full sm:w-auto">
                    <i class="fas fa-plus-circle text-sm sm:text-lg group-hover:scale-110 transition-transform"></i>
                    <span class="text-sm sm:text-base lg:text-lg">{{ t('create_service') }}</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { Service } from '../types/index';
import ServiceCard from '../mesServices/MesServiceCard.vue';
import { useI18n } from '../useI18n';
const { t } = useI18n();

defineProps<{
    services: Service[];
    isLoading: boolean;
    hasActiveFilters: boolean;
    searchQuery: string;
}>();

defineEmits<{
    'edit-service': [service: Service];
    'delete-service': [serviceId: string];
    'toggle-availability': [serviceId: string];
    'reset-filters': [];
    'open-add-modal': [];
}>();
</script>