<template>
    <nav class="bg-white min-h-[10vh] border-gray-200 dark:bg-gray-900">
        <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <nuxt-link to="/" class="flex items-center space-x-3 rtl:space-x-reverse">
                <img src="https://flowbite.com/docs/images/logo.svg" class="h-8" alt="Flowbite Logo" />
                <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">MovieFelx</span>
            </nuxt-link>



            <button data-collapse-toggle="navbar-default" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
                <span class="sr-only">Open main menu</span>
                <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
                </svg>
            </button>

            <div class="hidden w-full md:block md:w-auto" id="navbar-default">
                <ul class="font-medium flex flex-col items-center p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                    
                    <li>
                        <nuxt-link 
                            to="/" 
                            :class="isActive('/') ? 'text-blue-700' : 'text-gray-900 dark:text-white dark:hover:text-white'"
                            class="block py-2 px-3 rounded-sm md:p-0"
                            aria-current="page"
                        >
                            Home
                        </nuxt-link>
                    </li>
                    <li>
                        <nuxt-link 
                            to="/movies" 
                            :class="isActive('/movies') ? 'text-blue-700' : 'text-gray-900 dark:text-white dark:hover:text-white'"
                            class="block py-2 px-3 rounded-sm md:p-0"
                        >
                            Movie
                        </nuxt-link>
                    </li>
                    <li>
                        <nuxt-link
                            to="/tv-shows" 
                            :class="isActive('/tv-shows') ? 'text-blue-700' : 'text-gray-900 dark:text-white dark:hover:text-white'"
                            class="block py-2 px-3 rounded-sm md:p-0"
                        >
                            TV-Show
                        </nuxt-link>
                    </li>
                    
                    <div class="relative hidden md:block">
                        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                            </svg>
                            <span class="sr-only">Search icon</span>
                        </div>
                        <input type="text" v-model="searchQuery" @keyup.enter="performSearch" id="search-navbar" class="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search...">
                    </div>
                </ul>
            </div>
        </div>
    </nav>

    <div class="w-full bg-[#0d1b2b] min-h-[90vh] text-slate-50">
        <NuxtPage/>
    </div>

</template>

<script>
import { useRoute } from 'vue-router';

export default {
    data() {
        return {
            searchQuery: '',
        };
    },
    methods: {
        performSearch() {
            if (this.searchQuery.trim()) {
                this.$router.push({ name: 'search', query: { q: this.searchQuery } });
            }
        },
    },
    setup() {
        const route = useRoute();

        const isActive = (path) => {
            // Make sure root path ("/") only matches exactly
            if (path === '/') return route.path === '/';
            // For other paths, match any subroute
            return route.path.startsWith(path);
        };

        return {
            isActive,
        };
    },
};
</script>