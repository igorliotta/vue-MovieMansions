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
        bedsOptions: [
            { value: "all", label: "Tutti" },
            { value: "range_1", label: "Fino a 25 letti" },
            { value: "range_2", label: "Da 26 a 50 letti" },
            { value: "range_3", label: "Più di 50 letti" },
        ],
        roomsOptions: [
            { value: "all", label: "Tutti" },
            { value: "range_1", label: "Fino a 25 stanze" },
            { value: "range_2", label: "Da 26 a 50 stanze" },
            { value: "range_3", label: "Più di 50 stanze" },
        ],
        bathsOptions: [
            { value: "all", label: "Tutti" },
            { value: "range_1", label: "Fino a 2 bagni" },
            { value: "range_2", label: "Da 3 a 6 bagni" },
            { value: "range_3", label: "Più di 6 bagni" },
        ],
        };
    },
    methods: {
        getCoordinatesFromAddress() {
        axios
            .get(`https://api.tomtom.com/search/2/search/${store.address}.json`, {
            params: {
                key: "pqHD68XXAijUehCtM4HFFAVamZjQMA1W",
            },
            })
            .then((response) => {
            console.log(response);
            const firstResult = response.data.results[0];
            if (firstResult) {
                store.lat = firstResult.position.lat;
                store.lon = firstResult.position.lon;
                this.getApiBuildings();
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
                rad: store.radius,
                lat: store.lat,
                lon: store.lon,
                rooms: store.rooms,
                beds: store.beds,
                services: store.services,
                beds_filter: store.bedsFilter,
                rooms_filter: store.roomsFilter,
                baths_filter: store.bathsFilter,
                services_filter: store.servicesFilter,
                bathrooms: store.bathrooms,
            },
            })
            .then((res) => {
            console.log(
                "Risposta API:",
                res.data.buildings,
                res.data.allServices
            );
            store.buildings = res.data.buildings;
            store.services = res.data.allServices;
            })
            .catch((error) => {
            console.error("Errore nella richiesta edifici:", error);
            });
        },
        fetchBuildings() {
        axios
            .get(`${store.BASE_URL}/buildings`, {
            // params: {
            //     page: store.page,
            // },
            })
            .then((res) => {
            console.log(
                res
                // res.data.results.last_page
            );

            store.buildings = res.data.buildings;
            // this.currentPage = res.data.results.current_page;
            // this.lastPage = res.data.results.last_page;
            });
        },
    },
    created() {
        // this.fetchBuildings();
        this.getApiBuildings();
    },
};
</script>

<template>
    <div class="">
        <div class="searchbar row">

            <div class="address-container col-12">
                <label for="address">Inserisci l'indirizzo</label>
                <input type="text" id="address" v-model="store.address" />
            </div>

            <div class="ray-container col">
                <label for="radius">Raggio</label>

                <!-- <button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                    R
                </button> -->
                <span class="src-icon" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                    
                </span>

                <div class="collapse" id="collapseExample">
                    <select v-model="store.radius">
                        <option value="50000">50 km</option>
                        <option value="100000">100 km</option>
                        <option value="150000">150 km</option>
                    </select>
                </div>

            </div>

            <div class="rooms-container col">
                <label for="roomsFilter">Stanze</label>
                <select id="roomsFilter" v-model="store.roomsFilter">
                    <option
                    v-for="option in this.roomsOptions"
                    :value="option.value"
                    :key="option.value"
                    >
                    {{ option.label }}
                    </option>
                </select>
            </div>

            <div class="beds-container col">
                <label for="bedsFilter">Letti</label>
                <select id="bedsFilter" v-model="store.bedsFilter">
                    <option
                    v-for="option in this.bedsOptions"
                    :value="option.value"
                    :key="option.value"
                    >
                    {{ option.label }}
                    </option>
                </select>
            </div>

            <div class="baths-container col">
                <label for="bathsFilter">Bagni</label>
                <!-- <input type="number" id="bathrooms" v-model="store.bathrooms" /> -->
                <select id="bathsFilter" v-model="store.bathsFilter">
                    <option
                    v-for="option in this.bathsOptions"
                    :value="option.value"
                    :key="option.value"
                    >
                    {{ option.label }}
                    </option>
                </select>
            </div>

            <div class="services-container col">
                <label for="servicesFilter">Servizi</label>
                <!-- <input type="number" id="bathrooms" v-model="store.bathrooms" /> -->
                <select id="servicesFilter" v-model="store.servicesFilter">
                    <option
                    v-for="service in store.services"
                    :value="service.id"
                    :key="service.id"
                    >
                    {{ service.name }}
                    </option>
                </select>
            </div>

            <div class="wrap-b">
                <button class="button" @click="getCoordinatesFromAddress">Cerca Edifici</button>
            </div>
            
        </div>
            <div class="section overflow-h">
                <div class="container">
                    <div v-if="store.buildings.length > 0" class="row cards">
                        <BuildingCard
                            class="card_"
                            v-for="building in store.buildings"
                            :building="building"
                            :key="building.id"
                        />
                    </div>
                    <div class="loading" v-else>
                    <p>Non ci sono risultati</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.section {
  padding: 30px;
  margin-top: 50px;
}

.searchbar {
  position: fixed;
  z-index: 3;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 15px;
  row-gap: 5px; 

  .col {
    font-size: 12px; 
  }
}

.active {
  color: #3b7ed6;
  font-weight: bold;
}

.cards {
  padding: 10px 20px;
  row-gap: 15px;
}

.card_:hover {
  transform: scale(1.1);
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

    input {
        flex-grow: 1; 
    }


.wrap-b {
    display: flex; 
    align-items: center;
    justify-content: center;
}
</style>
