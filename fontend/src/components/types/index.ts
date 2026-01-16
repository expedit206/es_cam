export interface User {
  id: string;
  nom: string;
  email: string | null;
  telephone: string;
  ville: string | null;
  favoris_count: number;
  premium: boolean;
  jetons: number;
  parrain_id: number | null;
  parrainage_code: string | null;
  photo: string | null;
  quartier: string | null;
  est_verifie: string | null;
  date_naissance: string | null;
  solde: string;
  products_count: number;
  subscription_ends_at: string | null;
  token: string | null;
  token_expires_at: string | null;
  conversations_count: number;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

// src/types/product.ts
export interface Product {
  id: string;
  nom: string;
  prix: number; // Stored as string in the data, consider converting to number if needed
  quantite: number;
  description: string | null;
  ville: string;
  created_at: string;
  updated_at: string;
  categoryProduit_id: string;
  revendable: boolean; // 0 or 1, could be boolean if converted
  commercant_id: string;
  boosted: boolean;
  condition: string;
  favorites_count: number;
  is_favorited_by: boolean;
  is_promoted: boolean;
  marge_min: number; // Stored as string, consider converting to number if needed
  photos: string[];
  photo_url: string | null;
  raw_views_count: string;
  views_count: string;
  // Stored as string, consider number if applicable
  score: string; // Stored as string, consider number if applicable
  counts: any | null; // Adjust type if you know the structure of counts
  category: {
    id: string;
    nom: string;
    created_at: string;
    updated_at: string;
  };
  user: User;
}

export interface Service {
  id: number;
  user_id: number;
  category_id: number;
  titre: string;
  description: string;
  type_service: "prix_fixe" | "tarif_horaire" | "negociable";
  prix: number | null;
  devise: "XAF" | "EUR" | "USD";
  annees_experience: number | null;
  competences: string[];
  qualifications: string | null;
  localisation: string;
  ville: string;
  disponibilite: "disponible" | "indisponible";
  horaires_disponibilite: { [key: string]: string[] } | null;
  images: string[];
  note_moyenne: number;
  nombre_avis: number;
  date_publication: string;
  date_modification: string;
  date_expiration: string | null;
  views_count: string;
  favorites_count: number;

  // Relations
  user?: User;
  category: {
    id: string;
    nom: string;
    created_at: string;
    updated_at: string;
  }; // avis?: AvisService[];
}

export interface Parrainage {
  id: number;
  filleul_nom: string | null;
  date_inscription: string;
  est_commercant: boolean;
  // Ajoutez d'autres propriétés si nécessaire (par exemple, id, email, etc.)
}

export interface Message {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
  is_read: boolean;
  product_id: string | null;
  product: Product | null;
  sender_id: string | undefined;
  receiver_id: string | undefined;
  type: string; // 'text' ou 'audio'
  audio_url: string | null;
  sender: {
    id: string | undefined;
    nom: string;
    email: string | null;
    telephone: string | null;
    ville: string | null;
    premium: boolean;
    parrain_id: string | undefined;

    role?: string; // Added
  };
  receiver: {
    id: string | undefined;
    nom: string;
    email: string | null;
    telephone: string | null;
    ville: string | null;
    premium: boolean;
    parrain_id: undefined;
    role?: string; // Added
  };

  isTemporary?: boolean; // Pour les messages en attente d'envoi
}

// src/types/commercant.ts
export interface Commercant {
  id: string;
  nom: string;
  description?: string | null;
  ville?: string;
  logo?: string | null;
  user_id: number;

  email_verified_at: string | null;

  email: string | null;
  telephone: string | null;
  created_at: string;
  updated_at: string;
}

// src/types/transaction.ts
export interface Transaction {
  id: number;
  user_id: number;
  montant: number;
  nombre_jetons: number;
  methode_paiement: string;
  transaction_id_mesomb: string;
  statut: string;
  date_transaction: string;
  phone_number: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Category {
  id: string;
  nom: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Revente {
  id: number;
  produit: Product;
  produit_id: string;
  prix_revente: string;
  statut: string;
  gains_totaux: string;
  revendeur_id: number;
  revendeur: User;
  created_at: string | null;
  updated_at: string | null;
}

export interface Wallet {
  id: number;
  phone_number: string; // Numéro de téléphone associé
  payment_service: string; // Service de paiement (enumération)
  is_active?: boolean; // Statut actif (optionnel)
  created_at?: string; // Date de création (optionnel)
  updated_at?: string; // Date de mise à jour (optionnel)
}

export interface Offer {
  id: number;
  user: User; // L'utilisateur qui propose l'offre
  nombre_jetons: number; // Nombre de jetons proposés
  prix_unitaire: number; // Prix par jeton en FCFA
  total_prix: number; // Prix total de l'offre
  date_creation: string; // Date de publication
  wallet?: Wallet; // Portefeuille associé (optionnel)
}

export interface Conversation {
  user_id: string;
  name: string;
  profile_photo: string | null;
  last_message: string;
  last_message_type: string;
  unread_count: number;
  updated_at: string;
}

export interface MessageGroup {
  date: string;
  messages: Message[];
}

export interface TypingState {
  isTyping: boolean;
  userId: number | null;
}

export interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  recordingTime: number;
  audioChunks: BlobPart[];
  mediaRecorder: MediaRecorder | null;
}