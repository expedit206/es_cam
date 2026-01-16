// src/i18n/products.ts
export const products = {
  fr: {
    // Informations de base du produit
    'start by adding first product': "Commencez par ajouter votre premier produit",
    product: "Produit",
    products: "produits",
    price: "Prix",
    quantity: "Quantité",
    description: "Description",
    category: "Catégorie",
    categories: "Catégories",
    stock: "Qt",
    out_of_stock: "Rupture de stock",
    in_stock: "En stock",
    features: "Caractéristiques",
    specifications: "Spécifications",
    manage_catalog_description:
      "Gérez votre catalogue de produits en toute simplicité",
    my_products: "Mes Produits",

    // Actions
    add_to_cart: "Ajouter au panier",
    buy_now: "Acheter maintenant",
    view_product: "Voir le produit",
    remove_from_favorites: "Retirer des favoris",
    add_to_favorites: "Ajouter aux favoris",
    edit_product: "Modifier ",
    delete_product: "Supprimer le produit",
    save_changes: "Enregistrer les modifications",
    propose_resell_price: "Proposer un prix de revente",
    resell: "Collaborer",
    send_message: "Envoyer un message",
    contact_seller: "Contacter le vendeur",
    whatsapp_contact: "Contacter par WhatsApp",
    confirm: "Confirmer",

    // État et statuts
    boosted_product: "Produit boosté",
    revendable_product: "Produit revendable",
    premium_merchant: "Commerçant Premium",
    not_specified: "Non spécifiée",
    added_on: "Ajouté le",
    views: "vues",
    favorites: "favoris",
    rating: "Note",
    not_rated: "Non évalué",
    unknown: "Inconnu",

    // Interface utilisateur
    product_catalog: "Catalogue des produits",
    no_products_available: "Aucun produit disponible",
    product_name: "Nom du produit",
    price_fcfa: "Prix (FCFA)",
    available_stock: "Stock disponible",
    search_category: "Rechercher une catégorie",
    product_photos: "Photos du produit",
    image_preview: "Aperçu de l'image",
    add_more_photos: "Ajouter d'autres photos",
    add_photos: "Ajouter des photos",
    previous_image: "Image précédente",
    next_image: "Image suivante",
    go_to_image: "Aller à l'image {{number}}",
    view_image: "Voir l'image {{number}}",
    zoom_image: "Zoom sur l'image",
    zoomed_image: "Image zoomée",
    similar_products: "Produits similaires",
    no_more_products: "Aucun produit supplémentaire",
    about_merchant: "À propos du commerçant",
    view_merchant_profile: "Voir le profil du commerçant",
    view_merchant: "Voir le commerçant",

    // Revente
    make_revendable: "Rendre ce produit revendable",
    minimum_margin_fcfa: "Marge minimale (FCFA)",
    minimum_margin_placeholder: "Marge minimale pour la revente",
    resell_on: "Collaborer sur {{name}}",
    resell_on_product: "Collaborer sur ce produit",
    propose_resell_description:
      "Proposez un prix de revente (minimum : {{min}} XAF)",
    resell_price_fcfa: "Prix de revente (XAF)",
    resell_price_for: "Prix de revente pour {{name}}",
    potential_margin: "Marge potentielle",
    send_revente_request: "Envoyer la demande de revente",

    // Boost
    customize_boost: "Personnaliser le Boost",
    view_target: "Objectif de vues",
    estimated_cost: "Coût estimé",
    tokens: "Jetons",

    // Messages d'erreur et validation
    unauthorized_edit: "Vous n'êtes pas autorisé à modifier ce produit",
    unauthorized_delete: "Vous n'êtes pas autorisé à supprimer ce produit",
    product_updated: "Produit modifié avec succès",
    update_error: "Erreur lors de la modification du produit",
    product_deleted: "Produit supprimé avec succès",
    delete_error: "Erreur lors de la suppression du produit",
    categories_load_error: "Erreur lors du chargement des catégories",
    login_to_resell: "Veuillez vous connecter pour collaborer",
    cannot_resell_own_product:
      "Vous ne pouvez pas collaborer sur votre propre produit",
    product_not_revendable: "Ce produit n'est pas ouvert à la revente",
    resell_price_too_low:
      "Le prix de revente doit être supérieur ou égal à {{min}} XAF",
    revente_request_sent: "Demande de revente envoyée",
    only_owner_can_boost:
      "Seul le commerçant propriétaire peut booster ce produit",
    not_enough_tokens:
      "Pas assez de Jetons. Il vous faut {{cost}} Jetons pour ce boost.",
    product_boosted: "Produit boosté avec succès",
    boost_error: "Erreur lors du boostage du produit",
    product_load_error: "Erreur lors du chargement du produit",
    view_record_error: "Erreur lors de l'enregistrement de la vue",
    favorite_error: "Erreur lors de la mise à jour des favoris",
    login_to_message: "Veuillez vous connecter pour démarrer une conversation",
    product_not_found: "Produit non trouvé",

    // SEO et accessibilité
    product_seo_description: "Découvrez ce produit sur Espace Cameroun",
    product_image_alt: "Image de {{name}} - {{index}}",
    no_description_available: "Aucune description disponible",
    collab: "collab",
    boosted: "Boosté",
    buy: "acheter",

    // Confirmations
    delete_confirmation:
      'Êtes-vous sûr de vouloir supprimer "{{name}}" ? Cette action est irréversible.',
    edit_product_description: "Modifiez les informations de votre produit",

    filters: "Filtres",
    filter_offers: "Filtrer les offres",
    apply_filters: "Appliquer les filtres",
    reset_filters: "Réinitialiser les filtres",
    search_products: "Rechercher un produit...",
    search_products_placeholder:
      "Rechercher un produit... / Search products...",
    all_categories: "Toutes",
    all_cities: "Toutes les villes",
    revendable: "revendable",
    yes: "Oui",
    no: "Non",
    min_price: "Prix min",
    max_price: "Prix max",
    price_min_placeholder: "Prix min / Min price",
    price_max_placeholder: "Prix max / Max price",

    // États des produits
    loading_products: "Chargement des produits...",

    // Actions
    search: "Rechercher",
    refresh: "Actualiser",

    // Messages d'erreur
    min_price_must_be_less_than_max_price:
      "Le prix minimum doit être inférieur au prix maximum",
    error_loading_categories: "Erreur lors du chargement des catégories",
    error_loading_products_categories:
      "Erreur lors du chargement des produits ou catégories",
    error_recording_view: "Erreur lors de l'enregistrement de la vue",
    newest: "Plus récent",
    oldest: "Plus ancien", 
    price_low_to_high: "Prix croissant",
    price_high_to_low: "Prix décroissant",
    most_popular: "Plus populaire",
    favorite_count: "Plus favoris",
    name_asc: "Nom A-Z",
    name_desc: "Nom Z-A",
    // SEO et métadonnées

    sell: "vendre",
    discover_our_products: "Découvrez nos produits",
    on_espace_cameroun: "sur Espace Cameroun",
    articles_available: "articles disponibles",
    with_delivery_in_cameroon: "avec livraison au Cameroun",
    browse_products_count: "Parcourez {{count}} produits",
    secure_marketplace_for_buying_selling:
      "Marketplace sécurisée pour acheter et vendre",
    with_orange_money_mtn_mobile_money: "avec Orange Money et MTN Mobile Money",
    available_on_espace_cameroun: "disponible sur Espace Cameroun",
    list_of_available_products_on_marketplace:
      "Liste des produits disponibles sur la marketplace",
        new_product: "Ajouter un produit",
    all_status: "Tous les satuts",
   all_types :"Tous les types",
    
  },
  en: {
      newest: "Newest",
    oldest: "Oldest",
    price_low_to_high: "Price: Low to High", 
    price_high_to_low: "Price: High to Low",
    most_popular: "Most Popular",
    favorite_count: "Most Favorites",
    name_asc: "Name A-Z",
    name_desc: "Name Z-A",
   all_types :"All types",
    all_status: "All statuses",
    manage_catalog_description: "Manage your product catalog with ease",

    // Filters and sorting
    favorites: "Favorites",
    filters: "Filters",
    filter_offers: "Filter offers",
    apply_filters: "Apply filters",
    reset_filters: "Reset filters",
    search_products: "Search products...",
    search_products_placeholder: "Search products...",
    all_categories: "All",
    all_cities: "All cities",
    revendable: "Revendable",
    yes: "Yes",
    no: "No",
    min_price: "Min price",
    max_price: "Max price",
    price_min_placeholder: "Min price",
    price_max_placeholder: "Max price",

    // Product states
    no_products_available: "No products available",
    no_more_products: "No more products",
    loading_products: "Loading products...",

    // Actions
    search: "Search",
    refresh: "Refresh",

    // Error messages
    categories_load_error: "Error loading categories",
    min_price_must_be_less_than_max_price:
      "Minimum price must be less than maximum price",
    error_loading_categories: "Error loading categories",
    error_loading_products_categories: "Error loading products or categories",
    error_recording_view: "Error recording view",
    product_load_error: "Error loading products",
    view_record_error: "Error recording view",

    // SEO and metadata
    products: "Products",
    buy: "buy",
    sell: "sell",
    discover_our_products: "Discover our products",
    on_espace_cameroun: "on Espace Cameroun",
    articles_available: "articles available",
    with_delivery_in_cameroon: "with delivery in Cameroon",
    browse_products_count: "Browse {{count}} products",
    secure_marketplace_for_buying_selling:
      "Secure marketplace for buying and selling",
    with_orange_money_mtn_mobile_money:
      "with Orange Money and MTN Mobile Money",
    product_catalog: "Product catalog",
    product: "Product",
    available_on_espace_cameroun: "available on Espace Cameroun",
    list_of_available_products_on_marketplace:
      "List of available products on marketplace",
    // Basic product information
    price: "Price",
    quantity: "Quantity",
    description: "Description",
    category: "Category",
    categories: "Categories",
    stock: "Qt",
    out_of_stock: "Out of Stock",
    in_stock: "In Stock",
    features: "Features",
    specifications: "Specifications",

    // Actions
    add_to_cart: "Add to Cart",
    buy_now: "Buy Now",
    view_product: "View Product",
    remove_from_favorites: "Remove from favorites",
    add_to_favorites: "Add to favorites",
    edit_product: "Edit",
    delete_product: "Delete product",
    save_changes: "Save changes",
    propose_resell_price: "Propose resell price",
    resell: "resell",
    send_message: "Send message",
    contact_seller: "Contact seller",
    whatsapp_contact: "Contact via WhatsApp",
    confirm: "Confirm",

    new_product: "Add product",
    // Status and states
    boosted_product: "Boosted product",
    revendable_product: "Revendable product",
    premium_merchant: "Premium Merchant",
    not_specified: "Not specified",
    added_on: "Added on",
    views: "views",
    rating: "Rating",
    not_rated: "Not rated",
    unknown: "Unknown",
    my_products: "My Products",

    // User interface
    product_name: "Product name",
    price_fcfa: "Price (FCFA)",
    available_stock: "Available stock",
    search_category: "Search a category",
    product_photos: "Product photos",
    image_preview: "Image preview",
    add_more_photos: "Add more photos",
    add_photos: "Add photos",
    previous_image: "Previous image",
    next_image: "Next image",
    go_to_image: "Go to image {{number}}",
    view_image: "View image {{number}}",
    zoom_image: "Zoom image",
    zoomed_image: "Zoomed image",
    similar_products: "Similar products",
    about_merchant: "About the merchant",
    view_merchant_profile: "View merchant profile",
    view_merchant: "View merchant",

    // Revente
    make_revendable: "Make this product revendable",
    minimum_margin_fcfa: "Minimum margin (FCFA)",
    minimum_margin_placeholder: "Minimum margin for revente",
    resell_on: "resell on {{name}}",
    resell_on_product: "resell on this product",
    propose_resell_description: "Propose a resale price (minimum: {{min}} XAF)",
    resell_price_fcfa: "Resell price (XAF)",
    resell_price_for: "Resell price for {{name}}",
    potential_margin: "Potential margin",
    send_revente_request: "Send revente request",

    // Boost
    customize_boost: "Customize Boost",
    view_target: "View target",
    estimated_cost: "Estimated cost",
    tokens: "Tokens",

    // Error messages and validation
    unauthorized_edit: "You are not authorized to edit this product",
    unauthorized_delete: "You are not authorized to delete this product",
    product_updated: "Product updated successfully",
    update_error: "Error updating product",
    product_deleted: "Product deleted successfully",
    delete_error: "Error deleting product",
    login_to_resell: "Please login to resell",
    cannot_resell_own_product:
      "You cannot resell on your own product",
    product_not_revendable: "This product is not open for revente",
    resell_price_too_low:
      "Resell price must be greater than or equal to {{min}} XAF",
    revente_request_sent: "Revente request sent",
    only_owner_can_boost: "Only the owner merchant can boost this product",
    not_enough_tokens:
      "Not enough Tokens. You need {{cost}} Tokens for this boost.",
    product_boosted: "Product boosted successfully",
    boost_error: "Error boosting product",
    favorite_error: "Error updating favorites",
    login_to_message: "Please login to start a conversation",
    product_not_found: "Product not found",

    // SEO and accessibility
    product_seo_description: "Discover this product on Espace Cameroun",
    product_image_alt: "Image of {{name}} - {{index}}",
    no_description_available: "No description available",
    collab: "collab",
    boosted: "Boosted",

    // Confirmations
    delete_confirmation:
      'Are you sure you want to delete "{{name}}"? This action is irreversible.',
    edit_product_description: "Update your product information",
  },
};
