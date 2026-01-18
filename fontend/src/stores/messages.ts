import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";
import apiClient from "../api";
import {
  Message,
  Conversation,
  MessageGroup,
  TypingState,
  RecordingState,
  Product,
} from "../components/types";
import { useAuthStore } from "./Auth";
import { useBadgeStore } from "./badgeStore";

export const useMessageStore = defineStore("message", () => {
  const router = useRouter();
  const toast = useToast();

  // State
  const conversations = ref<Conversation[]>([]);
  const messages = ref<Message[]>([]);
  const selectedConversation = ref<Conversation | null>(null);
  const isLoading = ref(false);
  const hasMore = ref(false);
  const offset = ref(0);
  const isSidebarOpen = ref(true);
  const isMobile = ref(window.innerWidth < 768);
  const product = ref<Product | null>(null);

  // Typing state
  const typingState = ref<TypingState>({
    isTyping: false,
    userId: null,
  });

  // Recording state
  const recordingState = ref<RecordingState>({
    isRecording: false,
    isPaused: false,
    recordingTime: 0,
    audioChunks: [],
    mediaRecorder: null,
  });

  // New message input
  const newMessage = ref("");

  // Echo channel
  let currentChannel: any = null;
  let typingTimeout: any = null;

  // Stores
  const authStore = useAuthStore();
  const badgeStore = useBadgeStore();

  // Getters
  const groupedMessages = computed((): MessageGroup[] => {
    const groups: MessageGroup[] = [];
    let lastDate = "";

    messages.value.forEach((msg) => {
      const msgDate = new Date(msg.created_at).toLocaleDateString();
      if (msgDate !== lastDate) {
        groups.push({ date: msgDate, messages: [msg] });
        lastDate = msgDate;
      } else {
        groups[groups.length - 1].messages.push(msg);
      }
    });

    return groups;
  });

  const unreadCount = computed(() => {
    return conversations.value.reduce(
      (total, conv) => total + conv.unread_count,
      0
    );
  });

  const storageUrl = computed(() => {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
      return "http://localhost:8000/storage/";
    }
    return "https://api.espacecameroun.com/storage/";
  });

  // Watcher pour les nouveaux messages


  // Actions
  const fetchConversations = async (): Promise<void> => {
    try {
      const response = await apiClient.get("/conversations");
      conversations.value = response.data.conversations;

      // Calculer le nombre total de messages non lus depuis les conversations
      const totalUnread = conversations.value.reduce(
        (total, conv) => total + conv.unread_count,
        10
      );

      // Mettre à jour le badge store si nécessaire
      if (badgeStore.badgeCounts.messages !== totalUnread) {
        // Note: On ne met pas à jour automatiquement ici, mais on peut synchroniser
        // await badgeStore.fetchBadgeCounts();
      }
    } catch (error: any) {
      if (error.response?.data?.message === "Unauthenticated.") {
        router.push("/login");
      }
      toast.error("Erreur lors du chargement des conversations");
      throw error;
    }
  };

  const fetchMessages = async (
    receiverId: string | string[],
    resetOffset = true
  ): Promise<void> => {
    if (isLoading.value) return;

    isLoading.value = true;
    try {
      if (resetOffset) {
        offset.value = 0;
        messages.value = [];
      }

      const response = await apiClient.get(
        `/chat/${receiverId}?offset=${offset.value}`
      );
      const newMessages = response.data.messages;

      if (resetOffset) {
        messages.value = newMessages;
      } else {
        messages.value = [...newMessages, ...messages.value];
      }

      hasMore.value = response.data.hasMore;

      // Update selected conversation
      const conversation = conversations.value.find(
        (c) => c.user_id == receiverId
      );
      if (conversation) {
        selectedConversation.value = conversation;
      }

      // Marquer les messages comme lus ET mettre à jour le badge
      await markAllMessagesAsRead(Number(receiverId));
    } catch (error: any) {
      if (error.response?.data?.message === "Unauthenticated.") {
        router.push("/login");
      }
      toast.error("Erreur lors du chargement des messages");
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const sendMessage = async (
    content: string,
    type: "text" | "audio" | "image" = "text",
    file?: Blob | File
  ): Promise<void> => {
    if (!selectedConversation.value) {
      toast.error("Aucune conversation sélectionnée");
      return;
    }

    const tempId = -Date.now();
    const tempMessage: Message = {
      id: tempId,
      sender_id: authStore.user?.id!,
      receiver_id: selectedConversation.value.user_id,
      content,
      type,
      is_read: false,
      product_id: product.value?.id || null,
      audio_url: type === "audio" ? content : null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      isTemporary: true,
      sender: authStore.user!,
      receiver: {
        id: selectedConversation.value.user_id,
        nom: selectedConversation.value.name,
        email: "",
        telephone: "",
        ville: "",
        premium: false,
        parrain_id: null,
      },
      product: product.value,
    };

    // Add temporary message
    messages.value.push(tempMessage);
    newMessage.value = "";

    try {
      let response;
      if ((type === "audio" || type === "image") && file) {
        const formData = new FormData();
        formData.append("type", type);
        formData.append(type, file); // 'audio' or 'image' matches the type
        formData.append(
          "receiver_id",
          selectedConversation.value.user_id.toString()
        );

        response = await apiClient.post(
          `/chat/${selectedConversation.value.user_id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else {
        response = await apiClient.post(
          `/chat/${selectedConversation.value.user_id}`,
          {
            type: "text",
            content,
            product_id: product.value?.id,
          }
        );
      }

      const realMessage = response.data.data;

      // Replace temporary message with real one
      const tempIndex = messages.value.findIndex((m) => m.id === tempId);
      if (tempIndex !== -1) {
        messages.value[tempIndex] = {
          ...tempMessage,
          id: realMessage.id,
          created_at: realMessage.created_at,
          updated_at: realMessage.updated_at,
          content: realMessage.content, // Ensure we use the server URL
          isTemporary: false,
        };
      }

      // Update conversation list
      updateConversationLastMessage(realMessage);

      // Clear product if used
      if (product.value) {
        clearProductTag();
      }

      badgeStore.syncWithBackend()
    } catch (error: any) {
      // Remove temporary message on error
      messages.value = messages.value.filter((m) => m.id !== tempId);
      toast.error("Erreur lors de l'envoi du message");
      throw error;
    }
  };

  const startRecording = async (): Promise<void> => {
    if (!navigator.mediaDevices?.getUserMedia) {
      toast.error("Enregistrement audio non supporté");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      recordingState.value = {
        isRecording: true,
        isPaused: false,
        recordingTime: 0,
        audioChunks: [],
        mediaRecorder,
      };

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordingState.value.audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(recordingState.value.audioChunks, {
          type: "audio/webm",
        });
        await sendMessage(URL.createObjectURL(audioBlob), "audio", audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      startRecordingTimer();
    } catch (error) {
      toast.error("Erreur d'accès au microphone");
      throw error;
    }
  };

  const stopRecording = (): void => {
    if (
      recordingState.value.mediaRecorder &&
      recordingState.value.isRecording
    ) {
      recordingState.value.mediaRecorder.stop();
      recordingState.value.isRecording = false;
      stopRecordingTimer();
    }
  };

  const toggleRecordingPause = (): void => {
    if (!recordingState.value.mediaRecorder) return;

    if (recordingState.value.isPaused) {
      recordingState.value.mediaRecorder.resume();
      recordingState.value.isPaused = false;
      startRecordingTimer();
    } else {
      recordingState.value.mediaRecorder.pause();
      recordingState.value.isPaused = true;
      stopRecordingTimer();
    }
  };

  const cancelRecording = (): void => {
    if (
      recordingState.value.mediaRecorder &&
      recordingState.value.isRecording
    ) {
      recordingState.value.mediaRecorder.stop();
      recordingState.value.isRecording = false;
      recordingState.value.isPaused = false;
      stopRecordingTimer();
    }
  };

  const markAllMessagesAsRead = async (receiverId: number): Promise<void> => {
    try {
      // Appeler l'API pour marquer tous les messages comme lus
      await apiClient.put("/messages/mark-all-as-read");

      // Mettre à jour le badge des messages via le badge store
      await badgeStore.markAsRead("messages");

      // Mettre à jour localement les conversations
      const convIndex = conversations.value.findIndex(
        (c) => c.user_id === receiverId
      );
      if (convIndex !== -1) {
        conversations.value[convIndex].unread_count = 0;
      }

      // Réinitialiser localement le compteur de messages dans le badge store
      badgeStore.decrementLocalCount("messages");
    } catch (error: any) {
      if (error.response?.data?.message === "Unauthenticated.") {
        router.push("/login");
      }
      toast.error("Erreur lors de la mise à jour des messages lus");
      throw error;
    }
  };

  const editMessage = async (
    messageId: number,
    content: string
  ): Promise<void> => {
    try {
      await apiClient.put(`/chat/message/${messageId}`, { content });

      // Update local message
      const messageIndex = messages.value.findIndex((m) => m.id === messageId);
      if (messageIndex !== -1) {
        messages.value[messageIndex].content = content;
        messages.value[messageIndex].updated_at = new Date().toISOString();
      }

      // Update conversation last message if needed
      if (
        selectedConversation.value &&
        messageIndex === messages.value.length - 1
      ) {
        updateConversationLastMessage(messages.value[messageIndex]);
      }
    } catch (error) {
      toast.error("Erreur lors de la modification du message");
      throw error;
    }
  };

  const deleteMessage = async (messageId: number): Promise<void> => {
    try {
      await apiClient.delete(`/chat/message/${messageId}`);

      // Remove message locally
      messages.value = messages.value.filter((m) => m.id !== messageId);

      // Update conversation last message if needed
      if (selectedConversation.value && messages.value.length > 0) {
        updateConversationLastMessage(
          messages.value[messages.value.length - 1]
        );
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression du message");
      throw error;
    }
  };

  const setProductTag = (productData: Product): void => {
    product.value = productData;
    // Optionnel: Vous pouvez toujours utiliser localStorage pour persister
    // l'état entre les rechargements de page si nécessaire
    localStorage.setItem("chatProduct", JSON.stringify(productData));
  };

  const clearProductTag = (): void => {
    product.value = null;
    localStorage.removeItem("chatProduct");
  };

  const toggleSidebar = (): void => {
    isSidebarOpen.value = !isSidebarOpen.value;
  };

  const selectConversation = (receiverId: number): void => {
    router.push({ name: "messages", params: { receiverId } });
    if (isMobile.value) {
      isSidebarOpen.value = false;
    }
  };

  // Private helpers
  const startRecordingTimer = (): void => {
    recordingState.value.recordingTime = 0;
    const timer = setInterval(() => {
      if (!recordingState.value.isPaused) {
        recordingState.value.recordingTime++;
      }
    }, 1000);

    // Store timer reference if needed
    (recordingState.value as any).timer = timer;
  };

  const stopRecordingTimer = (): void => {
    if ((recordingState.value as any).timer) {
      clearInterval((recordingState.value as any).timer);
    }
  };

  const updateConversationLastMessage = (message: Message): void => {
    const convIndex = conversations.value.findIndex(
      (c) =>
        c.user_id === message.sender_id || c.user_id === message.receiver_id
    );

    if (convIndex !== -1) {
      conversations.value[convIndex].last_message =
        message.type === "audio" ? "audio" : message.content;
      conversations.value[convIndex].last_message_type = message.type;
      conversations.value[convIndex].updated_at = message.updated_at;

      // Si c'est un message reçu, mettre à jour le compteur non lu
      if (message.receiver_id === authStore.user?.id && !message.is_read) {
        conversations.value[convIndex].unread_count += 1;
      }
    }
  };

  // Echo real-time communication - ADAPTÉ pour mettre à jour les badges
  const subscribeToChannel = (): void => {
    if (!authStore.user?.id) return;

    if (currentChannel) {
      currentChannel.stopListening(".App\\Events\\MessageSent");
      currentChannel.stopListening(".App\\Events\\MessageUpdated");
      currentChannel.stopListening(".App\\Events\\MessageDeleted");
      window.Echo.leave("private-chat");
    }

    currentChannel = window.Echo.private("chat")
      .listen(".App\\Events\\MessageSent", handleNewMessage)
      .listen(".App\\Events\\MessageUpdated", handleMessageUpdated)
      .listen(".App\\Events\\MessageDeleted", handleMessageDeleted)
      .listenForWhisper("typing", handleTyping)
      .error((err: any) => console.error("Erreur channel privé", err));
  };

  const unsubscribeFromChannel = (): void => {
    if (currentChannel) {
      currentChannel.stopListening(".App\\Events\\MessageSent");
      window.Echo.leave("private-chat");
    }
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
  };

  const handleNewMessage = (event: any): void => {
    const { message } = event;

    // Update conversation list
    updateConversationLastMessage(message);

    // Add to current messages if in the same conversation
    if (
      selectedConversation.value &&
      (selectedConversation.value.user_id === message.receiver_id ||
        selectedConversation.value.user_id === message.sender_id)
    ) {
      const newMessage: Message = {
        ...message,
        sender: message.sender,
        receiver: message.receiver,
        product: message.product || null,
      };

      messages.value.push(newMessage);
    }

    // Si le message est pour l'utilisateur courant, mettre à jour le badge
    if (message.receiver_id === authStore.user?.id) {
      badgeStore.incrementLocalCount("messages");
    }
  };

  const handleMessageUpdated = (event: any): void => {
    const { message } = event;

    if (
      selectedConversation.value &&
      (selectedConversation.value.user_id === message.receiver_id ||
        selectedConversation.value.user_id === message.sender_id)
    ) {
      const messageIndex = messages.value.findIndex((m) => m.id === message.id);
      if (messageIndex !== -1) {
        messages.value[messageIndex] = {
          ...messages.value[messageIndex],
          ...message,
          sender: message.sender,
          receiver: message.receiver,
        };
      }
    }
  };

  const handleMessageDeleted = (event: any): void => {
    const { messageId, receiverId, senderId } = event;

    if (
      selectedConversation.value &&
      (selectedConversation.value.user_id === receiverId ||
        selectedConversation.value.user_id === senderId)
    ) {
      messages.value = messages.value.filter((m) => m.id !== Number(messageId));
    }
  };

  const handleTyping = (data: any): void => {
    if (
      selectedConversation.value &&
      data.sender_id === selectedConversation.value.user_id
    ) {
      typingState.value = {
        isTyping: true,
        userId: data.sender_id,
      };

      clearTimeout(typingTimeout);
      typingTimeout = setTimeout(() => {
        typingState.value = {
          isTyping: false,
          userId: null,
        };
      }, 2000);
    }
  };

  const emitTyping = (): void => {
    if (currentChannel && selectedConversation.value && authStore.user?.id) {
      window.Echo.private("chat").whisper("typing", {
        sender_id: authStore.user.id,
        receiver_id: selectedConversation.value.user_id,
      });
    }
  };

  // Initializer modifié
  const initialize = (): void => {
    // Load product from localStorage (optionnel, pour persistance)
    const storedProduct = localStorage.getItem("chatProduct");
    if (storedProduct) {
      product.value = JSON.parse(storedProduct);
    }

    // Set up window resize listener
    window.addEventListener("resize", handleResize);
    

    // Synchroniser les badges au démarrage
    badgeStore.fetchBadgeCounts().catch(console.error);
  };

  const handleResize = (): void => {
    isMobile.value = window.innerWidth < 768;
    // Ajuster le sidebar en fonction de la taille de l'écran
    isSidebarOpen.value = window.innerWidth >= 768;
  };

  // Cleanup
  const cleanup = (): void => {
    unsubscribeFromChannel();
    window.removeEventListener("resize", handleResize);
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
  };

  return {
    // State
    conversations,
    messages,
    selectedConversation,
    isLoading,
    hasMore,
    isSidebarOpen,
    isMobile,
    product,
    typingState,
    recordingState,
    newMessage,

    // Getters
    groupedMessages,
    unreadCount,
    storageUrl,

    // Actions
    fetchConversations,
    fetchMessages,
    sendMessage,
    startRecording,
    stopRecording,
    toggleRecordingPause,
    cancelRecording,
    markAllMessagesAsRead,
    editMessage,
    deleteMessage,
    setProductTag,
    clearProductTag,
    toggleSidebar,
    selectConversation,
    subscribeToChannel,
    unsubscribeFromChannel,
    emitTyping,
    initialize,
    cleanup,
  };
});
