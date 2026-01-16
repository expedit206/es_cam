<template>
    <div class="px-2 md:px-4 pb-0 sm:pb-0 md:pb-0 z-149 bg-white">
        <div class="chat-input-container max-w-3xl mx-auto mt-2">
            <!-- Product Tag -->
            <span v-if="product?.id"
                class="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full flex items-center gap-2 ml-2 mb-2">
                Product {{ product?.nom }}
                <button @click="$emit('clear-product-tag')" class="ml-1 text-yellow-800 hover:text-red-600 font-bold"
                    title="Retirer le tag">
                    &times;
                </button>
            </span>

            <!-- Text Input (hidden when recording) -->
            <textarea v-if="!isRecording" :value="newMessage" @input="onInput"
                @keydown.enter.prevent="$emit('send-message')" rows="1" placeholder="Écrivez votre message..."
                class="chat-textarea" ref="textAreaRef"></textarea>

            <!-- Recording Display (replaces text input) -->
            <div v-else class="recording-display">
                <div class="recording-content">
                    <!-- Pause/Resume Button -->
                    <button @click="togglePause" class="pause-button"
                        :title="isPaused ? 'Reprendre' : 'Mettre en pause'">
                        <i class="fas" :class="isPaused ? 'fa-play' : 'fa-pause'"></i>
                    </button>

                    <!-- Sound waves -->
                    <div class="sound-waves">
                        <div class="wave" v-for="n in 3" :key="n" :style="getWaveStyle(n)"></div>
                    </div>

                    <!-- Timer -->
                    <div class="recording-timer" :class="{ paused: isPaused }">
                        {{ formatTime(recordingTime) }}
                    </div>

                    <!-- Recording status -->
                    <div class="recording-status">
                        <span v-if="isPaused">En pause</span>
                        <span v-else>Enregistrement en cours...</span>
                    </div>

                    <!-- Delete recording button -->
                    <button @click="cancelRecording" class="delete-button" title="Supprimer l'enregistrement">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>

            <!-- Voice Record Button (hidden when recording) -->
            <button v-if="!isRecording" @click="startVoiceRecording" class="voice-button ml-2"
                title="Commencer l'enregistrement">
                <i class="fas fa-microphone"></i>
            </button>

            <!-- Send Button (visible when recording) -->
            <button v-if="isRecording" @click="stopAndSendRecording" class="send-button ml-2" :disabled="isPaused">
                <i class="fas fa-paper-plane"></i>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, onMounted, onUnmounted } from 'vue';
import { Product } from '../types/index';

const props = defineProps<{
    newMessage: string;
    isRecording: boolean;
    product: Product | null;
}>();

const emit = defineEmits([
    'update:newMessage',
    'send-message',
    'start-recording',
    'stop-recording',
    'emit-typing',
    'clear-product-tag',
    'pause-recording',
    'resume-recording'
]);

// Refs
const recordingTime = ref(0);
const recordingTimer = ref<number | null>(null);
const isPaused = ref(false);
const textAreaRef = ref<HTMLTextAreaElement | null>(null);

// Voice recording functions
const startVoiceRecording = () => {
    if (!props.isRecording) {
        isPaused.value = false;
        recordingTime.value = 0;
        emit('start-recording');
        startTimer();
    }
};

const stopAndSendRecording = () => {
    if (props.isRecording) {
        emit('stop-recording');
        stopTimer();
    }
};

const cancelRecording = () => {
    if (props.isRecording) {
        emit('stop-recording');
        stopTimer();
        isPaused.value = false;
    }
};

const togglePause = () => {
    if (!props.isRecording) return;

    isPaused.value = !isPaused.value;

    if (isPaused.value) {
        // Pause recording
        emit('pause-recording');
        stopTimer();
    } else {
        // Resume recording
        emit('resume-recording');
        startTimer();
    }
};

const startTimer = () => {
    if (recordingTimer.value) {
        clearInterval(recordingTimer.value);
    }

    recordingTimer.value = window.setInterval(() => {
        if (!isPaused.value) {
            recordingTime.value++;
        }
    }, 1000);
};

const stopTimer = () => {
    if (recordingTimer.value) {
        clearInterval(recordingTimer.value);
        recordingTimer.value = null;
    }
};

const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const getWaveStyle = (index: number) => {
    if (isPaused.value) {
        return {
            height: '8px',
            opacity: '0.3'
        };
    }

    const height = 8 + Math.random() * 12;
    const delay = index * 0.2;
    return {
        height: `${height}px`,
        animationDelay: `${delay}s`
    };
};

const onInput = (event: Event) => {
    const target = event.target as HTMLTextAreaElement;
    emit('update:newMessage', target.value);
    emit('emit-typing');
};

onUnmounted(() => {
    stopTimer();
});
</script>

<style scoped>
.chat-input-container {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 1.5rem;
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    min-height: 60px;
}

.chat-textarea {
    flex: 1;
    resize: none;
    background: transparent;
    border: none;
    padding: 0.75rem 1rem;
    font-size: 0.95rem;
    color: #374151;
    border-radius: 1rem;
    outline: none;
    line-height: 1.5;
    min-height: 40px;
    max-height: 150px;
    overflow-y: auto;
}

.chat-textarea::placeholder {
    color: #9ca3af;
}

/* Recording Display */
.recording-display {
    flex: 1;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 1rem;
    padding: 0.75rem 1rem;
    display: flex;
    align-items: center;
    color: #374151;
}

.recording-content {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex: 1;
}

/* Pause/Resume Button */
.pause-button {
    background: #6b7280;
    color: white;
    border: none;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 0.8rem;
    transition: all 0.2s ease;
}

.pause-button:hover {
    background: #4b5563;
    transform: scale(1.05);
}

/* Sound waves */
.sound-waves {
    display: flex;
    align-items: center;
    gap: 2px;
    height: 25px;
    flex: 1;
    max-width: 80px;
    justify-content: center;
}

.wave {
    width: 2px;
    background: #10b981;
    border-radius: 1px;
    animation: waveAnimation 1.5s ease-in-out infinite;
    flex: 1;
    transition: all 0.3s ease;
}

.sound-waves.paused .wave {
    animation: none;
    opacity: 0.3;
}

@keyframes waveAnimation {

    0%,
    100% {
        transform: scaleY(0.3);
    }

    50% {
        transform: scaleY(0.8);
    }
}

.recording-timer {
    font-size: 0.9rem;
    font-weight: 500;
    font-family: monospace;
    min-width: 45px;
    color: #374151;
}

.recording-timer.paused {
    color: #6b7280;
    opacity: 0.7;
}

.recording-status {
    font-size: 0.75rem;
    text-align: center;
    flex: 1;
    color: #6b7280;
}

/* Delete button */
.delete-button {
    background: #ef4444;
    color: white;
    border: none;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 0.8rem;
    transition: all 0.2s ease;
}

.delete-button:hover {
    background: #dc2626;
    transform: scale(1.1);
}

/* Button Styles */
.send-button,
.voice-button {
    background: #10b981;
    color: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    font-size: 0.9rem;
    transition: all 0.2s ease;
}

.voice-button:hover,
.send-button:hover:not(:disabled) {
    background: #059669;
    transform: scale(1.05);
}

.send-button:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
}

/* Responsive Design */
@media (max-width: 768px) {
    .chat-input-container {
        padding: 0.5rem 0.75rem;
        min-height: 55px;
    }

    .recording-content {
        gap: 0.75rem;
    }

    .sound-waves {
        max-width: 60px;
    }

    .recording-timer {
        font-size: 0.85rem;
    }

    .recording-status {
        font-size: 0.7rem;
    }

    .pause-button {
        width: 32px;
        height: 32px;
        font-size: 0.7rem;
    }

    .delete-button {
        width: 28px;
        height: 28px;
        font-size: 0.7rem;
    }
}
</style>