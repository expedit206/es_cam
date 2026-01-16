<!-- src/components/LanguageSwitcher.vue -->
<script setup lang="ts">
import { useI18n } from '../components/useI18n';
import { useRouter } from 'vue-router';

const { t, currentLanguage, setLanguage, availableLanguages } = useI18n();
const router = useRouter();

const handleLanguageChange = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    setLanguage(target.value);
};

</script>

<template>
    <div class="language-switcher">
        <select :value="currentLanguage" @change="handleLanguageChange"
            class="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm cursor-pointer hover:border-gray-400"
            :aria-label="t('language_selector_label')">
            <option v-for="lang in availableLanguages" :key="lang.code" :value="lang.code"
                class="flex items-center gap-2 py-2">
                <span class="text-lg mr-2">{{ lang.flag }}</span>
                {{ lang.nativeName }}
            </option>
        </select>
    </div>
</template>