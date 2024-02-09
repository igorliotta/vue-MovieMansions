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
            axios.get(`https://api.tomtom.com/search/2/search/${store.address}.json`, {
                params: {
                    'key': 'pqHD68XXAijUehCtM4HFFAVamZjQMA1W',
                }
            })
                .then(response => {
                    console.log(response);
                    const firstResult = response.data.results[0];
                    if (firstResult) {

                        store.lat = firstResult.position.lat;
                        store.lon = firstResult.position.lon;
                        this.getApiBuildings();
                    } else {
                        console.error('Nessun risultato valido ottenuto dalla ricerca di coordinate');
                    }
                })
                .catch(error => {
                    console.error('Errore nella richiesta di coordinate:', error);
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
                        // 'services_filter': store.servicesFilter,
                        'bathrooms': store.bathrooms,
                        'services': this.selectedServices.map(service => service.value),
                    },
                })
                .then((res) => {
                    console.log('Risposta API:', res.data.buildings);
                    store.buildings = res.data.buildings;
                    // store.services = res.data.allServices;
                    // console.log(store.services);
                })
                .catch((error) => {
                    console.error('Errore nella richiesta edifici:', error);
                });
        // },
        // getServiceId() {
        //     for (let i = 0; i < this.store.services.length; i++) {
        //         currentService = store.services[i];
        //         console.log(currentService);
        //     }
        },
        // fetchBuildings() {
        //     axios
        //         .get(`${ store.BASE_URL }/buildings`, {
        //             // params: {
        //             //     page: store.page,
        //             // },
        //         })
        //         .then((res) => {
        //             console.log(
        //                 res,
        //                 // res.data.results.last_page
        //             );
                    
        //             store.buildings = res.data.buildings;
        //             // this.currentPage = res.data.results.current_page;
        //             // this.lastPage = res.data.results.last_page;
        //         });
        // },
    },
    created() {
        // this.fetchBuildings();
        this.getApiBuildings();
        
    }
};
</script>

<template>
    <div class="section">
        <div class="container">
            <div>
                <label for="address">Inserisci l'indirizzo:</label>
                <input type="text" id="address" v-model="store.address" />
                <label for="radius">Seleziona il raggio:</label>
                <select v-model="store.radius">
                    <option value="50000">50 km</option>
                    <option value="100000">100 km</option>
                    <option value="150000">150 km</option>
                </select>

                <label for="roomsFilter">Numero stanze:</label>
                <select id="roomsFilter" v-model="store.roomsFilter">
                    <option v-for="option in this.roomsOptions" :value="option.value" :key="option.value">{{ option.label }}
                    </option>
                </select>

                <label for="bedsFilter">Seleziona il numero di letti:</label>
                <select id="bedsFilter" v-model="store.bedsFilter">
                    <option v-for="option in this.bedsOptions" :value="option.value" :key="option.value">{{ option.label }}
                    </option>
                </select>

                <label for="bathsFilter">Numero bagni:</label>
                <!-- <input type="number" id="bathrooms" v-model="store.bathrooms" /> -->
                <select id="bathsFilter" v-model="store.bathsFilter">
                    <option v-for="option in this.bathsOptions" :value="option.value" :key="option.value">{{ option.label }}
                    </option>
                </select>

                <!-- <label for="servicesFilter">Servizi:</label>
                <input type="number" id="bathrooms" v-model="store.bathrooms" />
                <select id="servicesFilter" v-model="store.servicesFilter">
                    <option v-for="service in this.store.services" :value="service.id" :key="service.id">{{ service.name }}
                    </option>
                </select> -->

                <div>
                    <label>Servizi:</label>
                    <div class="services">
                        <div class="services" v-for="service in servicesOptions" :key="service.value">
                            <input type="checkbox" :id="service.value" v-model="selectedServices" :value="service" />
                            <label :for="service.value">{{ service.label }}</label>
                        </div>
                    </div>
                </div>


                <button @click="getCoordinatesFromAddress">Cerca Edifici</button>
            </div>
            <div v-if="store.buildings.length > 0" class="row cards">
                <BuildingCard class="card_" v-for="building in store.buildings" :building="building" :key="building.id" />
            </div>
            <div class="loading" v-else>
                <p>Non ci sono risultati</p>
            </div>
        </div>
    </div>
</template>
<style lang="scss">
.section {
    padding: 30px;
    margin-top: 50px;
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

.services {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
}
</style>
