<template>
  <SeoHead 
    :title="t('my reventes') + ' - Espace Cameroun'" 
    :description="t('manage revente proposals')"
    image="/images/reventes-og.jpg" 
  />

  <div class="min-h-screen bg-gray-50">
    <div class="max-w-6xl mx-auto px-4 py-6">
      
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">
          {{ t('manage revente proposals') }}
        </h1>
        <p class="text-gray-600">
          {{ t('manage your resale partnerships') }}
        </p>
      </div>

      <!-- How it works toggle -->
      <div class="mb-6">
        <button 
          @click="reventeStore.toggleExplanation()"
          class="flex items-center gap-2 text-sm text-gray-700 hover:text-green-700 transition-colors"
        >
          <i :class="reventeStore.showExplanation ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
          {{ reventeStore.showExplanation ? t('hide details') : t('how it works') }}
        </button>
      </div>

      <!-- Explanation (collapsed by default) -->
      <div 
        v-if="reventeStore.showExplanation"
        class="bg-white rounded-xl p-6 mb-8 shadow-sm border border-gray-200"
      >
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-3">
            {{ t('reventes on espace cameroun') }}
          </h2>
          <p class="text-gray-600 mb-4">
            {{ t('revente explanation') }}
          </p>
          
          <!-- Steps -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="text-center">
              <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span class="text-green-700 font-bold">1</span>
              </div>
              <h3 class="font-medium text-gray-900 mb-1">{{ t('discovery') }}</h3>
              <p class="text-sm text-gray-600">
                {{ t('discovery description') }}
              </p>
            </div>
            
            <div class="text-center">
              <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span class="text-green-700 font-bold">2</span>
              </div>
              <h3 class="font-medium text-gray-900 mb-1">{{ t('negotiation') }}</h3>
              <p class="text-sm text-gray-600">
                {{ t('negotiation description') }}
              </p>
            </div>
            
            <div class="text-center">
              <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span class="text-green-700 font-bold">3</span>
              </div>
              <h3 class="font-medium text-gray-900 mb-1">{{ t('commission') }}</h3>
              <p class="text-sm text-gray-600">
                {{ t('commission description') }}
              </p>
            </div>
          </div>
          
          <!-- Benefits -->
          <div class="bg-green-50 rounded-lg p-4">
            <h4 class="font-medium text-gray-900 mb-2">{{ t('key advantages') }}</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div class="flex items-center gap-2">
                <i class="fas fa-check text-green-600 text-sm"></i>
                <span class="text-sm text-gray-700">{{ t('no initial investment') }}</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="fas fa-check text-green-600 text-sm"></i>
                <span class="text-sm text-gray-700">{{ t('expand product catalog') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="sticky top-0 bg-gray-50 z-10 pt-2 pb-4">
        <div class="flex border-b border-gray-200">
          <button 
            @click="reventeStore.setActiveTab('received')"
            :class="[
              'flex-1 py-3 text-sm font-medium transition-colors border-b-2',
              reventeStore.activeTab === 'received'
                ? 'border-green-600 text-green-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            ]"
          >
            {{ t('received') }}
            <span class="ml-2 text-xs bg-gray-200 px-2 py-1 rounded-full">
              {{ reventeStore.receivedReventesCount }}
            </span>
          </button>
          
          <button 
            @click="reventeStore.setActiveTab('sent')"
            :class="[
              'flex-1 py-3 text-sm font-medium transition-colors border-b-2',
              reventeStore.activeTab === 'sent'
                ? 'border-green-600 text-green-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            ]"
          >
            {{ t('sent') }}
            <span class="ml-2 text-xs bg-gray-200 px-2 py-1 rounded-full">
              {{ reventeStore.sentReventesCount }}
            </span>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="pt-2">
        <!-- Received requests -->
        <div v-if="reventeStore.activeTab === 'received'">
          <div v-if="reventeStore.hasReceivedReventes" class="space-y-4">
            <div 
              v-for="revente in reventeStore.currentReventes" 
              :key="revente.id"
              class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <!-- Product header -->
              <div class="p-4 border-b border-gray-100">
                <div class="flex gap-3">
                  <!-- Product image -->
                  <div class="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                    <img 
                      v-if="revente.produit?.photos?.[0]" 
                      :src="revente.produit.photos[0]"
                      :alt="revente.produit.nom" 
                      class="w-full h-full object-cover"
                    >
                    <div v-else class="w-full h-full flex items-center justify-center">
                      <i class="fas fa-image text-gray-300"></i>
                    </div>
                  </div>
                  
                  <!-- Product info -->
                  <div class="flex-1 min-w-0">
                    <h3 class="font-medium text-gray-900 truncate">
                      {{ revente.produit?.nom }}
                    </h3>
                    <div class="flex items-center gap-2 mt-1">
                      <span :class="[
                        'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                        getStatusClasses(revente.statut)
                      ]">
                        <i :class="getStatusIcon(revente.statut)"></i>
                        {{ getStatusText(revente.statut) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Details -->
              <div class="p-4 space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">{{ t('proposed price') }}</span>
                  <span class="font-semibold text-gray-900">
                    {{ formatPrice(revente.prix_revente) }}
                  </span>
                </div>
                
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">{{ t('reseller') }}</span>
                  <span class="text-sm font-medium text-gray-900">
                    {{ revente?.revendeur.nom }}
                  </span>
                </div>
                
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">{{ t('date') }}</span>
                  <span class="text-sm text-gray-500">
                    {{ formatDate(revente.created_at) }}
                  </span>
                </div>
              </div>
              
              <!-- Actions -->
              <div class="p-4 border-t border-gray-100 bg-gray-50">
                <div class="flex gap-2">
                  <button 
                    v-if="revente.statut === 'en_attente'"
                    @click="handleUpdateStatus(revente.id, 'valider')"
                    class="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                  >
                    {{ t('accept') }}
                  </button>
                  <button 
                    v-if="revente.statut === 'en_attente'"
                    @click="handleUpdateStatus(revente.id, 'refuser')"
                    class="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                  >
                    {{ t('reject') }}
                  </button>
                  <button 
                    @click="viewProduct(revente.produit_id)"
                    class="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    {{ t('view') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Empty state -->
          <div v-else class="text-center py-12">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-inbox text-gray-400"></i>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              {{ t('no received requests') }}
            </h3>
            <p class="text-gray-600 mb-6 max-w-sm mx-auto">
              {{ t('received requests explanation') }}
            </p>
            <router-link 
              to="/"
              class="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 transition-colors"
            >
              <i class="fas fa-store"></i>
              {{ t('browse products') }}
            </router-link>
          </div>
        </div>
        
        <!-- Sent requests -->
        <div v-if="reventeStore.activeTab === 'sent'">
          <div v-if="reventeStore.hasSentReventes" class="space-y-4">
            <div 
              v-for="revente in reventeStore.currentReventes" 
              :key="revente.id"
              class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <!-- Product header -->
              <div class="p-4 border-b border-gray-100">
                <div class="flex gap-3">
                  <!-- Product image -->
                  <div class="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                    <img 
                      v-if="revente.produit?.photos?.[0]" 
                      :src="revente.produit.photos[0]"
                      :alt="revente.produit.nom" 
                      class="w-full h-full object-cover"
                    >
                    <div v-else class="w-full h-full flex items-center justify-center">
                      <i class="fas fa-image text-gray-300"></i>
                    </div>
                  </div>
                  
                  <!-- Product info -->
                  <div class="flex-1 min-w-0">
                    <h3 class="font-medium text-gray-900 truncate">
                      {{ revente.produit?.nom }}
                    </h3>
                    <div class="flex items-center gap-2 mt-1">
                      <span :class="[
                        'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                        getStatusClasses(revente.statut)
                      ]">
                        <i :class="getStatusIcon(revente.statut)"></i>
                        {{ getStatusText(revente.statut) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Details -->
              <div class="p-4 space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">{{ t('proposed price') }}</span>
                  <span class="font-semibold text-gray-900">
                    {{ formatPrice(revente.prix_revente) }}
                  </span>
                </div>
                
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">{{ t('date') }}</span>
                  <span class="text-sm text-gray-500">
                    {{ formatDate(revente.created_at) }}
                  </span>
                </div>
              </div>
              
              <!-- Actions -->
              <div class="p-4 border-t border-gray-100 bg-gray-50">
                <button 
                  @click="viewProduct(revente.produit_id)"
                  class="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  {{ t('view product') }}
                </button>
              </div>
            </div>
          </div>
          
          <!-- Empty state -->
          <div v-else class="text-center py-12">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-paper-plane text-gray-400"></i>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              {{ t('no sent requests') }}
            </h3>
            <p class="text-gray-600 mb-6 max-w-sm mx-auto">
              {{ t('sent requests explanation') }}
            </p>
            <router-link 
              to="/"
              class="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 transition-colors"
            >
              <i class="fas fa-plus"></i>
              {{ t('propose revente') }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useReventeStore } from '../stores/revente'
import SeoHead from '../components/SeoHead.vue'
import { useI18n } from '../components/useI18n'

const { t } = useI18n()
const reventeStore = useReventeStore()

// Helper functions
const formatPrice = (price: number) => {
  return `${price.toLocaleString()} FCFA`
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const getStatusClasses = (status: string) => {
  const classes = {
    'en_attente': 'bg-yellow-100 text-yellow-800',
    'valider': 'bg-green-100 text-green-800',
    'refuser': 'bg-red-100 text-red-800',
    'annuler': 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getStatusIcon = (status: string) => {
  const icons = {
    'en_attente': 'fas fa-clock',
    'valider': 'fas fa-check-circle',
    'refuser': 'fas fa-times-circle',
    'annuler': 'fas fa-ban'
  }
  return icons[status] || 'fas fa-circle'
}

const getStatusText = (status: string) => {
  const texts = {
    'en_attente': t('pending'),
    'valider': t('accepted'),
    'refuser': t('rejected'),
    'annuler': t('cancelled')
  }
  return texts[status] || status
}

const viewProduct = (productId: number) => {
  reventeStore.viewProduit(productId)
}

const handleUpdateStatus = async (reventeId: number, status: string) => {
  try {
    await reventeStore.updateReventeStatus(reventeId, status)
  } catch (error) {
    console.error('Error updating status:', error)
  }
}

onMounted(async () => {
  await reventeStore.initializeReventes()
})
</script>

<style scoped>
/* Mobile-first responsive design */
@media (min-width: 768px) {
  .max-w-6xl {
    max-width: 72rem;
  }
  
  .px-4 {
    padding-left: 2rem;
    padding-right: 2rem;
  }
  
  .py-6 {
    padding-top: 2rem;
    padding-bottom: 2rem;
  }
}

@media (min-width: 1024px) {
  .space-y-4 > * + * {
    margin-top: 1.5rem;
  }
}

/* Smooth transitions */
.transition-shadow {
  transition: box-shadow 0.2s ease-in-out;
}

.transition-colors {
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out, border-color 0.2s ease-in-out;
}

/* Improve truncation */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>