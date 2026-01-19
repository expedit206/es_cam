import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/auth/Login.vue";
import Gallery from "../views/Gallery.vue";
import Register from "../views/auth/Register.vue";
import Profile from "../views/Profile.vue";
import Parametres from "../views/Parametres.vue";
import Home from "../views/Home.vue";
import Parrainage from "../views/Parrainage.vue";
import Reventes from "../views/Reventes.vue";
import JetonMarket from "../views/JetonMarket.vue";
import { useAuthStore } from "../stores/Auth";
import ParrainageInfo from "../views/ParrainageInfo.vue";
import Messages from "../views/Messages.vue";
import AchatJetonModal from "../components/AchatJetonModal.vue";
import JetonHistory from "../views/JetonHistory.vue";
import ProfilePublic from "../views/ProfilePublic.vue";
import Doc from "../views/Doc.vue";
import Politique from "../views/Politique_confidentialite.vue";
import Politique_confidentialite from "../views/Politique_confidentialite.vue";
import Politique_utilisation from "../views/politique_utilisation.vue";
import SubscriptionModal from "../components/SubscriptionModal.vue";

// @ts-ignore

import NotificationPermission from "../components/notifications/NotificationPermission.vue";
import ResetPassword from "../views/ResetPassword.vue";
import MesServices from "../components/mesServices/MesServices.vue";
import ShowService from "../views/services/ShowService.vue";
import ShowProduit from "../views/produits/ShowProduit.vue";
import AdminDashboard from "../views/admin/AdminDashboard.vue";
import AdminUsers from "../views/admin/AdminUsers.vue";
import AdminMarketplace from "../views/admin/AdminMarketplace.vue";
import AdminCategories from "../views/admin/AdminCategories.vue";
import CategoriesView from "../views/CategoriesView.vue";

const routes = [
  { path: "/login", component: Login, name: "login" },
  { path: "/register/:code?", component: Register, name: "register" },
  {
    path: "/categories",
    component: CategoriesView,
    name: "categories",
  },
  {
    path: "/profil",
    component: Profile,
    name: "profil",
  },
  {
    path: "/favoris",
    component: () => import("../views/Favoris.vue"),
    name: "favoris",
    meta: { requiresAuth: true }
  },
  {
    path: "/market-place",
    component: Home,
    name: "home",
  },
  {
    path: "/acceuil",
    component: Doc,
    name: "acceuil",
  },
  { path: "/", redirect: "/acceuil" },
  {
    path: "/gallery",
    name: "My_gallery",
    component: Gallery,
  },


  {
    path: "/doc/:code?",
    name: "doc",
    component: Doc,
  },
  {
    path: "/parametres",
    component: Parametres,
  },
  {
    path: "/parrainage",
    component: Parrainage,
    name: "parrainage",
  },
  { path: "/parrainage/info", component: ParrainageInfo },
  {
    path: "/messages",
    component: Messages,
  },
  {
    path: "/messages/:receiverId",
    component: Messages,
    name: "messages",
  },
  { path: "/produits/:id", name: "produit", component: ShowProduit },
  {
    path: "/reventes",
    name: "reventes",
    component: Reventes,
  },
  {
    path: "/premium",
    name: "premium",
    component: SubscriptionModal,
  },
  {
    path: "/profile/public/:id",
    name: "public-profile",
    component: ProfilePublic,
  },
  {
    path: "/notification",
    name: "notification",
    component: NotificationPermission,
  },
  {
    path: "/jeton-history",
    name: "jeton-history",
    component: JetonHistory,
  },
  {
    path: "/acheter-jetons",
    name: "acheter-jetons",
    component: AchatJetonModal,
  },
  {
    path: "/jetonMarket",
    name: "jetonMarkert",
    component: JetonMarket,
  },
  {
    path: "/politique-confidentialite",
    name: "politique_confidentialite",
    component: Politique_confidentialite,
  },
  {
    path: "/politique-utilisation",
    name: "politique_utilisation",
    component: Politique_utilisation,
  },

  {
    path: "/auth/google/callback",
    name: "GoogleCallback",
    component: () => import("../components/GoogleCallback.vue"),
  },

  {
    path: "/reset-password",
    name: "resetPassword",
    component: ResetPassword,

  },
  {
    path: "/mesServices",
    name: "mesServices",
    component: MesServices,

  },

  {
    path: "/services/:id",
    name: "showService",
    component: ShowService,
  },

  // Blog Routes
  {
    path: "/blog",
    name: "blog",
    component: () => import("../views/blog/Blog.vue"),
  },
  {
    path: "/blog/:slug",
    name: "blog-post",
    component: () => import("../views/blog/BlogPost.vue"),
  },

  // Admin Routes
  {
    path: "/admin/dashboard",
    name: "admin-dashboard",
    component: AdminDashboard,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: "/admin/users",
    name: "admin-users",
    component: AdminUsers,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: "/admin/marketplace",
    name: "admin-marketplace",
    component: AdminMarketplace,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: "/admin/categories",
    name: "admin-categories",
    component: AdminCategories,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: "/admin/finance",
    name: "admin-finance",
    component: () => import("../views/admin/AdminFinance.vue"), // Lazy load
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: "/admin/broadcast",
    name: "admin-broadcast",
    component: () => import("../views/admin/AdminBroadcast.vue"),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: "/admin/blog",
    name: "admin-blog",
    component: () => import("../views/admin/AdminBlog.vue"),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  // Toujours vérifier l'auth si on a un token mais pas d'utilisateur
  if (authStore.token && !authStore.user) {
    await authStore.checkAuth();
  }

  // Rediriger vers Home si déjà connecté et tente d'aller sur login/register
  if (authStore.user && (to.name === "login" || to.name === "register")) {
    return next({ name: "home" });
  }

  // Vérifier les routes protégées
  if (to.meta.requiresAuth && !authStore.user) {
    return next({ name: "login" });
  }

  // Vérifier les privilèges Admin
  if (to.meta.requiresAdmin && authStore.user?.role !== 'admin') {
    return next({ name: "home" });
  }

  next();
});
export default router;