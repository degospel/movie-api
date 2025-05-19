<template>
    <div class="p-4">
        <div class="py-6">
            <h1 class="text-2xl">Trending Content</h1>
        </div>

        <div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-4">
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
        <div class="flex justify-center mt-6">
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
            currentPage: parseInt(this.$route.query.page) || 1, // Get page from route or default to 1
            totalPages: 1, // Total pages will be set dynamically
        }
    },
    mounted() {
        this.fetchData(this.currentPage);
    },
    watch: {
        '$route.query.page'(newPage) {
            this.currentPage = parseInt(newPage) || 1;
            this.fetchData(this.currentPage);
        }
    },
    methods: {
        fetchData(page = 1) {
            this.$axios.get(`trending/all/day?language=en-US&page=${page}`)
                .then(response => {
                    this.items = response.data.results;
                    this.totalPages = response.data.total_pages; 
                    console.log(this.items);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        },
        getImageUrl(posterPath) {
            // Construct the full image URL using the base path
            const baseUrl = 'https://image.tmdb.org/t/p/original';
            return posterPath ? `${baseUrl}${posterPath}` : 'https://via.placeholder.com/300x450?text=No+Image';
        },
        changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                if (page === 1) {
                    // Remove the `page` query parameter for the first page
                    this.$router.push({ query: {} });
                } else {
                    // Add the `page` query parameter for other pages
                    this.$router.push({ query: { page } });
                }
            }
            this.$nextTick(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
        },
    },
}

</script>