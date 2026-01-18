<template>
    <div class="admin-blog">
        <div class="header-section">
            <h1><i class="fas fa-blog"></i> Gestion du Blog</h1>
            <button @click="openCreateModal" class="btn-primary">
                <i class="fas fa-plus"></i> Nouvel Article
            </button>
        </div>

        <!-- Stats Cards -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon published">
                    <i class="fas fa-check-circle"></i>
                </div>
                <div class="stat-info">
                    <h3>{{ publishedCount }}</h3>
                    <p>Articles Publiés</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon draft">
                    <i class="fas fa-file-alt"></i>
                </div>
                <div class="stat-info">
                    <h3>{{ draftCount }}</h3>
                    <p>Brouillons</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon total">
                    <i class="fas fa-newspaper"></i>
                </div>
                <div class="stat-info">
                    <h3>{{ totalPosts }}</h3>
                    <p>Total Articles</p>
                </div>
            </div>
        </div>

        <!-- Posts Table -->
        <div class="table-container">
            <div v-if="loading" class="loading-state">
                <i class="fas fa-spinner fa-spin"></i> Chargement...
            </div>
            <table v-else class="posts-table">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Titre</th>
                        <th>Auteur</th>
                        <th>Statut</th>
                        <th>Vues</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="post in posts" :key="post.id">
                        <td>
                            <div class="post-image">
                                <img v-if="post.image" :src="post.image" :alt="post.title">
                                <div v-else class="no-image">
                                    <i class="fas fa-image"></i>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div class="post-title">
                                {{ post.title }}
                                <small>{{ post.excerpt?.substring(0, 60) }}...</small>
                            </div>
                        </td>
                        <td>{{ post.author?.nom || 'N/A' }}</td>
                        <td>
                            <span :class="['status-badge', post.is_published ? 'published' : 'draft']">
                                <i :class="post.is_published ? 'fas fa-check-circle' : 'fas fa-clock'"></i>
                                {{ post.is_published ? 'Publié' : 'Brouillon' }}
                            </span>
                        </td>
                        <td>
                            <span class="views-count">
                                <i class="fas fa-eye"></i> {{ post.views_count }}
                            </span>
                        </td>
                        <td>{{ formatDate(post.created_at) }}</td>
                        <td>
                            <div class="action-buttons">
                                <button @click="togglePublish(post)" class="btn-icon" :title="post.is_published ? 'Dépublier' : 'Publier'">
                                    <i :class="post.is_published ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                                </button>
                                <button @click="editPost(post)" class="btn-icon" title="Modifier">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button @click="deletePost(post)" class="btn-icon danger" title="Supprimer">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div v-if="!loading && posts.length === 0" class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>Aucun article pour le moment</p>
            </div>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.lastPage > 1" class="pagination">
            <button @click="changePage(pagination.currentPage - 1)" :disabled="pagination.currentPage === 1" class="btn-page">
                <i class="fas fa-chevron-left"></i> Précédent
            </button>
            <span class="page-info">Page {{ pagination.currentPage }} / {{ pagination.lastPage }}</span>
            <button @click="changePage(pagination.currentPage + 1)" :disabled="pagination.currentPage === pagination.lastPage" class="btn-page">
                Suivant <i class="fas fa-chevron-right"></i>
            </button>
        </div>

        <!-- Modal Create/Edit -->
        <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>{{ editingPost ? 'Modifier l\'Article' : 'Nouvel Article' }}</h2>
                    <button @click="closeModal" class="btn-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="savePost">
                        <div class="form-group">
                            <label>Titre *</label>
                            <input v-model="form.title" type="text" required placeholder="Titre de l'article">
                        </div>

                        <div class="form-group">
                            <label>Extrait</label>
                            <textarea v-model="form.excerpt" rows="3" placeholder="Court résumé de l'article"></textarea>
                        </div>

                        <div class="form-group">
                            <label>Contenu *</label>
                            <textarea v-model="form.content" rows="10" required placeholder="Contenu complet de l'article"></textarea>
                        </div>

                        <div class="form-group">
                            <label>Image</label>
                            <input type="file" @change="handleImageUpload" accept="image/*">
                            <div v-if="imagePreview" class="image-preview">
                                <img :src="imagePreview" alt="Preview">
                                <button type="button" @click="removeImage" class="btn-remove-image">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        </div>

                        <div class="form-group checkbox-group">
                            <label>
                                <input v-model="form.is_published" type="checkbox">
                                <span>Publier immédiatement</span>
                            </label>
                        </div>

                        <div class="modal-actions">
                            <button type="button" @click="closeModal" class="btn-secondary">Annuler</button>
                            <button type="submit" :disabled="saving" class="btn-primary">
                                <i v-if="saving" class="fas fa-spinner fa-spin"></i>
                                {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import apiClient from '../../api/index';
import { Post } from '../../stores/blog';

const posts = ref<Post[]>([]);
const loading = ref(false);
const saving = ref(false);
const showModal = ref(false);
const editingPost = ref<Post | null>(null);
const imagePreview = ref<string | null>(null);

const pagination = ref({
    currentPage: 1,
    lastPage: 1,
    perPage: 20,
    total: 0
});

const form = ref({
    title: '',
    excerpt: '',
    content: '',
    image: null as File | null,
    is_published: false
});

const publishedCount = computed(() => posts.value.filter(p => p.is_published).length);
const draftCount = computed(() => posts.value.filter(p => !p.is_published).length);
const totalPosts = computed(() => posts.value.length);

onMounted(() => {
    fetchPosts();
});

const fetchPosts = async (page = 1) => {
    loading.value = true;
    try {
        const response = await apiClient.get(`/admin/blog/posts?page=${page}`);
        const data = response.data.data;
        posts.value = data.data;
        pagination.value = {
            currentPage: data.current_page,
            lastPage: data.last_page,
            perPage: data.per_page,
            total: data.total
        };
    } catch (error) {
        console.error('Error fetching posts:', error);
        alert('Erreur lors du chargement des articles');
    } finally {
        loading.value = false;
    }
};

const openCreateModal = () => {
    editingPost.value = null;
    form.value = {
        title: '',
        excerpt: '',
        content: '',
        image: null,
        is_published: false
    };
    imagePreview.value = null;
    showModal.value = true;
};

const editPost = (post: Post) => {
    editingPost.value = post;
    form.value = {
        title: post.title,
        excerpt: post.excerpt || '',
        content: post.content,
        image: null,
        is_published: post.is_published
    };
    imagePreview.value = post.image;
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
    editingPost.value = null;
    imagePreview.value = null;
};

const handleImageUpload = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
        form.value.image = target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.value = e.target?.result as string;
        };
        reader.readAsDataURL(target.files[0]);
    }
};

const removeImage = () => {
    form.value.image = null;
    imagePreview.value = null;
};

const savePost = async () => {
    saving.value = true;
    try {
        const formData = new FormData();
        formData.append('title', form.value.title);
        formData.append('content', form.value.content);
        if (form.value.excerpt) formData.append('excerpt', form.value.excerpt);
        if (form.value.image) formData.append('image', form.value.image);
        formData.append('is_published', form.value.is_published ? '1' : '0');

        if (editingPost.value) {
            await apiClient.post(`/admin/blog/posts/${editingPost.value.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        } else {
            await apiClient.post('/admin/blog/posts', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        }

        closeModal();
        fetchPosts(pagination.value.currentPage);
        alert('Article enregistré avec succès !');
    } catch (error: any) {
        console.error('Error saving post:', error);
        alert(error.response?.data?.message || 'Erreur lors de l\'enregistrement');
    } finally {
        saving.value = false;
    }
};

const togglePublish = async (post: Post) => {
    try {
        await apiClient.patch(`/admin/blog/posts/${post.id}/toggle-publish`);
        fetchPosts(pagination.value.currentPage);
    } catch (error) {
        console.error('Error toggling publish:', error);
        alert('Erreur lors du changement de statut');
    }
};

const deletePost = async (post: Post) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${post.title}" ?`)) return;
    
    try {
        await apiClient.delete(`/admin/blog/posts/${post.id}`);
        fetchPosts(pagination.value.currentPage);
        alert('Article supprimé avec succès');
    } catch (error) {
        console.error('Error deleting post:', error);
        alert('Erreur lors de la suppression');
    }
};

const changePage = (page: number) => {
    if (page >= 1 && page <= pagination.value.lastPage) {
        fetchPosts(page);
    }
};

const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};
</script>

<style scoped>
.admin-blog {
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
}

.header-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.header-section h1 {
    font-size: 1.8rem;
    color: #1a1a1a;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.btn-primary {
    background: var(--espace-vert, #14532d);
    color: white;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s;
}

.btn-primary:hover {
    background: #0f3d21;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(20, 83, 45, 0.3);
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.stat-card {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 1rem;
}

.stat-icon {
    width: 60px;
    height: 60px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: white;
}

.stat-icon.published {
    background: linear-gradient(135deg, #10b981, #059669);
}

.stat-icon.draft {
    background: linear-gradient(135deg, #f59e0b, #d97706);
}

.stat-icon.total {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.stat-info h3 {
    font-size: 2rem;
    margin: 0;
    color: #1a1a1a;
}

.stat-info p {
    margin: 0;
    color: #6b7280;
    font-size: 0.9rem;
}

.table-container {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.posts-table {
    width: 100%;
    border-collapse: collapse;
}

.posts-table thead {
    background: #f9fafb;
}

.posts-table th {
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    color: #374151;
    border-bottom: 2px solid #e5e7eb;
}

.posts-table td {
    padding: 1rem;
    border-bottom: 1px solid #f3f4f6;
}

.post-image {
    width: 60px;
    height: 60px;
    border-radius: 8px;
    overflow: hidden;
}

.post-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.no-image {
    width: 100%;
    height: 100%;
    background: #f3f4f6;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #9ca3af;
}

.post-title {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.post-title small {
    color: #6b7280;
    font-size: 0.85rem;
}

.status-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.375rem 0.75rem;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 600;
}

.status-badge.published {
    background: #d1fae5;
    color: #065f46;
}

.status-badge.draft {
    background: #fef3c7;
    color: #92400e;
}

.views-count {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: #6b7280;
}

.action-buttons {
    display: flex;
    gap: 0.5rem;
}

.btn-icon {
    background: #f3f4f6;
    border: none;
    width: 36px;
    height: 36px;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.btn-icon:hover {
    background: #e5e7eb;
    transform: translateY(-2px);
}

.btn-icon.danger:hover {
    background: #fee2e2;
    color: #dc2626;
}

.loading-state, .empty-state {
    padding: 3rem;
    text-align: center;
    color: #6b7280;
}

.empty-state i {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: #d1d5db;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-top: 2rem;
}

.btn-page {
    padding: 0.5rem 1rem;
    border: 1px solid #e5e7eb;
    background: white;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-page:hover:not(:disabled) {
    background: #f9fafb;
    border-color: var(--espace-vert, #14532d);
}

.btn-page:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.page-info {
    color: #6b7280;
    font-weight: 500;
}

/* Modal Styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
}

.modal-content {
    background: white;
    border-radius: 12px;
    max-width: 800px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
    margin: 0;
    font-size: 1.5rem;
}

.btn-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #6b7280;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    transition: all 0.2s;
}

.btn-close:hover {
    background: #f3f4f6;
}

.modal-body {
    padding: 1.5rem;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #374151;
}

.form-group input[type="text"],
.form-group textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.2s;
}

.form-group input[type="text"]:focus,
.form-group textarea:focus {
    outline: none;
    border-color: var(--espace-vert, #14532d);
}

.form-group input[type="file"] {
    width: 100%;
    padding: 0.5rem;
    border: 1px dashed #d1d5db;
    border-radius: 8px;
    cursor: pointer;
}

.image-preview {
    margin-top: 1rem;
    position: relative;
    display: inline-block;
}

.image-preview img {
    max-width: 200px;
    max-height: 200px;
    border-radius: 8px;
}

.btn-remove-image {
    position: absolute;
    top: -8px;
    right: -8px;
    background: #ef4444;
    color: white;
    border: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.checkbox-group label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
}

.checkbox-group input[type="checkbox"] {
    width: 20px;
    height: 20px;
    cursor: pointer;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
}

.btn-secondary {
    padding: 0.75rem 1.5rem;
    border: 1px solid #d1d5db;
    background: white;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s;
}

.btn-secondary:hover {
    background: #f9fafb;
}

.btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

@media (max-width: 768px) {
    .admin-blog {
        padding: 1rem;
    }

    .header-section {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
    }

    .posts-table {
        font-size: 0.85rem;
    }

    .posts-table th,
    .posts-table td {
        padding: 0.5rem;
    }
}
</style>
