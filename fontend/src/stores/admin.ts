import { defineStore } from 'pinia';
import apiClient from '../api/index';

export const useAdminStore = defineStore('admin', {
  state: () => ({
    stats: {
      users: { total: 0, premium: 0, today: 0 },
      marketplace: { products_total: 0, services_total: 0, pending_reventes: 0 },
      finance: { total_solde: 0, total_jetons: 0 }
    },
    users: [] as any[],
    products: [] as any[],
    services: [] as any[],
    categories: { products: [] as any[], services: [] as any[] },
    isLoading: false,
    pagination: {
      users: { current: 1, last: 1 },
      products: { current: 1, last: 1 },
      services: { current: 1, last: 1 },
      transactions: { current: 1, last: 1 }
    },
    financeStats: {
      total_volume: 0,
      total_commission: 0,
      platform_sales: 0,
      marketplace_volume: 0
    },
    transactions: [] as any[]
  }),

  actions: {
    async fetchStats() {
      this.isLoading = true;
      try {
        const response = await apiClient.get('/admin/dashboard');
        this.stats = response.data;
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchUsers(page = 1, search = '') {
      this.isLoading = true;
      try {
        const response = await apiClient.get('/admin/users', { params: { page, search } });
        this.users = response.data.data;
        this.pagination.users.current = response.data.current_page;
        this.pagination.users.last = response.data.last_page;
      } catch (error) {
        console.error('Error fetching admin users:', error);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchProducts(page = 1, search = '') {
      this.isLoading = true;
      try {
        const response = await apiClient.get('/admin/produits', { params: { page, search } });
        this.products = response.data.data;
        this.pagination.products.current = response.data.current_page;
        this.pagination.products.last = response.data.last_page;
      } catch (error) {
        console.error('Error fetching admin products:', error);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchServices(page = 1, search = '') {
      this.isLoading = true;
      try {
        const response = await apiClient.get('/admin/services', { params: { page, search } });
        this.services = response.data.data;
        this.pagination.services.current = response.data.current_page;
        this.pagination.services.last = response.data.last_page;
      } catch (error) {
        console.error('Error fetching admin services:', error);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchCategories() {
      try {
        const response = await apiClient.get('/admin/categories');
        this.categories = response.data;
      } catch (error) {
        console.error('Error fetching admin categories:', error);
      }
    },

    async toggleProductStatus(id: string) {
      try {
        await apiClient.patch(`/admin/produits/${id}/toggle-status`);
        const product = this.products.find(p => p.id === id);
        if (product) product.est_actif = !product.est_actif;
      } catch (error) {
        console.error('Error toggling product status:', error);
      }
    },

    async deleteProduct(id: string) {
      try {
        await apiClient.delete(`/admin/produits/${id}`);
        this.products = this.products.filter(p => p.id !== id);
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    },

    async toggleServiceStatus(id: string) {
      try {
        await apiClient.patch(`/admin/services/${id}/toggle-status`);
        const service = this.services.find(s => s.id === id);
        if (service) {
          service.disponibilite = service.disponibilite === 'disponible' ? 'indisponible' : 'disponible';
        }
      } catch (error) {
        console.error('Error toggling service status:', error);
      }
    },

    async deleteService(id: string) {
      try {
        await apiClient.delete(`/admin/services/${id}`);
        this.services = this.services.filter(s => s.id !== id);
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    },

    async deleteUser(id: string) {
      try {
        await apiClient.delete(`/admin/users/${id}`);
        this.users = this.users.filter(u => u.id !== id);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    },

    async updateUserRole(id: string, role: string) {
      try {
        await apiClient.put(`/admin/users/${id}/role`, { role });
        const user = this.users.find(u => u.id === id);
        if (user) user.role = role;
      } catch (error) {
        console.error('Error updating user role:', error);
      }
    },

    async createCategory(nom: string, type: 'product' | 'service', image: File | null = null) {
      try {
        const formData = new FormData();
        formData.append('nom', nom);
        formData.append('type', type);
        if (image) formData.append('image', image);
        
        await apiClient.post('/admin/categories', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        await this.fetchCategories();
      } catch (error) {
        console.error('Error creating category:', error);
        throw error;
      }
    },

    async updateCategory(id: string, name: string, type: 'product' | 'service', image: File | null = null) {
        try {
            const formData = new FormData();
            formData.append('nom', name);
            formData.append('type', type);
            formData.append('_method', 'PUT');
            if (image) formData.append('image', image);

            await apiClient.post(`/admin/categories/${id}`, formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            });
            await this.fetchCategories();
        } catch (error) {
            console.error('Error updating category:', error);
            throw error;
        }
    },

    async deleteCategory(id: string, type: 'product' | 'service') {
      try {
        await apiClient.delete(`/admin/categories/${id}`, { params: { type } });
        await this.fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    },

    async fetchFinanceStats() {
      try {
        const response = await apiClient.get('/admin/finance/stats');
        this.financeStats = response.data;
      } catch (error) {
        console.error('Error fetching finance stats:', error);
      }
    },

    async fetchTransactions(page = 1, search = '', type = '', status = '') {
      this.isLoading = true;
      try {
        const params = { page, search, type, status };
        // Remove empty params
        Object.keys(params).forEach(key => (params as any)[key] === '' && delete (params as any)[key]);
        
        const response = await apiClient.get('/admin/finance/transactions', { params });
        this.transactions = response.data.data;
        this.pagination.transactions.current = response.data.current_page;
        this.pagination.transactions.last = response.data.last_page;
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        this.isLoading = false;
      }
    }
  }
});
