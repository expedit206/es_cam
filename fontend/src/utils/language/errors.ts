// src/utils/i18n/errors.ts
export const errors = {
  fr: {
    // === MESSAGES D'ERREUR ===
    network_error: "Erreur réseau",
    server_error: "Erreur serveur",
    not_found: "Non trouvé",
    unauthorized: "Non autorisé",
    forbidden: "Accès interdit",
    operation_failed: "Opération échouée",

    // Erreurs spécifiques
    private_channel_error: "❌ Erreur d'abonnement au canal privé:",
    badges_load_error: "Erreur lors du chargement des badges:",
    user_fetch_error: "Erreur lors de la récupération de l'utilisateur:",
    search_error: "Erreur lors de la recherche:",
    favorite_update_error: "Erreur lors de la mise à jour des favoris",

    // Erreurs produits
    categories_load_error: "Erreur lors du chargement des catégories",
    login_to_resell: "Veuillez vous connecter pour collaborer",
    cannot_resell_own_product: "Vous ne pouvez pas collaborer sur votre propre produit",
    product_not_revendable: "Ce produit n'est pas ouvert à la revente",
    resell_price_too_low: "Le prix de revente doit être supérieur ou égal à {{min}} XAF",
    revente_request_sent: "Demande de revente envoyée",
    only_owner_can_boost: "Seul le commerçant propriétaire peut booster ce produit",
    not_enough_tokens: "Pas assez de Jetons. Il vous faut {{cost}} Jetons pour ce boost.",
    product_boosted: "Produit boosté avec succès",
    boost_error: "Erreur lors du boostage du produit",
    product_load_error: "Erreur lors du chargement du produit",
    view_record_error: "Erreur lors de l'enregistrement de la vue",
    favorite_error: "Erreur lors de la mise à jour des favoris",
    unauthorized_edit: "Vous n'êtes pas autorisé à modifier ce produit",
    unauthorized_delete: "Vous n'êtes pas autorisé à supprimer ce produit",
    product_updated: "Produit modifié avec succès",
    update_error: "Erreur lors de la modification du produit",
    product_deleted: "Produit supprimé avec succès",
    delete_error: "Erreur lors de la suppression du produit",

    // Messages de succès
    operation_successful: "Opération réussie",
    profile_updated: "Profil mis à jour",
    password_updated: "Mot de passe mis à jour",
    product_created: "Produit créé",
    purchase_successful: "Achat réussi",
  },
  en: {
    // === ERROR MESSAGES ===
    network_error: "Network error",
    server_error: "Server error",
    not_found: "Not found",
    unauthorized: "Unauthorized",
    forbidden: "Forbidden",
    operation_failed: "Operation failed",

    // Specific errors
    private_channel_error: "❌ Private channel subscription error:",
    badges_load_error: "Error loading badges:",
    user_fetch_error: "Error fetching user:",
    search_error: "Search error:",
    favorite_update_error: "Error updating favorites",

    // Product errors
    categories_load_error: "Error loading categories",
    login_to_resell: "Please login to resell",
    cannot_resell_own_product: "You cannot resell on your own product",
    product_not_revendable: "This product is not open for revente",
    resell_price_too_low: "Resell price must be greater than or equal to {{min}} XAF",
    revente_request_sent: "Revente request sent",
    only_owner_can_boost: "Only the owner merchant can boost this product",
    not_enough_tokens: "Not enough Tokens. You need {{cost}} Tokens for this boost.",
    product_boosted: "Product boosted successfully",
    boost_error: "Error boosting product",
    product_load_error: "Error loading product",
    view_record_error: "Error recording view",
    favorite_error: "Error updating favorites",
    unauthorized_edit: "You are not authorized to edit this product",
    unauthorized_delete: "You are not authorized to delete this product",
    product_updated: "Product updated successfully",
    update_error: "Error updating product",
    product_deleted: "Product deleted successfully",
    delete_error: "Error deleting product",

    // Success messages
    operation_successful: "Operation successful",
    profile_updated: "Profile updated",
    password_updated: "Password updated",
    product_created: "Product created",
    purchase_successful: "Purchase successful",
  }
};