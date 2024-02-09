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
    <div class="">
        <div class="searchbar">

            <div class="address-container col-12">
                <label class="address" for="address">Inserisci un paese, una regione o una città</label>
                <input class="search" type="text" id="address" v-model="store.address" />
            </div>

            <span class="filter">
                Filtra per: 
            </span >

            <div class="col-10 filters">

                <div class="ray-container">
                <label class="label" for="radius">Raggio</label>

                <span class="src-icon" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                    <i class="fa-solid fa-compass"></i>
                </span>

                <div class="collapse" id="collapseExample">
                    <select class="form-select form-select-sm" v-model="store.radius">
                        <option value="50000">50 km</option>
                        <option value="100000">100 km</option>
                        <option value="150000">150 km</option>
                    </select>
                </div>

                </div>

                <div class="rooms-container">
                    <label class="label" for="roomsFilter">Stanze</label>

                    <span class="src-icon" data-bs-toggle="collapse" data-bs-target="#collapseExample1" aria-expanded="false" aria-controls="collapseExample1">
                        <i class="fa-solid fa-person-shelter"></i>
                    </span>

                    <div class="collapse" id="collapseExample1">
                        <select class="form-select form-select-sm" id="roomsFilter" v-model="store.roomsFilter">
                            <option 
                            v-for="option in this.roomsOptions"
                            :value="option.value"
                            :key="option.value"
                            >
                            {{ option.label }}
                            
                            </option>
                        </select>
                    </div>
                </div>

                <div class="beds-container">
                    <label class="label" for="bedsFilter">Letti</label>

                    <span class="src-icon" data-bs-toggle="collapse" data-bs-target="#collapseExample2" aria-expanded="false" aria-controls="collapseExample2">
                        <i class="fa-solid fa-bed"></i>
                    </span> 

                    <div class="collapse" id="collapseExample2">
                        <select class="form-select form-select-sm" id="bedsFilter" v-model="store.bedsFilter">
                            <option
                            v-for="option in this.bedsOptions"
                            :value="option.value"
                            :key="option.value"
                            >
                            {{ option.label }}
                            </option>
                        </select>
                    </div>
                </div>

                <div class="baths-container">
                    <label class="label" for="bathsFilter">Bagni</label>
                    
                    <span class="src-icon" data-bs-toggle="collapse" data-bs-target="#collapseExample3" aria-expanded="false" aria-controls="collapseExample3">
                        <i class="fa-solid fa-shower"></i>
                    </span>

                    <div class="collapse" id="collapseExample3"> 
                        <select class="form-select form-select-sm" id="bathsFilter" v-model="store.bathsFilter">
                            <option
                            v-for="option in this.bathsOptions"
                            :value="option.value"
                            :key="option.value"
                            >
                            {{ option.label }}
                            </option>
                    </select>
                    </div>

                </div>
            </div>
            <div class="wrap-b">
                <button class="button" @click="getCoordinatesFromAddress">Cerca Edifici</button>
            </div> 
            <div class="col-12 serv">
                <div class="services container">
                    <div class="services form-check" v-for="service in servicesOptions" :key="service.value">
                        <input type="checkbox" class="btn-check" name="options-outlined" :id="service.value" v-model="selectedServices" :value="service" />
                        <label class="btn btn-outline-success label-c"  :for="service.value">{{ service.label }}</label>
                    </div>
                </div>
            </div>          
        </div>
            <div class="section">
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
  margin-top: 100px;
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

  .search {
    padding: 0 4px; 
  }

  .label {
    font-size: 12px; 
    margin-right: 10px; 

  }

  .btn {
    --bs-btn-font-size: 11px;
    --bs-btn-padding-x: 3px;
    --bs-btn-padding-y: 2px;
  }

  .address {
    margin-right: 20px; 
  }

  .src-icon {
    color:  #5B8E81;
    cursor: pointer; 
  }

  .src-icon:hover {
    color:#D1BE68;
  }
}
.filters{
    display: flex;
    justify-content: space-around;

  }
.active {
  color: #3b7ed6;
  font-weight: bold;
}
.serv {
    margin-top: 5px; 
   
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

.address-container {
    display: flex; 
    input {
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
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-wrap: nowrap;
    font-size: 10px; 
    gap: 5px;
}
</style>
