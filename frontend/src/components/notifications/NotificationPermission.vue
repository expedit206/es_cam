<template>
    <div class="notification-permission">
        <div 
        class="permission-prompt">
            <h3>Activer les notifications</h3>
            <p>Recevez des notifications importantes en temps réel.</p>
            <button @click="handleRequestPermission" :disabled="loading" class="btn btn-primary">
                <span v-if="loading">Chargement...</span>
                <span v-else>Activer les notifications</span>
            </button>
        </div>

        <div v-if="notificationPermission === 'granted'" class="permission-granted">
            <div class="success-message">
                <i class="icon-check"></i>
                <span>Notifications activées avec succès!</span>
            </div>

            <div v-if="deviceToken" class="token-info">
                <p><strong>Token:</strong> {{ truncatedToken }}</p>
                <button @click="copyToken" class="btn btn-secondary">
                    Copier le token
                </button>
            </div>
        </div>

        <div v-if="notificationPermission === 'denied'" class="permission-denied">
            <div class="error-message">
                <i class="icon-warning"></i>
                <span>Vous avez bloqué les notifications</span>
            </div>
            <p>
                Pour activer les notifications, veuillez:
            <ol>
                <li>Cliquer sur l'icône de cadenas dans la barre d'adresse</li>
                <li>Autoriser les notifications pour ce site</li>
                <li>Rafraîchir la page</li>
            </ol>
            </p>
        </div>

        <div v-if="error" class="error-message">
            <i class="icon-error"></i>
            <span>Erreur: {{ error }}</span>
        </div>

        <!-- Afficher les notifications reçues -->
        <div v-if="notification" class="notification-received">
            <h4>Nouvelle notification:</h4>
            <div class="notification-content">
                <strong>{{ notification.notification?.title }}</strong>
                <p>{{ notification.notification?.body }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>

import { useNotifications } from '../../composables/useNotifications'
import { computed, ref } from 'vue';

const {
    deviceToken,
    notificationPermission,
    error,
    notification,
    requestPermission
} = useNotifications();

const loading = ref(false);

const truncatedToken = computed(() => {
    if (!deviceToken.value) return '';
    return deviceToken.value;
});

const handleRequestPermission = async () => {
    loading.value = true;
    error.value = null;
    try {
        await requestPermission();
    } finally {
        loading.value = false;
    }
};

const copyToken = async () => {
    if (deviceToken.value) {
        try {
            await navigator.clipboard.writeText(deviceToken.value);
            alert('Token copié dans le presse-papier!');
        } catch (err) {
            console.error('Failed to copy token:', err);
        }
    }
};
</script>

<style scoped>
.notification-permission {
    max-width: 500px;
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
}

.permission-prompt {
    text-align: center;
}

.btn {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
}

.btn-primary {
    background-color: #007bff;
    color: white;
}

.btn-primary:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
}

.btn-secondary {
    background-color: #6c757d;
    color: white;
    font-size: 14px;
}

.success-message {
    color: #28a745;
    display: flex;
    align-items: center;
    gap: 8px;
}

.error-message {
    color: #dc3545;
    display: flex;
    align-items: center;
    gap: 8px;
}

.permission-denied {
    color: #856404;
    background-color: #fff3cd;
    border: 1px solid #ffeaa7;
    padding: 15px;
    border-radius: 4px;
}

.token-info {
    margin-top: 15px;
    padding: 15px;
    background-color: #f8f9fa;
    border-radius: 4px;
}

.notification-received {
    margin-top: 20px;
    padding: 15px;
    background-color: #d4edda;
    border: 1px solid #c3e6cb;
    border-radius: 4px;
}

.notification-content {
    margin-top: 10px;
}
</style>