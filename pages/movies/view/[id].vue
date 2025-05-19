<template>
    <div class="w-full">
        <div class="h-[90vh] w-full bg-position-[center_top_1rem] bg-no-repeat relative" :style="{ backgroundImage: `url(${getImageposterUrl(items.backdrop_path)})`, backgroundSize: 'cover' }">
            
            <!-- Dark Overlay -->
            <div class="absolute inset-0 bg-slate-950 bg-opacity-70"></div>

            <!-- Content -->
            <div class="relative z-10 flex flex-col justify-end p-4 h-full w-full">
                <div class="grid grid-cols-1 md:grid-cols-5 gap-8 items-end">
                    <!-- Poster -->
                    <div class="hidden md:block md:col-span-1">
                        <div class="relative h-50 w-auto overflow-hidden rounded-lg shadow-2xl">
                            <img class="w-full h-full object-cover" :src="getImageUrl(items.poster_path)" :alt="items.title">
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
                            <span>{{ formatYear(items.release_date) }}</span>
                            <span class="mx-2">•</span>
                            <span>{{ formatRuntime(items.runtime) }}</span>
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

        <!-- <div class="p-4">
            <div class="py-5">
                <h1 class="text-3xl mb-2">Casts</h1>
                <hr class=" border-t-2 border-[#758da9]">
            </div>
            <div class="grid grid-cols-1 md:grid-cols-5 gap-5">
                <div class="w-full h-full flex flex-col items-center justify-center text-center bg-[#1B273B] p-4 rounded-lg" v-for="cast in casts.slice(0, 10)" :key="cast.id">
                    
                    <img class="rounded-full w-[100px] h-[100px]" :src="getImageUrl(cast.profile_path)" :alt="cast.name">
                    <p>{{ cast.name }}</p>
                    <span>{{ cast.character }}</span>

                </div>
            </div>
        </div> -->

        <!-- <div class="p-4">
            <div class="py-5">
                <h1 class="text-3xl mb-2">Photos</h1>
                <hr class=" border-t-2 border-[#758da9]">
            </div>

            <div>
                <swiper
                    :modules="modules"
                    :slides-per-view="3"
                    :loop="true"
                    space-between="20"
                    navigation
                    autoplay
                    class="my-swiper"
                >
                    
                    <swiper-slide v-for="(image, index) in movieImg" :key="index" class="cursor-pointer">
                        <a :href="getImageUrl(image.file_path)" target="_blank" rel="noopener noreferrer">
                            <img :src="getImageUrl(image.file_path)" alt="" class="w-full h-auto rounded-lg">
                        </a>
                    </swiper-slide>
                </swiper>
            </div>
        </div> -->

        
        <!-- <pre>{{ casts }}</ pre> -->
    </div>
</template>

<script>
import moment from 'moment';

import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/swiper-bundle.css';

// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/autoplay';

export default {
    components: {
        Swiper,
        SwiperSlide,
    },
    data() {
        return {
            items: "",
            voteValue: "",
            movieImg: [],
            movieVideo: [],
            casts: [],
            modules: [Navigation, Pagination, Scrollbar, Autoplay],
            
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
    
        this.movieDetails();
        
        this.movieImages();

        this.movieVideos();

        this.castDetails();
    },
    methods: {
        movieDetails() {
            this.$axios.get(`movie/${this.page_id}`)
                .then(response => {
                    this.items = response.data;
                    this.voteValue = response.data.vote_average;
                    console.log('moviedetails:', this.items);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                })
        },
        movieImages() {
            this.$axios.get(`movie/${this.page_id}/images`)
                .then(response => {
                    this.movieImg = response.data.backdrops;
                    console.log('MovieImages:', this.movieImg);
                    // console.log(response.data)
                })
                .catch(error => {
                    console.error('Error fetching data:', error)
                })
        },
        movieVideos() {
            this.$axios.get(`movie/${this.page_id}/videos`)
                .then(response => {
                    this.movieVideo = response.data.results
                    console.log(response.data)
                })
                .catch(error => {
                    console.error('Error fetching data:', error)
                })
        },
        castDetails() {
            this.$axios.get(`movie/${this.page_id}/credits`)
                .then(response => {
                    this.casts = response.data.cast
                    console.log('casts:', this.casts)
                })
                .catch(error => {
                    console.error('Error fetching data:', error)
                })
        },
        getImageposterUrl(backdropPath) {
            // Construct the full image URL using the base path
            const baseUrl = 'https://image.tmdb.org/t/p/original';
            return backdropPath ? `${baseUrl}${backdropPath}` : 'https://via.placeholder.com/300x450?text=No+Image';
        },
        getImageUrl(posterPath) {
            // Construct the full image URL using the base path
            const baseUrl = 'https://image.tmdb.org/t/p/original';
            return posterPath ? `${baseUrl}${posterPath}` : 'https://flowbite.com/docs/images/examples/image-1@2x.jpg';
        },
        getVideoUrl(videoKey) {
            // Construct the YouTube embed URL
            const baseUrl = 'https://www.youtube.com/embed/';
            return videoKey ? `${baseUrl}${videoKey}` : '';
        },
        formatYear(date) {
            // Format the date to just the year
            return moment(date).format('YYYY');
        },
        formatRuntime(runtime) {
            // Convert runtime to hours and minutes
            const hours = Math.floor(runtime / 60);
            const minutes = runtime % 60;
            return `${hours}h ${minutes}m`;
        }
    }
}
</script>

<style>
.my-swiper {
    width: 100%;
    height: auto;
}
</style>