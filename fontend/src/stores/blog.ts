import { defineStore } from "pinia";
import apiClient from "../api/index";
import { User } from "../components/types";

export interface Post {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    image: string | null;
    video: string | null;
    is_published: boolean;
    published_at: string;
    views_count: number;
    comments_count?: number;
    likes_count?: number;
    is_liked?: boolean;
    author: User;
    created_at: string;
}

interface BlogState {
    posts: Post[];
    currentPost: Post | null;
    isLoading: boolean;
    pagination: {
        currentPage: number;
        lastPage: number;
        perPage: number;
        total: number;
    };
}

export const useBlogStore = defineStore("blog", {
    state: (): BlogState => ({
        posts: [],
        currentPost: null,
        isLoading: false,
        pagination: {
            currentPage: 1,
            lastPage: 1,
            perPage: 10,
            total: 0,
        },
    }),

    actions: {
        async fetchPosts(page = 1) {
            this.isLoading = true;
            try {
                const response = await apiClient.get(`/blog/posts?page=${page}`);
                const data = response.data.data;
                
                this.posts = data.data;
                this.pagination = {
                    currentPage: data.current_page,
                    lastPage: data.last_page,
                    perPage: data.per_page,
                    total: data.total,
                };
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                this.isLoading = false;
            }
        },

        async fetchPostBySlug(slug: string) {
            this.isLoading = true;
            try {
                const response = await apiClient.get(`/blog/posts/${slug}`);
                this.currentPost = response.data.data;
            } catch (error) {
                console.error("Error fetching post:", error);
                this.currentPost = null;
            } finally {
                this.isLoading = false;
            }
        },
    },
});
