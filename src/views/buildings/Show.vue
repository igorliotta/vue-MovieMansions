<script>
import axios from "axios";
import { store } from "../../store";

export default {
    data() {
        return {
            building: null,
            store: store,
            guestName: "",
            guestSurname: "",
            guestEmail: "",
            guestMessage: "",
            confirm: null,
            showForm: false,
            currentPreview: 10,
            currentTime: null,
        };
    },
    methods: {
        fetchBuilding() {
            axios.get(`${store.BASE_URL}/buildings/${this.$route.params.slug}`)
                .then((res) => {
                    //console.log(res.data)
                    this.building = res.data.building;
                    console.log(this.building);
                    // Chiamare la funzione per visualizzare la mappa passando le coordinate
                    // this.showMap(this.building.latitude, this.building.longitude, this.building.address);
                })
                .catch((error) => {
                    console.log("building not found", error.response);

                    if (error.response.status === 404) {
                        this.$router.push({ name: "not-found" });
                    }
                });
        },
        showMap(latitude, longitude, address) {
            console.log("Mostra mappa con coordinate:", latitude, longitude, 'indirizzo:', address);

            let map = null;

            map = tt.map({
                key: store.apiKey,
                container: 'map',
                center: [longitude, latitude],
                zoom: 14,
            });

            map.on('load', () => {
                const marker = new tt.Marker().setLngLat([longitude, latitude]).addTo(map);
                marker.setPopup(new tt.Popup().setHTML(`<h6>${address}</h6>`));
                map.addControl(new tt.FullscreenControl());
                map.addControl(new tt.NavigationControl());
            });
        },
        sendMessage() {

            //la chiamata axios viene fatta non in get, ma in post

            axios.post(`${store.BASE_URL}/messages`, {
                //come secondo parametro passiamo un oggetto composto riempiendo i campi dei messaggi nel backend
                'building_id': this.building.id,
                'name': this.guestName,
                'surname': this.guestSurname,
                'guest_email': this.guestEmail,
                'text': this.guestMessage
            })
                .then(response => {
                    // gestiamo la response che arriva dall'Api/MessageController
                    console.log(response.data);
                    this.confirm = response.data.response;
                })
                .catch(error => {
                    // Gestire gli errori se necessario
                    console.error(error);
                });

            this.showform = false
            this.toggleForm()
        },
        closeConfirm() {
            this.confirm = null;
        },
        toggleForm() {
            if (this.showForm === false) {
                this.showForm = true
            } else {
                this.showForm = false
            }

        },
        activePreview(ind) {
            this.currentPreview = ind
            console.log(this.currentPreview)
        },
        getIpAddress() {
            try {
                //PROVA A recuperare l'indirizzo ip da ipify
                axios.get("https://api.ipify.org?format=json")
                    .then(response => {
                        const ipAddress = response.data.ip;
                        console.log(response.data)
                        this.sendIpAddressToLaravel(ipAddress);
                    })
            } catch (error) {
                console.error("Errore nel recupero dell'indirizzo IP:", error);
            }
        },
        sendIpAddressToLaravel(ipAddress) {
            // Invia l'indirizzo IP a Laravel. LA CHIAMIAMO NELL'HOOK UPDATE(vedi giù)
            if (this.building) {
                axios.post(`${store.BASE_URL}/visits`, {
                    //passiamo un oggetto contenente tutte le info
                    'ip_address': ipAddress,
                    'building_id': this.building.id,
                    'time': this.currentTime,
                })
                    .then(response => {
                        console.log("Indirizzo IP inviato con successo a Laravel:", response.data);
                    })
                    .catch(error => {
                        console.error("Errore nell'invio dell'indirizzo IP a Laravel:", error);
                    });
            }

        },
        getCurrentTime() {
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth() + 1;
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const day = now.getDate();
            const seconds = now.getSeconds();

            // Formatta l'orario come lo vuole salvato il server: YYYY/MM/DD hh:mm:ss
            this.currentTime = `${this.formatTime(year)}/${this.formatTime(month)}/${this.formatTime(day)} ${this.formatTime(hours)}:${this.formatTime(minutes)}:${this.formatTime(seconds)}`;
        },
        formatTime(value) {
            //aggiunge uno 0 ai numeri minori di 10 per rispettare il salvataggio
            return value < 10 ? `0${value}` : value;
        },
    },
    created() {
        this.fetchBuilding();
        this.getCurrentTime();
    },
    updated() {
        this.getIpAddress();
        //al montaggio della pagina NON abbiamo il building.id perchè ci arriva dal server
        //bisogna aspettare che arrivi con Axios. per questo lo metto in updated!
        if (this.building) {
            const { latitude, longitude, address } = this.building;
            this.showMap(latitude, longitude, address);
        }
    },
};
</script>

<template>
    <div v-if="building" class="container-fluid">
        <div class="col-12">
            <h1 class="title">{{ building.title }}</h1>
            <div class="wrap-images">
                <div class="text-thumb">
                    <p>Passa sull'immagine per ingrandirla</p>
                    <img class="thumb" :src="'http://127.0.0.1:8000/storage/' + building.image"
                        :class="currentPreview === 10 ? 'active-now' : 'd-none'">
                    <img v-for="(image, index) in building.images" class="thumb"
                        :src="'http://127.0.0.1:8000/storage/' + image.url" :key="index"
                        :class="currentPreview === index ? 'active-now' : 'd-none'">
                </div>

                <div class="preview-wrap">
                    <p>Clicca sull'immagine per visualizzarla</p>
                    <div class="images-preview ">
                        <img class="preview" :class="currentPreview === 10 ? 'active-now' : ''"
                            :src="'http://127.0.0.1:8000/storage/' + building.image" @click="activePreview(10)">
                        <img v-for="(image, index) in building.images" class="preview"
                            :class="currentPreview === index ? 'active-now' : ''"
                            :src="'http://127.0.0.1:8000/storage/' + image.url" :key="index" @click="activePreview(index)">
                    </div>
                </div>

            </div>

            <div class="container w-75 my-4 shadow py-4 rounded">
                <div class="d-flex justify-content-center gap-3 align-items-center mb-3"> 
                    <i class="fa-solid fa-comment-dots text-secondary"></i> 
                    <h5 class="mb-0 fw-bolder">Descrizione</h5>
                </div>
                <p class="description">{{ building.description }}</p>
            </div>

            <div class="container w-75 my-4 shadow py-4 rounded">
                <div class="d-flex justify-content-center gap-3 align-items-center mb-3"> 
                    <i class="fa-solid fa-clipboard text-secondary"></i> 
                    <h5 class="mb-0 fw-bolder">Lo spazio</h5>
                </div>
                <div class="d-flex justify-content-center">
                    <p class="description mx-4">Numero Stanze: {{ building.rooms }}</p>
                    <p class="description mx-4">Numero Bagni: {{ building.bathrooms }}</p>
                    <p class="description mx-4">Numeri Letti: {{ building.beds }}</p>
                    <p class="description mz-4">Metri Quadrati: {{ building.sqm }}</p>
                </div>
              
            </div>

            <div class="container w-75 my-4 shadow py-4 rounded">
                <div class="d-flex justify-content-center gap-3 align-items-center mb-3"> 
                    <i class="fa-solid fa-bell-concierge text-secondary"></i>
                    <h5 class="text-center fw-bolder">Servizi</h5>
                </div>
                <div class="justify-content-center gap-3 align-items-center mb-3"> 
               
                
                <div class="tags" v-if="building.services">
                    <div class="d-flex justify-content-center align-items-center gap-2" v-for="service in building.services">{{ service.name }}
                        <img class="service-icon-show" :src="'http://127.0.0.1:8000/storage' + service.icon ">
                    </div>
                </div>    
                </div>
            </div>

            <!-- indirizzo -->

                <div class="container w-75 d-flex align-items-center my-4 shadow py-4 rounded">
                    <div id="map" class="map-container"></div>

                    <div class="container w-75 my-4">
                    <div class="d-flex justify-content-center gap-3 align-items-center mb-3"> 
                        <i class="fa-solid fa-map-pin text-secondary"></i>
                        <h5 class="mb-0 fw-bolder">Indirizzo</h5>
                    </div>
                    <p class="description">{{ building.address }}</p>
                </div>

            </div>
          

        </div>

        <div class="form-wrap">
            <div class="alert-custom" v-if="confirm !== null" :class="confirm === null ? 'd-none' : ''">
                <p class="mb-0">{{ confirm }}</p>
                <span @click="closeConfirm()" class="src-icon ">
                    Chiudi
                    <i class="fa-solid fa-rectangle-xmark"></i>
                </span>
            </div>
            <div class="form-head">
                <p class=" txt-form text-center mb-0">Vuoi saperne di più o prenotare? <span class="text-green">Contatta
                        l'host!</span></p>
                <span @click="toggleForm()" class="src-icon btn-pen">
                    <i class="fa-solid fa-pen"></i>
                </span>
            </div>

            <form class="form-custom" :class="showForm === false ? 'd-none' : ''">
                <input v-model="guestName" type="text" placeholder="Inserisci il tuo nome" required>
                <input v-model="guestSurname" type="text" placeholder="Inserisci il tuo cognome" required>
                <input v-model="guestEmail" type="email" placeholder="Inserisci una email valida" required>
                <textarea v-model="guestMessage" placeholder="Scrivi il tuo messaggio" required></textarea>
                <div class="btn-wrap">
                    <span class="btn-custom" @click="sendMessage()">Invia messaggio</span>
                </div>

            </form>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.col-12 {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 70px;

    .title {
        text-align: center;
    }
}

.wrap-images {
    display: flex;
    justify-content: center;
    margin-bottom: 40px;
    gap: 30px;
    margin-right: -20px;
}

// 
.thumb {
    width: 600px;
    display: none;
    height: 300px;
    object-fit: cover;
    // animation: zoom-in-zoom-out 1s ease infinite;
    // transition: width ease-out 0.6s;  
}


.thumb:hover {
    animation: zoom-in-zoom-out 1s ease ;
    margin-top: -25px;
}

@keyframes zoom-in-zoom-out {
  0% {
    transform: scale(1, 1);
  }
  50% {
    transform: scale(1.5, 1.5);
  }
  100% {
    transform: scale(1, 1);
  }
}

.service-icon-show {
    width: 28px;
}

.text-thumb {
    display: flex;
    flex-direction: column;
    align-items: center;

    p {
        margin: 0;
        font-size: 12px;
    }
}

.text-thumb:hover {

    p {
        display: none;
    }
}

.preview {
    max-width: 140px;
    cursor: pointer;
}

.images-preview {
    display: flex;
    flex-direction: column;
    max-height: 400px;
    gap: 10px;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: center;
}

.preview-wrap {
    width: 25%;
    display: flex;
    flex-direction: column;
    align-items: center;

    p {
        text-align: center;
        font-size: 12px;
        margin-bottom: 2px;
    }
}

.description {
    text-align: center;
}

.tags {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;

    // p {
    //     border-radius: 10px;
    //     padding: 2px 8px;
    //     border: 2px solid;
    // }

    // p:hover {
    //     border: 2px solid #5B8D81;
    // }
}

.active-now {
    display: inline-block;
    border: 5px solid #5B8D81;
}

.form-wrap {
    max-width: 800px;
    margin: 0 auto;
    position: fixed;
    bottom: 0;
    left: 65%;
    right: 2%;
    background-color: rgba(255, 255, 255, 0.95);
    z-index: 3;
    padding: 15px;
    border: 3px solid #5b8d813b;

    .form-head {
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 5px;

        p {
            font-weight: 500;
        }
    }
}

.form-custom {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-bottom: 20px;

    input,
    textarea {
        padding-left: 8px;
    }

    .btn-wrap {
        display: flex;
        justify-content: center;
        align-items: center;
    }
}

.alert-custom {
    display: flex;
    background-color: #5b8d813b;
    justify-content: space-between;
    align-items: center;
    padding: 10px;

    .src-icon {
        font-size: 10px;
    }

}

.map-container {
    width: 600px;
    height: 400px;
}

/* Stili per desktop (e dispositivi più grandi) */
@media (min-width: 1200px) {}

@media (max-width: 992px) {
    /* Stili per desktop large */

    .wrap-images {
        flex-direction: column;
    }

    .thumb {
        width: 500px;
        height: 250px;
    }

    .thumb:hover {
        width: 600px;
        height: 300px;
    }

    .images-preview {
        flex-direction: row;
    }

    .preview-wrap {
        width: 100%;
    }
}

@media (max-width: 768px) {

    /* Stili per tablet orizzontale e desktop medium */
    .thumb {
        width: 400px;
        height: 250px;
    }

    .thumb:hover {
        width: 500px;
        height: 280px;
    }

    .form-wrap {
        left: 20%;
        right: 20%;
    }
}

/* Stili per tablet verticale */
@media (max-width: 576px) {

    .txt-form {
        display: none;
    }

    .form-wrap {
        left: 10%;
        right: 10%;
        padding: 0;
        // height: 20px; 

    }

    .description {
        font-size: 12px;
    }

    .tags {
        font-size: 10px;
    }
}

/* Stili per smartphone e dispositivi più piccoli */
@media (max-width: 575px) {

    .thumb {
        width: 300px;
        height: 250px;
    }

    .thumb:hover {
        width: 360px;
        height: 290px;
    }

    .map-container {
    width: 200px;
    height: 200px;
}
}
</style>