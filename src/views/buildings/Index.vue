<script>
import BuildingCard from "../../components/BuildingCard.vue";
import axios from "axios";
import { store } from "../../store";

export default {
    components: {
        BuildingCard,
    },
    data() {
        return {
            store,
            search: '',
            searchResults: [],
            menuVisible: false,
            currentPage: 1,
            startPage: 1,
            itemsPerPage: 10,
            totalPages: 1,
            bedsOptions: [
                { value: 'all', label: 'Tutti' },
                { value: 'range_1', label: 'Fino a 25 letti' },
                { value: 'range_2', label: 'Da 26 a 50 letti' },
                { value: 'range_3', label: 'Più di 50 letti' },
            ],
            roomsOptions: [
                { value: 'all', label: 'Tutti' },
                { value: 'range_1', label: 'Fino a 25 stanze' },
                { value: 'range_2', label: 'Da 26 a 50 stanze' },
                { value: 'range_3', label: 'Più di 50 stanze' },
            ],
            bathsOptions: [
                { value: 'all', label: 'Tutti' },
                { value: 'range_1', label: 'Fino a 2 bagni' },
                { value: 'range_2', label: 'Da 3 a 6 bagni' },
                { value: 'range_3', label: 'Più di 6 bagni' },
            ],
            selectedServices: [],
            servicesOptions: [
                { value: 'Wi-Fi', label: 'Wi-Fi' },
                { value: 'Piscina', label: 'Piscina' },
                { value: 'Ristorante', label: 'Ristorante' },
                { value: 'Palestra', label: 'Palestra' },
                { value: 'Servizio in camera', label: 'Servizio in camera' },
                { value: 'Colazione inclusa', label: 'Colazione inclusa' },
                { value: 'Parcheggio', label: 'Parcheggio' },
                { value: 'Centro benessere', label: 'Centro benessere' },
                { value: 'Navetta aeroportuale', label: 'Navetta aeroportuale' },
                { value: 'Animali ammessi', label: 'Animali ammessi' },
                { value: 'Reception 24 ore', label: 'Reception 24 ore' },
            ],
        };
    },
    methods: {
        getCoordinatesFromAddress() {
            axios
                .get(`https://api.tomtom.com/search/2/search/${this.search}.json`, {
                    params: {
                        key: "pqHD68XXAijUehCtM4HFFAVamZjQMA1W",
                        'limit': '5'
                    },
                })
                .then((response) => {
                    console.log(response);
                    this.searchResults = response.data.results;
                    const firstResult = response.data.results[0];
                    if (firstResult) {
                        store.lat = firstResult.position.lat;
                        store.lon = firstResult.position.lon;
                    } else {
                        console.error(
                            "Nessun risultato valido ottenuto dalla ricerca di coordinate"
                        );
                    }
                })
                .catch((error) => {
                    console.error("Errore nella richiesta di coordinate:", error);
                });
        },
        getApiBuildings() {
            axios
                .get(`${store.BASE_URL}/buildings`, {
                    params: {
                        'rad': store.radius,
                        'lat': store.lat,
                        'lon': store.lon,
                        'rooms': store.rooms,
                        'beds': store.beds,
                        'services': store.services,
                        'beds_filter': store.bedsFilter,
                        'rooms_filter': store.roomsFilter,
                        'baths_filter': store.bathsFilter,
                        'bathrooms': store.bathrooms,
                        'services': this.selectedServices.map(service => service.value),
                    },
                })
                .then((res) => {
                    console.log('Risposta API:', res.data.buildings);
                    this.totalPages = Math.ceil(res.data.buildings.length / this.itemsPerPage);
                    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
                    const endIndex = startIndex + this.itemsPerPage;
                    store.buildings = res.data.buildings.slice(startIndex, endIndex);
                })
                .catch((error) => {
                    console.error('Errore nella richiesta edifici:', error);
                });
        },
        handleInput() {
            if (this.search !== '') {
                this.getCoordinatesFromAddress();
                this.menuVisible = true;
            } else {
                this.menuVisible = false;
                this.searchResults = [];
            }
        },
        selectResult(result) {
            this.search = result.address.freeformAddress;
            this.menuVisible = false;
            this.searchResults = [];
            this.getApiBuildings();
        },
        goToPage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
                this.getApiBuildings();

                const element = document.getElementById('top');
                if (element) {
                    element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        },
    },
    watch: {
        'store.radius': function (newRadius, oldRadius) {
            if (newRadius !== oldRadius) {
                this.getApiBuildings();
            }
        },
        'store.roomsFilter': function (newRoomsFilter, oldRoomsFilter) {
            if (newRoomsFilter !== oldRoomsFilter) {
                this.getApiBuildings();
            }
        },
        'store.bedsFilter': function (newBedsFilter, oldBedsFilter) {
            if (newBedsFilter !== oldBedsFilter) {
                this.getApiBuildings();
            }
        },
        'store.bathsFilter': function (newBathsFilter, oldBathsFilter) {
            if (newBathsFilter !== oldBathsFilter) {
                this.getApiBuildings();
            }
        },
        selectedServices: function (newSelectedServices, oldSelectedServices) {
            if (JSON.stringify(newSelectedServices) !== JSON.stringify(oldSelectedServices)) {
                this.getApiBuildings();
            }
        }
    },
    created() {
        if (this.search !== '') {
            this.getCoordinatesFromAddress();
        } else {
            this.getApiBuildings();
        }
    }
};
</script>

<template>
    <div class="">
        <div id="top"></div>
        <div class="searchbar">

            <div class=" address-container col-12">
                <!-- <label for="address" class="form-label text-secondary mb-0">Cerca destinazioni</label> -->
                <div class="input-search position-relative">
                    <input type="text" class="form-control" name="search" id="search" v-model="this.search"
                        @input="handleInput" placeholder="Dove: Cerca destinazioni">
                    <div class="menu-autocomplete card position-absolute w-100 radius" :class="{ 'd-none': !menuVisible }">
                        <ul class="list ps-0">
                            <li v-for="(result, index) in searchResults" :key="index" @click="selectResult(result)">
                                {{ result.address.freeformAddress }}
                            </li>
                        </ul>
                    </div>
                </div>
                <button class="btn-filters" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample"
                    aria-expanded="false" aria-controls="collapseExample">
                    <img src="/equalizer_filter_filtering_mixer_sorting_icon_123287.png" alt="">
                </button>
            </div>
            <!-- Inizio collpase filtri -->
            <div class="collapse" id="collapseExample" style="min-width: 400px;">
                <div class="card card-body shadow-sm">
                    <div class=" row">
                        <div class="col-6 d-flex flex-column justify-content-center gap-5">
                            <!-- Raggio -->
                            <div class="ray-container">
                                <label class="label" for="radius">Raggio</label>

                                <span class="src-icon" data-bs-toggle="collapse" data-bs-target="#collapseExample0"
                                    aria-expanded="false" aria-controls="collapseExample0">
                                    <i class="fa-solid fa-compass"></i>
                                </span>

                                <div class="collapse" id="collapseExample0">
                                    <select class="form-select form-select" v-model="store.radius">
                                        <option value="50000">50 km</option>
                                        <option value="100000">100 km</option>
                                        <option value="150000">150 km</option>
                                    </select>
                                </div>
                            </div>
                            <!-- Stanze -->
                            <div class="rooms-container">
                                <label class="label" for="roomsFilter">Stanze</label>

                                <span class="src-icon" data-bs-toggle="collapse" data-bs-target="#collapseExample1"
                                    aria-expanded="false" aria-controls="collapseExample1">
                                    <i class="fa-solid fa-person-shelter"></i>
                                </span>

                                <div class="collapse" id="collapseExample1">
                                    <select class="form-select form-select" id="roomsFilter" v-model="store.roomsFilter">
                                        <option v-for="option in this.roomsOptions" :value="option.value"
                                            :key="option.value">
                                            {{ option.label }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <!-- Letti -->
                            <div class="beds-container">
                                <label class="label" for="bedsFilter">Letti</label>

                                <span class="src-icon" data-bs-toggle="collapse" data-bs-target="#collapseExample2"
                                    aria-expanded="false" aria-controls="collapseExample2">
                                    <i class="fa-solid fa-bed"></i>
                                </span>

                                <div class="collapse" id="collapseExample2">
                                    <select class="form-select form-select" id="bedsFilter" v-model="store.bedsFilter">
                                        <option v-for="option in this.bedsOptions" :value="option.value"
                                            :key="option.value">
                                            {{ option.label }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <!-- Bagni -->
                            <div class="baths-container">
                                <label class="label" for="bathsFilter">Bagni</label>

                                <span class="src-icon" data-bs-toggle="collapse" data-bs-target="#collapseExample3"
                                    aria-expanded="false" aria-controls="collapseExample3">
                                    <i class="fa-solid fa-shower"></i>
                                </span>

                                <div class="collapse" id="collapseExample3">
                                    <select class="form-select form-select" id="bathsFilter" v-model="store.bathsFilter">
                                        <option v-for="option in this.bathsOptions" :value="option.value"
                                            :key="option.value">
                                            {{ option.label }}
                                        </option>
                                    </select>
                                </div>

                            </div>
                        </div>
                        <!-- Servizi -->
                        <div class="col-6">
                            <div class="services container d-flex flex-column">
                                <div class="services form-check ps-0 w-100" v-for="service in servicesOptions"
                                    :key="service.value">
                                    <input type="checkbox" class="btn-check" name="options-outlined" :id="service.value"
                                        v-model="selectedServices" :value="service" />
                                    <label class="btn btn-outline-success w-100" :for="service.value">{{ service.label
                                    }}</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Fine collpase filtri -->
        </div>

        <div class="section-building">
            <div class="container">
                <div v-if="store.buildings.length > 0" class="row cards">
                    <BuildingCard v-for="building in store.buildings" :building="building" :key="building.id" />
                </div>
                <div class="loading" v-else>
                    <p>Non ci sono risultati</p>
                </div>
            </div>
        </div>
        <div class="section pb-3">
            <div class="pagination justify-content-center align-items-center gap-4">
                <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
                    class="btn btn-sm btn-outline-warning text-dark border border-0">Prev</button>

                <!-- Visualizza i numeri di pagina precedenti solo se ci sono più di una pagina -->
                <template v-for="pageNumber in Math.min(totalPages, 1)" :key="pageNumber">
                    <button @click="goToPage(pageNumber)"
                        :class="{ 'btn btn-sm btn-outline-warning text-dark': pageNumber === currentPage, 'btn btn-sm btn-outline-secondary': pageNumber !== currentPage }">
                        {{ pageNumber }}
                    </button>
                </template>

                <!-- Aggiungi puntini se ci sono più di due pagine -->
                <template v-if="totalPages > 1">
                    <span>...</span>
                </template>

                <!-- Visualizza i numeri di pagina successivi solo se ci sono più di due pagine e la pagina corrente non è nell'ultima coppia -->
                <template v-if="totalPages > 3 && currentPage < totalPages - 1">
                    <button @click="goToPage(currentPage + 1)"
                        :class="{ 'btn btn-sm btn-outline-warning text-dark': currentPage + 1 === currentPage, 'btn btn-sm btn-outline-secondary': currentPage + 1 !== currentPage }">
                        {{ currentPage + 1 }}
                    </button>
                </template>

                <!-- Aggiungi puntini se ci sono più di tre pagine e la pagina corrente non è nell'ultima coppia -->
                <template v-if="totalPages > 3 && currentPage < totalPages - 1">
                    <span>...</span>
                </template>

                <!-- Visualizza l'ultima pagina -->
                <button @click="goToPage(totalPages)"
                    :class="{ 'btn btn-sm btn-outline-warning text-dark': totalPages === currentPage, 'btn btn-sm btn-outline-success': totalPages !== currentPage }">
                    {{ totalPages }}
                </button>

                <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
                    class="btn btn-sm btn-outline-warning text-dark border border-0">Next</button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.section-building {
    padding: 30px;
    margin-top: 60px;
}

.searchbar {
    position: fixed;
    z-index: 3;
    background-color: rgba(255, 255, 255, 0.95);
    padding: 15px;
    row-gap: 5px;
    display: flex;
    flex-wrap: wrap;
    width: 95%;
    margin: 0 auto;
    justify-content: center;
    align-items: center;

    .label {
        font-size: 12px;
        margin-right: 10px;

    }

    .input-search input {
        box-shadow: rgba(0, 0, 0, 0.15) 0px 3px 3px 0px;
    }

    .menu-autocomplete {
        background-color: white;
        border: 1px solid lightgrey;
        border-radius: 10px;
        padding: 5px 10px;

        li {
            padding: 5px 2px;
            cursor: pointer;

            &:hover {
                background-color: #5b8e819d;
            }
        }
    }

    .btn-filters {
        border-radius: 50px;
        border: none;
        background-color: #5b8e81;
        padding: 5px;

        img {
            width: 25px;
            filter: invert(100%);
        }
    }

    .btn {
        border-radius: 10px;
        --bs-btn-font-size: 11px;
        --bs-btn-padding-x: 3px;
        --bs-btn-padding-y: 2px;
    }

    .address {
        margin-right: 20px;
    }

    .src-icon {
        color: #5B8E81;
        cursor: pointer;
    }

    .src-icon:hover {
        color: #D1BE68;
    }
}

.active {
    color: #3b7ed6;
    font-weight: bold;
}

.cards {
    padding: 10px 20px;
    row-gap: 30px;
}

.loading {
    padding: 50px;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    justify-content: center;
    align-items: center;

    p {
        font-size: 30px;
    }

    img {
        height: 200px;
    }
}

.address-container {
    display: flex;
    gap: 10px;
    align-items: center;

    .input-search {
        flex-grow: 1;

        input {
            border-radius: 50px;
            border: 1px solid #5B8E81;
        }
    }
}

select {
    font-size: 10px;
}

.wrap-b {
    display: flex;
    align-items: center;
    justify-content: center;
}

.filter {
    color: #5B8E81;
    font-weight: 400;
}

.button {
    background-color: #5B8E81;
    color: white;
    padding: 2px 10px;
    border-radius: 10px;
    border: none;
}

.button:hover {
    color: #D1BE68;
}
</style>