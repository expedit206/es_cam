<template>
    <div
        class="bg-white rounded-lg sm:rounded-xl shadow-xs sm:shadow-sm border border-gray-100 hover:shadow-md sm:hover:shadow-lg transition-all duration-300 overflow-hidden group hover:-translate-y-0.5 sm:hover:-translate-y-1 active:scale-95 active:transition-none">
        <!-- Section image optimisée pour mobile -->
        <div class="relative aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
            <router-link :to="`/produits/${produit?.id}`" class="block h-full w-full">
                <!-- Slider d'images -->
                <div class="flex h-full w-full slider-container"
                    :style="{ transform: `translateX(-${currentSlideIndex * 100}%)` }"
                    @touchstart="handleTouchStart($event)" @touchmove="handleTouchMove($event)"
                    @touchend="handleTouchEnd">

                    <div v-for="(photo, index) in produit?.photos" :key="index"
                        class="w-full h-full flex-shrink-0 flex items-center justify-center bg-white p-2 sm:p-3">
                        <img :src="photo"
                            class="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                            :alt="t('product_image_alt', { name: produit?.nom, index: index + 1 })" loading="lazy" />
                    </div>

                    <div v-if="!produit?.photos || produit?.photos.length === 0"
                        class="w-full h-full flex items-center justify-center text-gray-300">
                        <i class="fas fa-image text-2xl sm:text-3xl"></i>
                    </div>
                </div>

                <!-- Overlay au survol -->
                <!-- <div class="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300"></div> -->
            </router-link>

            <!-- Badges optimisés -->
            <div class="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 flex flex-col gap-1">
                <!-- BADGE DE PROMOTION - NOUVEAU -->
                <span v-if="produit?.is_promoted"
                    class="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-[9px] xs:text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 xs:px-2 xs:py-1 sm:px-2.5 sm:py-1.5 rounded-full shadow-sm flex items-center gap-0.5 xs:gap-1 backdrop-blur-sm ">
                    <i class="fas fa-bolt text-[7px] xs:text-[8px]"></i>
                    <span class="hidden xs:inline">PROMU</span>
                </span>

                <span v-if="produit?.revendable"
                    class="bg-[var(--espace-or)] text-[var(--espace-vert)] text-[9px] xs:text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 xs:px-2 xs:py-1 sm:px-2.5 sm:py-1.5 rounded-full shadow-sm flex items-center gap-0.5 xs:gap-1 backdrop-blur-sm">
                    <i class="fas fa-handshake text-[7px] xs:text-[8px]"></i>
                    <span class="hidden xs:inline">Collab</span>
                </span>

                <span v-if="produit?.boosted"
                    class="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-[9px] xs:text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 xs:px-2 xs:py-1 sm:px-2.5 sm:py-1.5 rounded-full shadow-sm flex items-center gap-0.5 xs:gap-1">
                    <i class="fas fa-rocket text-[7px] xs:text-[8px]"></i>
                    <span class="hidden xs:inline">{{ t('boosted') }}</span>
                </span>
            </div>

            <!-- Menu d'actions -->
            <div class="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 " v-if="user?.id == produit?.user?.id">
                <div class="relative">
                    <button @click.stop="toggleMenu"
                        class="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 bg-white/90 backdrop-blur-sm text-gray-600 rounded-md xs:rounded-lg flex items-center justify-center hover:bg-white hover:text-[var(--espace-vert)] transition-all duration-200 shadow-sm hover:shadow-md">
                        <i class="fas fa-ellipsis-h text-[10px] xs:text-xs sm:text-sm"></i>
                    </button>

                    <div v-if="isMenuOpen"
                        class="absolute right-0 top-full mt-1 w-32 xs:w-36 sm:w-40 bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 py-1 z-50 animate-fade-in">
                        <button @click="handleEdit"
                            class="w-full text-left px-3 py-1.5 xs:py-2 text-xs hover:bg-green-50 transition-colors flex items-center gap-2 group">
                            <i class="fas fa-edit text-[10px] xs:text-xs text-gray-400 group-hover:text-green-600"></i>
                            <span>{{ t('edit') }}</span>
                        </button>

                        <div class="border-t border-gray-100 my-1"></div>
                        <button @click="handleDelete"
                            class="w-full text-left px-3 py-1.5 xs:py-2 text-xs hover:bg-red-50 transition-colors flex items-center gap-2 group">
                            <i class="fas fa-trash text-[10px] xs:text-xs text-gray-400 group-hover:text-red-600"></i>
                            <span>{{ t('delete') }}</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Indicateurs de slide -->
            <div v-if="produit?.photos && produit?.photos.length > 1"
                class="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 flex gap-1">
                <div v-for="(_, index) in produit?.photos" :key="index"
                    class="w-1 h-1 xs:w-1.5 xs:h-1.5 rounded-full transition-all duration-300"
                    :class="index === currentSlideIndex ? 'bg-white' : 'bg-white/50'"></div>
            </div>
        </div>

        <!-- Contenu du produit -->
        <div class="p-2 xs:p-3 sm:p-4">
            <!-- En-tête avec nom et prix -->
            <div class="flex items-start justify-between gap-1.5 xs:gap-2 ">
                <h3
                    class="font-semibold text-gray-900 flex-1 line-clamp-2 text-xs xs:text-sm sm:text-md leading-tight ">
                    <router-link :to="`/produits/${produit?.id}`"
                        class="hover:text-[var(--espace-vert)] transition-colors duration-200">
                        {{ produit?.nom }}
                    </router-link>
                </h3>
            </div>


            <!-- Description et stock -->
            <div class="">
                <p class="text-[10px] sm:text-md xs:text-xs text-gray-600 line-clamp-2 leading-relaxed mb-1 xs:mb-1.5">
                    {{ produit?.description || t('no description') }}
                </p>
                <div class="flex items-center justify-between">


                    <span class="text-[9px] xs:text-[10px] text-gray-500 sm:text-md">
                        {{ t('stock') }}:{{ produit?.quantite }}
                    </span>
                    <span class="text-[9px] xs:text-[10px] text-gray-500 truncate sm:text-md">
                        {{ produit?.ville }}
                    </span>
                </div>
            </div>


            <div class=" flex justify-between items-center w-full ">
                <p class="text-[12px] xs:text-base sm:text-md font-bold text-[var(--espace-vert)] leading-none">
                    {{ formatPrice(produit?.prix) }}
                </p>

                <!-- Indicateur promotion dans le footer - NOUVEAU -->
                <div class="flex items-center gap-1">
                    <!-- <span v-if="produit?.is_promoted"
                        class="text-[8px] xs:text-[9px] text-purple-600 font-medium flex items-center gap-0.5">
                        <i class="fas fa-bolt text-[6px] xs:text-[7px]"></i>
                    </span> -->

                    <span
                        class="inline-block bg-green-50 text-gray-700 text-[9px] xs:text-[10px] font-medium px-1.5 py-0.5 xs:px-2 xs:py-1 rounded-full truncate ">
                        {{ truncateText(produit?.condition, 20) }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from '../useI18n';
// import { Product } from "../types/index";
import { Product } from "../types";
import { useAuthStore } from "../../stores/Auth";

const { t } = useI18n();

// Props
interface Props {
    produit: Product;
    currentSlideIndexes?: { [key: string]: number };
}


const user = computed(()=>useAuthStore().user)
const props = defineProps<Props>();

// Emits
const emit = defineEmits<{
    edit: [product: Product];
    delete: [productId: string];
    slideChange: [productId: string, index: number];
    menuToggle: [productId: string | null];
}>();

// États locaux
const isMenuOpen = ref(false);
const currentSlideIndex = ref(0);
const touchStartX = ref(0);
const touchEndX = ref(0);

// Computed
const slideIndex = computed(() => {
    if (props.currentSlideIndexes && props.currentSlideIndexes[props.produit?.id] !== undefined) {
        return props.currentSlideIndexes[props.produit?.id];
    }
    return currentSlideIndex.value;
});

// Méthodes
const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
    emit('menuToggle', isMenuOpen.value ? props.produit?.id : null);
};

const handleEdit = () => {
    emit('edit', props.produit);
    isMenuOpen.value = false;
};

const handleDelete = () => {
    if (confirm("Voulez-vous vraiment supprimer ce produit ?")) {
        emit('delete', props.produit?.id);
        isMenuOpen.value = false;
    }
};

const nextSlide = () => {
    const maxIndex = props.produit?.photos?.length ? props.produit?.photos.length - 1 : 0;
    const newIndex = Math.min(slideIndex.value + 1, maxIndex);
    updateSlideIndex(newIndex);
};

const prevSlide = () => {
    const newIndex = Math.max(slideIndex.value - 1, 0);
    updateSlideIndex(newIndex);
};

const updateSlideIndex = (index: number) => {
    if (props.currentSlideIndexes) {
        emit('slideChange', props.produit?.id, index);
    } else {
        currentSlideIndex.value = index;
    }
};

const handleTouchStart = (e: TouchEvent) => {
    touchStartX.value = e.touches[0].clientX;
};

const handleTouchMove = (e: TouchEvent) => {
    touchEndX.value = e.touches[0].clientX;
};

const handleTouchEnd = () => {
    const diff = touchStartX.value - touchEndX.value;
    if (diff > 50) {
        nextSlide();
    } else if (diff < -50) {
        prevSlide();
    }
    touchStartX.value = 0;
    touchEndX.value = 0;
};

const formatPrice = (price: number) => {
    return price + 'Fcfa';
};

const truncateText = (text: string, maxLength: number) => {
    if (text?.length <= maxLength) return text;
    return text?.substring(0, maxLength) + '...';
};

// Fermer le menu quand on clique ailleurs
const handleClickOutside = (event: Event) => {
    if (!(event.target as Element).closest('.relative')) {
        isMenuOpen.value = false;
        emit('menuToggle', null);
    }
};

// Écouter les clics en dehors du composant
if (typeof window !== 'undefined') {
    document.addEventListener('click', handleClickOutside);
}
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.slider-container {
    display: flex;
    transition: transform 0.3s ease;
    width: 100%;
    height: 100%;
    touch-action: pan-y;
}

.animate-fade-in {
    animation: fadeIn 0.15s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-2px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Breakpoints personnalisés */
/* Extra small (xs): 375px+ */
/* Small (sm): 640px+ */
</style>