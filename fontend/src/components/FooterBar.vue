<!-- src/components/FooterNav.vue -->
<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/Auth';
import { useBadgeStore } from '../stores/badgeStore'; // Renommé
import { useI18n } from '../components/useI18n';

const { t } = useI18n();

const authStore = useAuthStore();
const badgeStore = useBadgeStore(); // Renommé
const router = useRouter();
const animateReventeBadge = ref(false);
const animateMessagesBadge = ref(false);
const animateParrainageBadge = ref(false);

// Initialiser les badges au montage du composant
onMounted(async () => {
    if (authStore.user) {
        await badgeStore.fetchBadgeCounts();
    }
});

const navLinks = computed(() => {
    if (!authStore.user) {
        return [
            { to: '/', label: t('Home'), icon: 'fa-home' },
            {
                to: '/market-place', label: t('Explore'),
                icon: 'fa-magnifying-glass'

            },
            { to: '/login', label: t('Login'), icon: 'fa-sign-in-alt' },
            { to: '/register', label: t('Register'), icon: 'fa-user-plus' },
        ];
    }

    return [
        {
            to: '/acceuil',
            label: t('Home'),
            icon: 'fa-home',
            badge: badgeStore.badgeCounts.parrainages,
            badgeKey: 'parrainages'
        },
        {
            to: '/market-place', label: t('explorer'),
            icon: 'fa-magnifying-glass'

 },
        {
            to: '/gallery',
            label: t('Gallery'),
            icon: 'fa-circle-plus',
            featured: true
        },
        {
            to: '/messages',
            label: t('Messages'),
            icon: 'fa-comment-dots',
            badge: badgeStore.badgeCounts.messages,
        },
        {
            to: '/reventes',
            label: t('Reventes'),
            icon: 'fa-handshake',
            badge: badgeStore.badgeCounts.reventes,
            badgeKey: 'reventes'
        },
        
    ];
});

// Fonction pour obtenir le badge en fonction de la route
const getBadgeForRoute = (route: string) => {
    switch (route) {
        case '/messages':
            return badgeStore.badgeCounts.messages;
        case '/reventes':
            return badgeStore.badgeCounts.reventes;
        case '/parrainage':
            return badgeStore.badgeCounts.parrainages;
        default:
            return 0;
    }
};

// Fonction pour obtenir l'état d'animation en fonction de la route
const getAnimateStateForRoute = (route: string) => {
    switch (route) {
        case '/reventes':
            return animateReventeBadge.value;
        case '/messages':
            return animateMessagesBadge.value;
        case '/parrainage':
            return animateParrainageBadge.value;
        default:
            return false;
    }
};

// Watchers pour animer les badges
watch(
    () => badgeStore.badgeCounts.reventes,
    (newValue, oldValue) => {
        if (newValue > oldValue && newValue > 0) {
            animateReventeBadge.value = true;
            setTimeout(() => (animateReventeBadge.value = false), 300);
        }
    }
);

watch(
    () => badgeStore.badgeCounts.messages,
    (newValue, oldValue) => {
        if (newValue > oldValue && newValue > 0) {
            animateMessagesBadge.value = true;
            setTimeout(() => (animateMessagesBadge.value = false), 300);
        }
    }
);

watch(
    () => badgeStore.badgeCounts.parrainages,
    (newValue, oldValue) => {
        if (newValue > oldValue && newValue > 0) {
            animateParrainageBadge.value = true;
            setTimeout(() => (animateParrainageBadge.value = false), 300);
        }
    }
);

// Écouter les changements d'authentification pour synchroniser les badges
watch(
    () => authStore.user,
    async (isAuthenticated) => {
        if (isAuthenticated) {
            await badgeStore.fetchBadgeCounts();
        } else {
            badgeStore.resetAllCounts();
        }
    },
    { immediate: true }
);

// Marquer comme lu lors de la navigation (optionnel)
const handleNavigation = async (to: string) => {
    // Mettre à jour le badge correspondant quand l'utilisateur navigue vers la page
    switch (to) {
        case '/reventes':
            await badgeStore.markAsRead('reventes');
            break;
        case '/parrainage':
            await badgeStore.markAsRead('parrainages');
            break;
    }

    router.push(to);
};

// Récupérer la description accessible pour le badge
const getBadgeDescription = (route: string, count: number) => {
    if (count <= 0) return '';

    switch (route) {
        case '/reventes':
            return `${count} ${t('Pending reventes')}`;
        case '/messages':
            return `${count} ${t('Unread messages')}`;
        case '/parrainage':
            return `${count} ${t('New referrals')}`;
        default:
            return `${count} notifications`;
    }
};

</script>

<template>
    <div class="shadow-black shadow-2xl z-240 bg-white/80">
        <Transition name="slide-up">
            <nav class="lg:hidden shadow-gray-900 shadow-xl z-240">
                <div class="flex justify-around items-center py-1">
                    <RouterLink v-for="link in navLinks" :key="link.to" :to="link.to" :aria-label="link.label"
                        class="relative flex flex-col items-center justify-center w-15 hover:text-[var(--espace-vert)] transition-colors duration-300 group featured-item  text-[var(--espace-vert)]"
                        :class="[
                            link.featured ? '' : '',
                            $route.path === link.to ? 'text-[var(--espace-vert)]' : ''
                        ]" active-class="text-[var(--espace-vert)]"
                        @click="link.badgeKey ? badgeStore.markAsRead(link.badgeKey) : null">
                        <div class="relative text-center">  
                            <!-- Icône principale -->
                            <i class="fas transition-all duration-300 transform group-hover:scale-110" :class="[
                                link.icon,
                                (!authStore.user && link.to === '/home') ? 'animate-swing' : '',
                                link.featured ? 'text-xl sm:text-xs' : 'text-sm sm:text-xl'
                            ]">
                            </i>

                            <!-- Badge pour toutes les routes -->
                            <span v-if="getBadgeForRoute(link.to) > 0"
                                class="cart-badge absolute -top-1 -right-2 bg-[var(--espace-or)] text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
                                :class="{
                                    'animate-scale': getAnimateStateForRoute(link.to),
                                    'featured-badge': link.featured
                                }" :aria-label="getBadgeDescription(link.to, getBadgeForRoute(link.to))">
                                {{ getBadgeForRoute(link.to) > 99 ? '99+' : getBadgeForRoute(link.to) }}
                            </span>
                        </div>

                        <!-- Label -->
                        <span
                            class="text-[.4rem] mt-1 font-medium max-w-full px-1 text-center transition-all duration-300"
                            :class="link.featured ? 'font-bold transform group-hover:scale-105' : ''">
                            {{ link.label }}
                        </span>

                        <!-- Effet de surbrillance pour gallery -->
                        <div v-if="link.featured"
                            class="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--espace-or)]/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        </div>
                    </RouterLink>
                </div>
            </nav>
        </Transition>
    </div>
</template>

<style scoped>
:root {
    --espace-vert: #14532d;
    --espace-or: #facc15;
    --espace-blanc: #ffffff;
    --espace-gris: #6b7280;
}

.slide-up-enter-active,
.slide-up-leave-active {
    transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
    transform: translateY(100%);
    opacity: 0;
}

.cart-badge {
    transition: transform 0.2s ease, background-color 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.cart-badge.animate-scale {
    animation: scaleBadge 0.3s ease-in-out;
}

.featured-badge {
    transform: scale(1.1);
    box-shadow: 0 2px 8px rgba(250, 204, 21, 0.4);
}

.featured-dot {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    animation: pulse 2s infinite;
}

.featured-item {
    position: relative;
    z-index: 1;
}

.featured-item::before {
    content: '';
    position: absolute;
    top: -2px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--espace-or), transparent);
    transition: width 0.3s ease;
}

.featured-item:hover::before {
    width: 80%;
}

@keyframes scaleBadge {
    0% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.3);
    }

    100% {
        transform: scale(1);
    }
}

@keyframes swing {
    0% {
        transform: rotate(0deg);
    }

    25% {
        transform: rotate(10deg);
    }

    50% {
        transform: rotate(-10deg);
    }

    75% {
        transform: rotate(5deg);
    }

    100% {
        transform: rotate(0deg);
    }
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
        transform: scale(1);
    }

    50% {
        opacity: 0.7;
        transform: scale(1.1);
    }
}

.animate-swing {
    animation: swing 1.5s ease-in-out infinite;
}

/* Style spécifique pour l'item gallery */
.router-link-active.featured-item {
    color: var(--espace-or) !important;
}

.router-link-active.featured-item i {
    filter: drop-shadow(0 2px 4px rgba(250, 204, 21, 0.4));
}
</style>