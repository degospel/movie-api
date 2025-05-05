<!-- filepath: c:\Users\USER\Desktop\movie-api\pages\search.vue -->
<template>
    <div class="p-4">
        <div class="py-6">
            <h1 class="text-2xl">Search Results for "{{ $route.query.q }}"</h1>
        </div>

        <div>
            <!-- Show message if no results are found -->
            <div v-if="items.length === 0" class="text-center text-lg text-gray-400">
                No results found for "{{ $route.query.q }}".
            </div>

            <!-- Display search results -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-4">
                <figure class="p-2 border border-[#1b273b] rounded-lg shadow-sm" v-for="(item, index) in items" :key="index">
                    <img class="max-w-full rounded-lg" :src="getImageUrl(item.poster_path)" :alt="item.title">
                    <figcaption class="text-lg mt-2 text-center text-[#dfe0ee]">{{ item.title || item.name }}</figcaption>
                </figure>
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
        },
    },
};
</script>