<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <div class="mb-8">
      <router-link
        to="/admin/dashboard"
        class="text-gray-500 hover:text-[var(--espace-vert)] transition-colors mb-4 inline-block"
      >
        <i class="fas fa-arrow-left mr-2"></i> Retour au Dashboard
      </router-link>
      <div class="flex justify-between items-end">
        <h1 class="text-3xl font-bold text-gray-800">
          Gestion des Partenaires
        </h1>
        <button
          @click="openModal()"
          class="px-6 py-3 bg-[var(--espace-vert)] text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-green-500/20 transition-all flex items-center gap-2"
        >
          <i class="fas fa-plus"></i> Ajouter un partenaire
        </button>
      </div>
    </div>

    <!-- Filters & Search -->
    <div
      class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between"
    >
      <div class="relative w-full md:w-96">
        <input
          v-model="search"
          type="text"
          placeholder="Rechercher par nom, boutique..."
          class="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[var(--espace-vert)] transition-all"
        />
        <i
          class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        ></i>
      </div>
      <div class="flex gap-4">
        <select
          v-model="statusFilter"
          class="bg-gray-50 border-none rounded-2xl px-6 py-3 focus:ring-2 focus:ring-[var(--espace-vert)]"
        >
          <option value="">Tous les statuts</option>
          <option value="prospect">Prospects</option>
          <option value="partenaire">Partenaires</option>
          <option value="inactif">Inactifs</option>
        </select>
      </div>
    </div>

    <!-- Partners Table -->
    <div
      class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <table class="w-full">
        <thead>
          <tr class="bg-gray-50 text-left">
            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
              Partenaire / Boutique
            </th>
            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
              Contact
            </th>
            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
              Situation
            </th>
            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
              Statut
            </th>
            <th
              class="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr
            v-for="partner in filteredPartners"
            :key="partner.id"
            class="hover:bg-gray-50/50 transition-colors"
          >
            <td class="px-6 py-4">
              <div>
                <div class="font-bold text-gray-800">
                  {{ partner.nom_boutique }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ partner.nom_responsable }}
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <i class="fas fa-phone text-gray-400"></i>
                {{ partner.telephone }}
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-gray-600 font-medium">
                {{ partner.marche }}
              </div>
              <div v-if="partner.numero_boutique" class="text-xs text-gray-400">
                Box: {{ partner.numero_boutique }}
              </div>
            </td>
            <td class="px-6 py-4">
              <span
                class="text-[10px] font-bold px-2 py-1 rounded-full border uppercase"
                :class="getStatusColor(partner.statut)"
              >
                {{ partner.statut }}
              </span>
            </td>
            <td class="px-6 py-4 text-right">
              <div class="flex justify-end gap-2">
                <button
                  @click="openModal(partner)"
                  class="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  title="Modifier"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  @click="deletePartner(partner.id)"
                  class="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Supprimer"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty State -->
      <div v-if="filteredPartners.length === 0" class="p-12 text-center">
        <div
          class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <i class="fas fa-store-slash text-gray-300 text-2xl"></i>
        </div>
        <p class="text-gray-500">Aucun partenaire trouvé.</p>
      </div>
    </div>

    <!-- Edit/Add Modal -->
    <div
      v-if="modalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4"
    >
      <div
        class="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up max-h-[90vh] overflow-y-auto"
      >
        <div
          class="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50"
        >
          <h3 class="text-xl font-bold text-gray-800">
            {{ isEditing ? "Modifier le partenaire" : "Nouveau partenaire" }}
          </h3>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <form @submit.prevent="submitForm" class="p-6 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Nom de la Boutique</label
              >
              <input
                v-model="form.nom_boutique"
                required
                type="text"
                class="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[var(--espace-vert)]"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Responsable</label
              >
              <input
                v-model="form.nom_responsable"
                required
                type="text"
                class="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[var(--espace-vert)]"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Téléphone</label
              >
              <input
                v-model="form.telephone"
                required
                type="tel"
                class="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[var(--espace-vert)]"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Marché</label
              >
              <input
                v-model="form.marche"
                required
                type="text"
                class="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[var(--espace-vert)]"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >N° Boutique</label
              >
              <input
                v-model="form.numero_boutique"
                type="text"
                class="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[var(--espace-vert)]"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Statut</label
            >
            <select
              v-model="form.statut"
              class="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[var(--espace-vert)]"
            >
              <option value="prospect">Prospect</option>
              <option value="partenaire">Partenaire</option>
              <option value="inactif">Inactif</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Notes</label
            >
            <textarea
              v-model="form.notes"
              rows="3"
              class="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[var(--espace-vert)]"
            ></textarea>
          </div>

          <div class="pt-4 flex gap-3">
            <button
              type="button"
              @click="closeModal"
              class="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="flex-1 px-4 py-3 bg-[var(--espace-vert)] text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-green-500/20 transition-all disabled:opacity-50"
            >
              <span v-if="isSubmitting"
                ><i class="fas fa-spinner animate-spin mr-2"></i
                >Traitement...</span
              >
              <span v-else>{{
                isEditing ? "Mettre à jour" : "Enregistrer"
              }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive } from "vue";
import { useAdminStore } from "../../stores/admin";

const adminStore = useAdminStore();
const search = ref("");
const statusFilter = ref("");
const modalOpen = ref(false);
const isSubmitting = ref(false);
const isEditing = ref(false);
const editingId = ref("");

const form = reactive({
  nom_boutique: "",
  nom_responsable: "",
  telephone: "",
  marche: "",
  numero_boutique: "",
  statut: "prospect",
  notes: "",
});

onMounted(() => {
  adminStore.fetchPartenaires();
});

const filteredPartners = computed(() => {
  let result = adminStore.partenaires || [];

  if (statusFilter.value) {
    result = result.filter((p) => p.statut === statusFilter.value);
  }

  if (search.value) {
    const q = search.value.toLowerCase();
    result = result.filter(
      (p) =>
        p.nom_boutique.toLowerCase().includes(q) ||
        p.nom_responsable.toLowerCase().includes(q) ||
        p.marche.toLowerCase().includes(q),
    );
  }

  return result;
});

const getStatusColor = (status: string) => {
  switch (status) {
    case "partenaire":
      return "bg-green-50 text-green-600 border-green-100";
    case "prospect":
      return "bg-blue-50 text-blue-600 border-blue-100";
    case "inactif":
      return "bg-gray-50 text-gray-500 border-gray-200";
    default:
      return "bg-gray-50 text-gray-500";
  }
};

const openModal = (partner: any = null) => {
  if (partner) {
    isEditing.value = true;
    editingId.value = partner.id;
    Object.assign(form, {
      nom_boutique: partner.nom_boutique,
      nom_responsable: partner.nom_responsable,
      telephone: partner.telephone,
      marche: partner.marche,
      numero_boutique: partner.numero_boutique,
      statut: partner.statut,
      notes: partner.notes,
    });
  } else {
    isEditing.value = false;
    editingId.value = "";
    Object.assign(form, {
      nom_boutique: "",
      nom_responsable: "",
      telephone: "",
      marche: "",
      numero_boutique: "",
      statut: "prospect",
      notes: "",
    });
  }
  modalOpen.value = true;
};

const closeModal = () => {
  modalOpen.value = false;
};

const submitForm = async () => {
  isSubmitting.value = true;
  try {
    if (isEditing.value) {
      await adminStore.updatePartenaire(editingId.value, form);
    } else {
      await adminStore.createPartenaire(form);
    }
    closeModal();
  } catch (e) {
    alert("Une erreur est survenue.");
  } finally {
    isSubmitting.value = false;
  }
};

const deletePartner = async (id: string) => {
  if (confirm("Êtes-vous sûr de vouloir supprimer ce partenaire ?")) {
    try {
      await adminStore.deletePartenaire(id);
    } catch (e) {
      alert("Erreur lors de la suppression");
    }
  }
};
</script>
