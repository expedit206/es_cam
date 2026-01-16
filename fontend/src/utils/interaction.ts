// services/interactionService.ts
import apiClient from "../api/index";

export const interactionService = {
  // Enregistrer une interaction
  async recordInteraction(
    contentId: string,
    contentType: "produit" | "service",
    type: "clic" | "favori" | "contact" | "partage",
    metadata?: any
  ) {
    try {
      const response = await apiClient.post("/interactions", {
        content_id: contentId,
        content_type: contentType,
        type,
        metadata,
      });
      return response.data;
    } catch (error) {
      console.error("Error recording interaction:", error);
      throw error;
    }
  },

  // Récupérer les interactions
  async getUserInteractions(
    contentType: "produit" | "service",
    type?: string,
    limit?: number
  ) {
    try {
      const params = new URLSearchParams();
      params.append("content_type", contentType);
      if (type) params.append("type", type);
      if (limit) params.append("limit", limit.toString());

      const response = await apiClient.get(
        `/interactions?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching interactions:", error);
      throw error;
    }
  },

  // Récupérer les catégories préférées
  async getPreferredCategories() {
    try {
      const response = await apiClient.get(
        "/interactions/preferred-categories"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching preferred categories:", error);
      throw error;
    }
  },
};
