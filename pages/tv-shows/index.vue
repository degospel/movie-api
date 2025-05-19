<template>
    <div class="p-4">
        <div>
            <div class="flex items-center justify-between mb-5">
                <div class="py-6">
                    <h1 class="text-2xl">Trending Tv-Shows</h1>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-[#1b273b] rounded-lg">
                    <!-- Genre Filter -->
                    <el-select
                        v-model="selectedGenre"
                        placeholder="Filter by Genre"
                        size="large"
                        style="width: 240px"
                        @change="onFilterChange"
                        clearable
                    >
                        <el-option label="All Genres" :value="null" />
                        <el-option
                            v-for="genre in genres"
                            :key="genre.id"
                            :label="genre.name"
                            :value="genre.name"
                        />
                    </el-select>
                    <!-- Sort Select -->
                    <el-select
                        v-model="selectedSort"
                        placeholder="Sort by"
                        size="large"
                        style="width: 240px"
                        @change="onFilterChange"
                        clearable
                    >
                        <el-option label="Default" value="" />
                        <el-option label="Popularity Desc" value="popularity.desc" />
                        <el-option label="Popularity Asc" value="popularity.asc" />
                    </el-select>
                    <!-- Year Filter -->
                    <el-select
                        v-model="selectedYear"
                        placeholder="Filter by Year"
                        size="large"
                        style="width: 240px"
                        @change="onFilterChange"
                        clearable
                    >
                        <el-option label="All Years" :value="null" />
                        <el-option
                            v-for="year in years"
                            :key="year"
                            :label="year"
                            :value="year"
                        />
                    </el-select>
                </div>
            </div>
        </div>

        <div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols gap-4">
                <figure class="p-2 border border-[#1b273b] rounded-lg shadow-sm cursor-pointer" v-for="(show, index) in shows" :key="index" @click="viewPage(show.id)">
                    <img class="max-w-full rounded-lg" :src="getImageUrl(show.poster_path)" :alt="show.name">
                    <figcaption class="text-lg mt-2 text-center text-[#dfe0ee]">{{ show.name }}</figcaption>
                </figure>
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

        <!-- <pre>{{ shows }}</pre> -->
    </div>
</template>

<script>
export default {
    data() {
        return {
            shows: [],
            totalPages: 1,
            currentPage: parseInt(this.$route.query.page) || 1,
            genres: [],
            selectedGenre: null,
            selectedSort: '',
            selectedYear: null,
            years: [],
        }
    },
    mounted() {
        this.getGenres();
        this.generateYears();
        // Read filters from route params
        const { page, genre, sort, year } = this.$route.query;
        this.currentPage = parseInt(page) || 1;
        this.selectedGenre = genre || null;
        this.selectedSort = sort || '';
        this.selectedYear = year ? Number(year) : null;
        this.getShows(this.currentPage);
    },
    watch: {
        '$route.query'(newQuery) {
            this.currentPage = parseInt(newQuery.page) || 1;
            this.selectedGenre = newQuery.genre || null;
            this.selectedSort = newQuery.sort || '';
            this.selectedYear = newQuery.year ? Number(newQuery.year) : null;
            this.getShows(this.currentPage);
        }
    },
    methods: {
        getGenres() {
            this.$axios.get('genre/tv/list?language=en-US')
                .then(response => {
                    this.genres = response.data.genres;
                })
                .catch(error => {
                    console.error('Error fetching genres:', error)
                });
        },
        generateYears() {
            const currentYear = new Date().getFullYear();
            const startYear = 1980;
            this.years = [];
            for (let y = currentYear; y >= startYear; y--) {
                this.years.push(y);
            }
        },
        getShows(page = 1) {
            let params = {
                language: 'en-US',
                page: page,
            };
            // Find genre id by name for API
            if (this.selectedGenre) {
                const genreObj = this.genres.find(g => g.name === this.selectedGenre);
                if (genreObj) params.with_genres = genreObj.id;
            }
            if (this.selectedSort) {
                params.sort_by = this.selectedSort;
            }
            if (this.selectedYear) {
                params.first_air_date_year = this.selectedYear;
            }
            // Use 'discover/tv' for filtering/sorting, fallback to 'trending/tv/day' for default
            const endpoint = this.selectedGenre || this.selectedSort || this.selectedYear ? 'discover/tv' : 'trending/tv/day';
            this.$axios.get(endpoint, { params })
                .then(response => {
                    this.shows = response.data.results;
                    this.totalPages = response.data.total_pages;
                })
                .catch(error => {
                    console.error('Error fetching data:', error)
                })
        },
        getImageUrl(posterPath) {
            // Construct the full image URL using the base path
            const baseUrl = 'https://image.tmdb.org/t/p/original';
            return posterPath ? `${baseUrl}${posterPath}` : 'https://flowbite.com/docs/images/examples/image-1@2x.jpg';
        },
        viewPage(id) {
            this.$router.push('/tv-shows/view/' +id)
        },
        changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                const query = {};
                if (page !== 1) query.page = page;
                if (this.selectedGenre) query.genre = this.selectedGenre;
                if (this.selectedSort) query.sort = this.selectedSort;
                if (this.selectedYear) query.year = this.selectedYear;
                this.$router.push({ query });
                this.$nextTick(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
            }
        },
        onFilterChange() {
            const query = {};
            if (this.selectedGenre) query.genre = this.selectedGenre;
            if (this.selectedSort) query.sort = this.selectedSort;
            if (this.selectedYear) query.year = this.selectedYear;
            if (this.currentPage !== 1) query.page = this.currentPage;
            this.$router.push({ query });
            this.getShows(this.currentPage);
        },
    }
}
</script>

<style>

</style>