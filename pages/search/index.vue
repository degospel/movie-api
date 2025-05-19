<!-- filepath: c:\Users\USER\Desktop\movie-api\pages\search.vue -->
<template>
    <div class="p-4">
        <div class="py-6">
            <h1 class="text-2xl">Search Results for "{{ $route.query.q }}"</h1>
        </div>

        <div>
            <!-- Show message if no results are found -->
            <div v-if="items.length === 0" class="text-center text-lg text-gray-400">
                <!-- No results found for "{{ $route.query.q }}". -->

                <!-- SVG Illustration -->
                <svg width="100%" height="200" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="30" y="40" width="120" height="100" rx="8" fill="#F3F4F6"/>
                    <rect x="45" y="55" width="90" height="70" rx="4" fill="#fff"/>
                    <circle cx="90" cy="90" r="30" fill="#E5E7EB"/>
                    <circle cx="90" cy="90" r="20" fill="#fff"/>
                    <path d="M110 120 L130 140" stroke="#A1A1AA" stroke-width="4" stroke-linecap="round"/>
                    <circle cx="130" cy="140" r="8" fill="#F3F4F6" stroke="#A1A1AA" stroke-width="2"/>
                    <ellipse cx="90" cy="90" rx="8" ry="5" fill="#A1A1AA"/>
                    <path d="M85 85 Q90 80 95 85" stroke="#A1A1AA" stroke-width="2" fill="none"/>
                    <circle cx="90" cy="90" r="30" fill="none" stroke="#A1A1AA" stroke-width="2"/>
                    <!-- Sad face -->
                    <path d="M82 98 Q90 105 98 98" stroke="#A1A1AA" stroke-width="2" fill="none"/>
                </svg>
                <div class="mt-6 text-2xl font-semibold text-gray-400">No Results to show</div>
            </div>

            <!-- Display search results -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-4">
                <!-- <figure class="p-2 border border-[#1b273b] rounded-lg shadow-sm" v-for="(item, index) in items" :key="index">
                    <img class="max-w-full rounded-lg" :src="getImageUrl(item.poster_path)" :alt="item.title">
                    <figcaption class="text-lg mt-2 text-center text-[#dfe0ee]">{{ item.title || item.name }}</figcaption>
                </figure> -->


                <div class="p-2 border border-[#1b273b] rounded-lg shadow-sm" v-for="(item, index) in items" :key="index">
                    <router-link
                        v-if="item.media_type === 'movie'"
                        :to="`/movies/view/${item.id}`"
                        class="block"
                    >
                        <img class="max-w-full rounded-lg" :src="getImageUrl(item.poster_path)" :alt="item.title">
                        <figcaption class="text-lg mt-2 text-center text-[#dfe0ee]">{{ item.title }}</figcaption>
                    </router-link>
                    <router-link
                        v-else-if="item.media_type === 'tv'"
                        :to="`/tv-shows/view/${item.id}`"
                        class="block"
                    >
                        <img class="max-w-full rounded-lg" :src="getImageUrl(item.poster_path)" :alt="item.name">
                        <figcaption class="text-lg mt-2 text-center text-[#dfe0ee]">{{ item.name }}</figcaption>
                    </router-link>
                    <figure v-else>
                        <img class="max-w-full rounded-lg" :src="getImageUrl(item.poster_path)" :alt="item.title || item.name">
                        <figcaption class="text-lg mt-2 text-center text-[#dfe0ee]">{{ item.title || item.name }}</figcaption>
                    </figure>
                </div>
            </div>
        </div>

        <!-- Pagination Controls -->
        <div class="flex justify-center mt-6" v-if="totalPages > 1">
            <button 
                class="px-4 py-2 mx-2 bg-gray-700 text-white rounded" 
                :disabled="currentPage === 1" 
                @click="changePage(currentPage - 1)">
                Previous
            </button>
            <span class="px-4 py-2 mx-2 text-white">Page {{ currentPage }} of {{ totalPages }}</span>
            <button 
                class="px-4 py-2 mx-2 bg-gray-700 text-white rounded" 
                :disabled="currentPage === totalPages" 
                @click="changePage(currentPage + 1)">
                Next
            </button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            items: [],
            currentPage: parseInt(this.$route.query.page) || 1,
            totalPages: 1,
        };
    },
    watch: {
        '$route.query.q': 'fetchSearchResults',
        '$route.query.page': 'fetchSearchResults',
    },
    mounted() {
        this.fetchSearchResults();
    },
    methods: {
        fetchSearchResults() {
            const query = this.$route.query.q;
            const page = parseInt(this.$route.query.page) || 1;

            if (query) {
                this.$axios.get(`search/multi?query=${query}&language=en-US&page=${page}`)
                    .then(response => {
                        this.items = response.data.results;
                        this.totalPages = response.data.total_pages;
                        console.log(this.items)
                    })
                    .catch(error => {
                        console.error('Error fetching search results:', error);
                    });
            }
        },
        getImageUrl(posterPath) {
            const baseUrl = 'https://image.tmdb.org/t/p/original';
            return posterPath ? `${baseUrl}${posterPath}` : 'https://battlearchitects.com/wp-content/uploads/2017/06/488px-No-Image-Placeholder.svg_.png';
        },
        changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.$router.push({ query: { ...this.$route.query, page } });
            }
            this.$nextTick(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
        },
    },
};
</script>