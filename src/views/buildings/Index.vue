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
            viewBuildings: 10,
            resultSelected: false,
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
                    console.log('Risposta API:', res.data);
                    store.buildings = res.data.buildings.map(building => {
                        building.isSponsored = building.sponsorships.length > 0;
                        return building;
                    });
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
            this.resultSelected = true;
            this.getApiBuildings();
        },
        resetFilters() {
            this.searchResults = [];
            this.menuVisible = false;
            store.radius = '100000';
            store.roomsFilter = 'all';
            store.bedsFilter = 'all';
            store.bathsFilter = 'all';
            this.selectedServices = [];
        },
        resetSearch() {
            this.search = '';
            this.searchResults = [];
            this.menuVisible = false;
            // // Ricarica l'intera pagina
            window.location.reload(true);
        },
        showMore() {
            this.viewBuildings += 10;
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
        },
    },
    created() {
        if (this.search !== '') {
            this.getCoordinatesFromAddress();
        } else {
            this.getApiBuildings();
        }
    },

};
</script>

<template>
    <div>
        <div id="top"></div>
        <div class="searchbar">

            <div class=" address-container col-12">
                <div class="input-search position-relative">
                    <input type="text" class="form-control" name="search" id="search" v-model="this.search"
                        @input="handleInput" placeholder="Dove: Cerca destinazioni">
                    <i class="clear-icon fa-solid fa-xmark" @click="resetSearch" v-show="search.length > 0"></i>
                    <div class="menu-autocomplete card position-absolute w-100 radius" :class="{ 'd-none': !menuVisible }">
                        <ul class="list ps-0">
                            <li v-for="(result, index) in searchResults" :key="index" @click="selectResult(result)">
                                {{ result.address.freeformAddress }}
                            </li>
                        </ul>
                    </div>
                </div>
                <button class="btn-filters setting-btn" type="button" data-bs-toggle="collapse"
                    data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                    <span class="bar bar1"></span>
                    <span class="bar bar2"></span>
                    <span class="bar bar1"></span>
                </button>
            </div>
            <!-- Inizio collpase filtri -->
            <div class="collapse big-collapse mt-2" id="collapseExample">
                <div class="card card-body shadow-sm">
                    <div class=" row">
                        <div class="select-filter col-6 col-sm-12 d-flex justify-content-around">
                            <!-- Raggio -->
                            <div class="ray-container">
                                <div class="d-flex align-items-center gap-1">
                                    <label class="label" for="radius">Raggio</label>

                                    <button class="button-select">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                            stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"></path>
                                        </svg>
                                        <div>
                                            <span class="src-icon" data-bs-toggle="collapse"
                                                data-bs-target="#collapseExample0" aria-expanded="false"
                                                aria-controls="collapseExample0">
                                                <i class="fa-solid fa-compass"></i>
                                            </span>
                                        </div>
                                    </button>
                                </div>
                                <div class="collapse" id="collapseExample0">
                                    <input type="range" class="form-range" min="50000" max="100000" step="25000"
                                        v-model="store.radius">
                                    <span class="label">{{ (store.radius / 1000) }} km</span>
                                </div>
                            </div>
                            <!-- Stanze -->
                            <div class="rooms-container">
                                <div class="d-flex align-items-center gap-1">
                                    <label class="label" for="roomsFilter">Stanze</label>

                                    <button class="button-select">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                            stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"></path>
                                        </svg>

                                        <span class="src-icon" data-bs-toggle="collapse" data-bs-target="#collapseExample1"
                                            aria-expanded="false" aria-controls="collapseExample1">
                                            <i class="fa-solid fa-person-shelter"></i>
                                        </span>
                                    </button>
                                </div>
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
                                <div class="d-flex align-items-center gap-1">
                                    <label class="label" for="bedsFilter">Letti</label>

                                    <button class="button-select">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                            stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"></path>
                                        </svg>

                                        <span class="src-icon" data-bs-toggle="collapse" data-bs-target="#collapseExample2"
                                            aria-expanded="false" aria-controls="collapseExample2">
                                            <i class="fa-solid fa-bed"></i>
                                        </span>
                                    </button>
                                </div>
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
                                <div class="d-flex align-items-center gap-1">
                                    <label class="label" for="bathsFilter">Bagni</label>

                                    <button class="button-select">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                            stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"></path>
                                        </svg>

                                        <span class="src-icon" data-bs-toggle="collapse" data-bs-target="#collapseExample3"
                                            aria-expanded="false" aria-controls="collapseExample3">
                                            <i class="fa-solid fa-shower"></i>
                                        </span>
                                    </button>
                                </div>
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
                        <div class="col-6 col-sm-12">
                            <div class="services-filter">
                                <div class="services form-check ps-0 text-center" v-for="service in servicesOptions"
                                    :key="service.value">
                                    <input type="checkbox" class="btn-check" name="options-outlined" :id="service.value"
                                        v-model="selectedServices" :value="service" />
                                    <label class="btn btn-outline-success w-100 fw-semibold" :for="service.value">{{
                                        service.label
                                    }}</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="text-center mt-2">
                        <button class="btn reset-bnt" @click="resetFilters">Reset</button>
                    </div>
                </div>
            </div>
            <!-- Fine collpase filtri -->
        </div>

        <div class="section-building">
            <div class="container">
                <p class="fw-bold mb-1" v-if="resultSelected">{{ store.buildings.length }} alloggi in questa località: {{ search }}</p>
                <div class="row cards" v-if="store.buildings.length > 0">
                    <BuildingCard v-for="(building, index) in store.buildings.slice(0, viewBuildings)" :building="building"
                        :key="building.id" />
                </div>
                <div class="loading" v-else>
                    <p>Non ci sono risultati</p>
                </div>
                <div class="text-center mt-4">
                    <button v-if="viewBuildings < store.buildings.length" class="btn load-more-btn" @click="showMore">Mostra
                        di più
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>

.button-select {
    background-color: #ffffff00;
    color: #5B8E81;
    width: 3.5em;
    border: #00000000 0.2em solid;
    border-radius: 11px;
    text-align: right;
    transition: all 0.6s ease;
    line-height: normal;
}

.button-select svg {
    width: 20px;
    position: absolute;
    display: flex;
    transition: all 0.6s ease;
}

.button-select:hover svg {
    transform: translateX(5px);
}

.section-building {
    padding: 30px 0px;
    margin-top: 60px;
}

.searchbar {
    position: fixed;
    z-index: 3;
    background: linear-gradient(90deg, rgba(209, 219, 217, 0.7) 0%, rgba(238, 241, 235, 0.7) 79%, rgba(245, 246, 247, 0.7) 95%, rgba(245, 246, 247, 0.7) 100%);
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
    }

    .input-search input {
        background-color: white;
        border: none;
        padding: 1rem;
        font-size: 1rem;
        border-radius: 50px;
        color: #5B8E81;
        box-shadow: 0 0.4rem #dfd9d9;
        cursor: pointer;

        &:focus {
            border: 2px solid #5B8E81;
        }
    }

    .clear-icon {
        position: absolute;
        right: 19px;
        top: 20px;
        cursor: pointer;
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

    .btn {
        border-radius: 10px;
        --bs-btn-font-size: 11px;
        --bs-btn-padding-x: 3px;
        --bs-btn-padding-y: 2px;
    }

    .address {
        margin-right: 20px;
    }

    .src-icon,
    .arrow {
        color: #5B8E81;
        cursor: pointer;
    }

    .src-icon:hover {
        color: #D1BE68;
    }
}

.cards {
    padding: 10px 0px;
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

.services {
    width: 150px;
}

.services-filter {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 10px;
}

.select-filter {
    text-align: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
}

.collapse select {
    width: 130px;
}

.ray-container,
.rooms-container,
.beds-container,
.baths-container {
    width: 130px;
}

.form-range {
    height: 0px;

    &::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 15px;
        height: 15px;
        background: #5B8E81;
        cursor: pointer;

        &:hover {
            opacity: 0.7;
        }
    }
}

// Bottone filtri
.setting-btn {
    width: 38px;
    height: 38px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    background-color: #5b8e81;
    border-radius: 50px;
    cursor: pointer;
    border: none;
    // box-shadow: 0px 0px 0px 2px rgb(212, 209, 255);
}

// Bottone Reset
.reset-bnt {
    padding: 2px 32px;
    background-color: red;
    border: none;
    color: white;
    font-weight: bold;
}

.bar {
    width: 50%;
    height: 2px;
    background-color: rgb(229, 229, 229);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border-radius: 2px;
}

.bar::before {
    content: "";
    width: 2px;
    height: 2px;
    background-color: rgb(126, 117, 255);
    position: absolute;
    border-radius: 50%;
    border: 2px solid white;
    transition: all 0.3s;
    box-shadow: 0px 0px 5px white;
}

.bar1::before {
    transform: translateX(-4px);
}

.bar2::before {
    transform: translateX(4px);
}

.setting-btn:hover .bar1::before {
    transform: translateX(4px);
}

.setting-btn:hover .bar2::before {
    transform: translateX(-4px);
}

.big-collapse {
    width: 60%;
    margin-right: 15px;
}

@media (max-width: 575.98px) {
    .big-collapse {
        width: 80%;
        margin-right: 41px;
    }

    .searchbar label {
        font-size: 8px;
    }

    .services {
        width: 100%;
    }

    .services-filter {
        gap: 0px;
    }

    .select-filter {
        text-align: start;
        margin-bottom: 0px;
        flex-wrap: wrap;
        align-items: center;
    }

    .ray-container,
    .rooms-container,
    .beds-container,
    .baths-container {
        width: 100%;
    }

    .collapse select {
        width: 100%;
    }
}
</style>