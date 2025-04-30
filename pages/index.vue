<template>
    <div>
        <div class="py-6">
            <h1 class="text-2xl">Trending</h1>
        </div>

        <div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-4">
                <figure class="p-2 border border-[#1b273b] rounded-lg shadow-sm" v-for="(item, index) in items" :key="index">
                    <img class="max-w-full rounded-lg" :src="getImageUrl(item.poster_path)" :alt="item.title">
                    <figcaption class="text-lg mt-2 text-center text-[#dfe0ee]">{{ item.title || item.name }}</figcaption>
                </figure>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    layout: 'default',
    data() {
        return {
            items: [],
        }
    },
    mounted() {
        this.fetchData() 
    },
    methods: {
        fetchData() {
            this.$axios.get('trending/all/day?language=en-US')
                .then(response => {
                    this.items = response.data.results
                    console.log(this.items)
                })
                .catch(error => {
                    console.error('Error fetching data:', error)
                })
        },
        getImageUrl(posterPath) {
            // Construct the full image URL using the base path
            const baseUrl = 'https://image.tmdb.org/t/p/original';
            return posterPath ? `${baseUrl}${posterPath}` : 'https://via.placeholder.com/300x450?text=No+Image';
        }
    },
}

</script>