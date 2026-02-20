<template>
  <SeoHead
    :title="t('messages_seo_title')"
    :description="t('messages_seo_description')"
    :keywords="t('messages_seo_keywords')"
    :url="seoUrl"
    type="website"
  />

  <StructuredData type="webpage" :data="structuredData" />

  <div class="w-full flex relative h-full min-h-full">
    <Sidebar
      :conversations="messageStore.conversations"
      :is-sidebar-open="messageStore.isSidebarOpen"
      :is-mobile="messageStore.isMobile"
      :storage-url="messageStore.storageUrl"
      :is-loading="isLoadingConversations"
      @select-conversation="handleSelectConversation"
      @toggle-sidebar="messageStore.toggleSidebar"
      @view-profile="viewProfile"
    />

    <div class="bg-white h-full w-full flex flex-col">
      <!-- Header -->
      <div class="flex border-b items-center px-4 bg-white flex-shrink-0">
        <button
          v-if="
            !messageStore.isSidebarOpen &&
            messageStore.isMobile &&
            messageStore.selectedConversation
          "
          @click="messageStore.toggleSidebar"
          class="text-primary-dark p-2 rounded-full hover:bg-secondary transition"
        >
          <i class="fas fa-arrow-left text-2xl"></i>
        </button>
        <h2
          v-if="messageStore.selectedConversation"
          class="text-xl font-semibold text-primary p-4 flex items-center"
        >
          {{ messageStore.selectedConversation.name }}
        </h2>
      </div>

      <!-- Content -->
      <div
        class="bg-white shadow-md transition-all duration-300 flex flex-col flex-1 h-full overflow-hidden w-full bg-blue-200 flex-grow"
      >
        <Content
          v-if="messageStore.selectedConversation"
          @edit-message="handleEditMessage"
          @delete-message="handleDeleteMessage"
          :messages="messageStore.groupedMessages"
          :is-loading="messageStore.isLoading"
          :typing-user="messageStore.typingState.isTyping"
          :selected-conversation="messageStore.selectedConversation"
          :auth-store="authStore"
        />

        <div v-else class="flex items-center justify-center h-full">
          <p class="text-foreground-muted text-lg">
            {{ t("select_conversation_to_start") }}
          </p>
        </div>

        <!-- Input -->
        <Input
          v-if="messageStore.selectedConversation"
          :new-message="messageStore.newMessage"
          :is-recording="messageStore.recordingState.isRecording"
          :product="messageStore.product"
          @send-message="handleSendMessage"
          @send-image="handleSendImage"
          @send-video="handleSendVideo"
          @start-recording="messageStore.startRecording"
          @stop-recording="messageStore.stopRecording"
          @emit-typing="messageStore.emitTyping"
          @update:newMessage="messageStore.newMessage = $event"
          @pause-recording="messageStore.toggleRecordingPause"
          @resume-recording="messageStore.toggleRecordingPause"
          @clear-product-tag="messageStore.clearProductTag"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch, computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useMessageStore } from "../stores/messages";
import { useAuthStore } from "../stores/Auth";
import { useToast } from "vue-toastification";
import { useI18n } from "../components/useI18n";

// Components
import Sidebar from "../components/Messages/Sidebar.vue";
import Content from "../components/Messages/Content.vue";
import Input from "../components/Messages/Input.vue";
import StructuredData from "../components/StructuredData.vue";
import SeoHead from "../components/SeoHead.vue";
import { useAuthGuard } from "../composables/useAuthGuard";

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const messageStore = useMessageStore();
const toast = useToast();
const { checkAuth } = useAuthGuard();

const isLoadingConversations = ref(false);

// Computed
const seoUrl = computed(
  () => `${"https://espacecameroun.com"}${router.currentRoute.value.path}`,
);

const structuredData = computed(() => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: t("messages_structured_name"),
  description: t("messages_structured_description"),
  url: seoUrl.value,
}));

// Handlers
const handleSelectConversation = (receiverId: number) => {
  messageStore.selectConversation(receiverId);
};

// ... existing handlers ...

// Lifecycle
onMounted(async () => {
  if (!checkAuth("Connectez-vous pour voir vos messages")) return;
  messageStore.initialize();

  try {
    isLoadingConversations.value = true;
    await messageStore.fetchConversations();
  } catch (error) {
    toast.error("Erreur lors de l'initialisation des messages");
  } finally {
    isLoadingConversations.value = false;
  }

  try {
    if (route.params.receiverId) {
      await messageStore.fetchMessages(route.params.receiverId);
    }

    if (authStore.user?.id) {
      messageStore.subscribeToChannel();
    }
  } catch (error) {
    toast.error("Erreur lors de l'initialisation des messages");
  }
});

onUnmounted(() => {
  messageStore.cleanup();
});

// Watchers
watch(
  () => route.params.receiverId,
  async (receiverId) => {
    if (receiverId) {
      await messageStore.fetchMessages(receiverId);
    }
  },
);

watch(
  () => authStore.user?.id,
  (userId) => {
    if (userId) {
      messageStore.subscribeToChannel();
    }
  },
);
</script>

<style scoped>
@media (max-width: 768px) {
  .container {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
}
</style>
