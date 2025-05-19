<template>
    <div class="w-full">
        <div class="h-[90vh] w-full bg-position-[center_top_1rem] bg-no-repeat relative" :style="{ backgroundImage: `url(${getImageposterUrl(items.backdrop_path)})`, backgroundSize: 'cover' }">
            <!-- Dark Overlay -->
            <div class="absolute inset-0 bg-slate-950 bg-opacity-70"></div>

            <div class="relative z-10 flex flex-col justify-end p-4 h-full w-full">
                <div class="grid grid-cols-1 md:grid-cols-5 gap-8 items-end">

                    <!-- Poster -->
                    <div class="hidden md:block md:col-span-1">
                        <div class="relative h-50 w-auto overflow-hidden rounded-lg shadow-2xl">
                            <img class="w-full h-full object-cover" :src="getImageposterUrl(items.poster_path)" :alt="items.name">
                        </div>
                    </div>

                    <!-- Info -->
                    <div class="md:col-span-4">
                        <div class="flex flex-wrap gap-2 mb-4">
                            <span class="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2 py-1.5 rounded-lg dark:bg-gray-700 dark:text-blue-400 border border-blue-400" v-for="genre in items.genres" :key="genre">
                                {{ genre.name }}
                            </span>
                        </div>

                        <div>
                            <h1 class="text-white text-5xl mb-4">{{ items.title || items.name }}</h1>
                        </div>

                        <div class="text-gray-300 mb-3">
                            <span>{{ formatYear(items.first_air_date) }}</span>
                            <span class="mx-2">•</span>
                            <span>{{ items.number_of_seasons }} Seasons</span>
                            <span class="mx-2">•</span>
                            <span>{{ items.number_of_episodes }} Episodes</span>
                            <span class="mx-2">•</span>
                            <span>{{ items.status }}</span>
                        </div>

                        <div class="flex items-center space-x-4 mb-6">
                            <div class="flex items-center">
                                <div class="mr-3">
                                    <el-rate
                                        v-model="computedVoteValue"
                                        disabled
                                        show-score
                                        text-color="#dfe0dc"
                                        size="large"
                                        :score-template="`${voteValue}/10`"
                                    />
                                </div>
                                <div class="px-4 py-1 bg-white/10 backdrop-blur-sm rounded-full flex items-center">
                                    <span class="text-white font-semibold mr-1">{{ items.vote_count }}</span>
                                    <span class="text-gray-300 text-sm">votes</span>
                                </div>
                            </div>
                        </div>

                        <div class="text-gray-300 text-lg mb-6 max-w-3xl">
                            {{ items.overview }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment';

export default {
    data() {
        return {
            items: "",
            voteValue: "",
        }
    },
    computed: {
        page_id() {
            return this.$route.params.id;
        },
        computedVoteValue() {
            return this.voteValue / 2;
        },
    },
    mounted() {
        this.tvShowDetails();
    },
    methods: {
        tvShowDetails() {
            this.$axios.get(`tv/${this.page_id}`)
                .then(response => {
                    this.items = response.data;
                    this.voteValue = response.data.vote_average;
                    console.log('seriesdetails:', this.items);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                })
        },
        getImageposterUrl(backdropPath) {
            // Construct the full image URL using the base path
            const baseUrl = 'https://image.tmdb.org/t/p/original';
            return backdropPath ? `${baseUrl}${backdropPath}` : 'https://via.placeholder.com/300x450?text=No+Image';
        },
        formatYear(date) {
            // Format the date to just the year
            return moment(date).format('YYYY');
        },
    }
}
</script>

<style>

</style>