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
                })
                .catch((error) => {
                    console.log("building not found", error.response);

                    if (error.response.status === 404) {
                        this.$router.push({ name: "not-found" });
                    }
                });
        },
        showMap(latitude, longitude, title) {
            console.log("Mostra mappa con coordinate:", latitude, longitude, 'nome:', title);

            let map = null;

            map = tt.map({
                key: store.apiKey,
                container: 'map',
                center: [longitude, latitude],
                zoom: 15,
            });

            const customMarker = document.createElement('div');
            customMarker.className = 'custom-marker';
            customMarker.innerHTML = '<img width="100%" src="/icons8-casa-64.png" alt="">';
            customMarker.style.width = '70px';



            map.on('load', () => {
                const marker = new tt.Marker({ element: customMarker }).setLngLat([longitude, latitude]).addTo(map);
                marker.setPopup(new tt.Popup().setHTML(`<h6>${title}</h6>`));
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
            const { latitude, longitude, title } = this.building;
            this.showMap(latitude, longitude, title);
        }
    },
};
</script>

<template>
    <div v-if="building" class="container-fluid">
        <router-link :to="{ name: 'buildings.index' }">
            <button class="button-back mt-2">
                <div class="button-box">
                    <span class="button-elem">
                        <svg viewBox="0 0 46 40" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z">
                            </path>
                        </svg>
                    </span>
                    <span class="button-elem">
                        <svg viewBox="0 0 46 40">
                            <path
                                d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z">
                            </path>
                        </svg>
                    </span>
                </div>
            </button>
        </router-link>
        <div class="container container-show my-4">
            <h1 class="title fw-bold text-center pt-4">{{ building.title }}</h1>
            <div class="d-flex align-items-center justify-content-center mb-3">
                <img class="map-icon" src="/icons8-segnaposto-64.png" alt="">
                <p class="address fw-medium mb-0">{{ building.address }}
                    <a href="#mappa">(vedi mappa)</a>
                </p>
            </div>
            <div class="d-flex align-items-center justify-content-center">
                <img class="icon-user" src="/icons8-home-100.png" alt="">
                <p class="user fs-5 fw-bold mb-0">Host: {{ building.user.name }} {{ building.user.surname }}</p>
            </div>

            <div class="wrap-images">
                <div class="text-thumb">
                    <p class="mb-0">Passa sull'immagine per ingrandirla</p>
                    <div class="view">
                        <img class="thumb" :src="'http://127.0.0.1:8000/storage/' + building.image"
                            :class="currentPreview === 10 ? 'd-block' : 'd-none'">
                        <img v-for="(image, index) in building.images" class="thumb"
                            :src="'http://127.0.0.1:8000/storage/' + image.url" :key="index"
                            :class="currentPreview === index ? 'd-block' : 'd-none'">
                    </div>
                </div>

                <div class="preview-wrap justify-content-center">
                    <p class="text-center">Clicca sull'immagine</p>
                    <div class="images-preview">
                        <img class="preview" :class="currentPreview === 10 ? 'active-now' : ''"
                            :src="'http://127.0.0.1:8000/storage/' + building.image" @click="activePreview(10)">
                        <img v-for="(image, index) in building.images" class="preview"
                            :class="currentPreview === index ? 'active-now' : ''"
                            :src="'http://127.0.0.1:8000/storage/' + image.url" :key="index" @click="activePreview(index)">
                    </div>
                </div>
            </div>

            <!-- <div class="section d-flex">
                <p class="user fs-4 fw-bold">Host: {{ building.user.name }} {{ building.user.surname }}</p>
            </div> -->

            <div class="section">
                <h4 class="fw-bold mb-4">Descrizione</h4>
                <p class="description">{{ building.description }}</p>
            </div>

            <div class="section">
                <h4 class="fw-bold mb-4">Spazio</h4>
                <p>Questo speciale luogo è composto da <strong>{{ building.rooms }} spazi</strong> distinti, ciascuno
                    progettato con una
                    visione cinematografica unica. Il numero di <strong>bagni</strong> è <strong>{{ building.bathrooms
                    }}</strong>. Troverete <strong>{{ building.beds }} letti</strong>, ognuno pensato per incarnare lo
                    stile e il comfort dei set cinematografici. Con una <strong>superficie</strong>
                    di circa <strong>{{ building.sqm }} metri quadrati</strong>, questo set offre spazio sufficiente per
                    esplorare e
                    sperimentare. Ogni
                    angolo è stato progettato con attenzione per garantir un'esperienza cinematografica che trasformerà il
                    vostro soggiorno in una scena indimenticabile. Siamo entusiasti di offrirvi un'esperienza unica, dove
                    potrete sentirvi parte integrante della vostra storia cinematografica preferita.
                </p>
            </div>

            <div class="section py-3">
                <h4 class="fw-bold mb-4">Servizi</h4>
                <div v-if="building.services" class="services">
                    <div class="d-flex align-items-center gap-2" v-for="service in building.services">
                        <img class="service-icon-show" :src="'http://127.0.0.1:8000/storage' + service.icon">
                        <span>{{ service.name }}</span>
                    </div>
                </div>
            </div>

            <!-- indirizzo -->
            <div class="section py-3" id="mappa">
                <h4 class="fw-bold mb-4">Dove sarai:</h4>
                <div id="map" class="map-container mb-3"></div>
                <div class="d-flex align-items-center gap-2">
                    <img class="map-icon" src="/icons8-modifica-mappa-64.png" alt="">
                    <p class="fw-medium fs-6 mb-0">{{ building.address }}</p>
                </div>
            </div>


        </div>

        <div class="form-wrap" :class="{ 'show-form': showForm }">
            <div class="alert-custom position-absolute" v-if="confirm !== null" :class="confirm === null ? 'd-none' : ''">
                <p class="mb-0">{{ confirm }}</p>
                <span @click="closeConfirm()" class="src-icon ">
                    <i class="fa-solid fa-rectangle-xmark"></i>
                </span>
            </div>
            <div class="form-head">
                <p class=" txt-form text-center mb-0">Vuoi saperne di più o prenotare? <br> <span
                        class="text-green">Contatta
                        l'host!</span></p>
                <span @click="toggleForm()" class="src-icon btn-pen align-self-start">
                    <i class="fa-solid fa-pen"></i>
                </span>
            </div>

            <form class="form-custom">
                <input v-model="guestName" type="text" placeholder="Inserisci il tuo nome" class="form-control" required>
                <input v-model="guestSurname" type="text" placeholder="Inserisci il tuo cognome" class="form-control"
                    required>
                <input v-model="guestEmail" type="email" placeholder="Inserisci una email valida" class="form-control"
                    required>
                <textarea v-model="guestMessage" placeholder="Scrivi il tuo messaggio" class="form-control"
                    required></textarea>
                <div class="btn-wrap">
                    <span class="btn-custom" @click="sendMessage()">Invia messaggio</span>
                </div>

            </form>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.button-back {
    display: block;
    position: relative;
    width: 56px;
    height: 56px;
    margin: 0;
    overflow: hidden;
    outline: none;
    background-color: transparent;
    cursor: pointer;
    border: 0;
}

.button-back:before,
.button-back:after {
    content: "";
    position: absolute;
    border-radius: 50%;
    inset: 7px;
}

.button-back:before {
    border: 4px solid #5A8D81;
    transition: opacity 0.4s cubic-bezier(0.77, 0, 0.175, 1) 80ms,
        transform 0.5s cubic-bezier(0.455, 0.03, 0.515, 0.955) 80ms;
}

.button-back:after {
    border: 4px solid #D4C06B;
    transform: scale(1.3);
    transition: opacity 0.4s cubic-bezier(0.165, 0.84, 0.44, 1),
        transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    opacity: 0;
}

.button-back:hover:before,
.button-back:focus:before {
    opacity: 0;
    transform: scale(0.7);
    transition: opacity 0.4s cubic-bezier(0.165, 0.84, 0.44, 1),
        transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.button-back:hover:after,
.button-back:focus:after {
    opacity: 1;
    transform: scale(1);
    transition: opacity 0.4s cubic-bezier(0.77, 0, 0.175, 1) 80ms,
        transform 0.5s cubic-bezier(0.455, 0.03, 0.515, 0.955) 80ms;
}

.button-box {
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
}

.button-elem {
    display: block;
    width: 20px;
    height: 20px;
    margin: 21px 18px 0 18px;
    transform: rotate(180deg);
    fill: #5A8D81;
}

.button-back:hover .button-box,
.button-back:focus .button-box {
    transition: 0.4s;
    transform: translateX(-56px);
}

// .title {
//     text-shadow: 2px 2px 4px #D4C06B;
//     color: #5A8D81;
//     text-transform: uppercase;
//     animation: beat 1s 2;
// }

// @keyframes beat {

//     0%,
//     100% {
//         transform: scale(1);
//     }

//     50% {
//         transform: scale(1.1);
//     }
// }

.title {
    color: transparent;
    background: linear-gradient(90deg, #5A8D81 30%, #D4C06B 100%);
    text-transform: uppercase;
    background-clip: text;
    -webkit-background-clip: text;
}

.container-show {
    background-color: whitesmoke;
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
    // box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
}

.wrap-images {
    display: flex;
    margin: 0 auto;
    margin-bottom: 40px;
    gap: 10px;
    max-width: 1000px;
}

// 
.view .thumb {
    width: 100%;
    display: block;
    object-fit: cover;
    object-position: center;
    transform: scale(1);
    transition: all .2s linear;
}

.view .thumb:hover {
    transform: scale(1.1);
}

.service-icon-show,
.map-icon {
    width: 30px;
}

.icon-user {
    width: 50px;
}

.view {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    border: 5px solid #D4C06B;
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.18) 0px 2px 4px;
}

.text-thumb {
    // width: 40%;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-grow: 1;
}

.preview {
    max-width: 241px;
    cursor: pointer;
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.18) 0px 2px 4px;

}

.images-preview {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
}

.preview-wrap {
    display: flex;
    flex-direction: column;

    p {
        text-align: center;
        margin-bottom: 0px;
    }
}

.address a {
    color: #5A8D81;
}

.section {
    width: 75%;
    margin-left: 15px;
}

.user {
    color: #5A8D81;
}

.services {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-row-gap: 5px;
}

.active-now {
    border: 5px solid #D4C06B;
}

.form-wrap {
    max-width: 800px;
    position: fixed;
    bottom: -8px;
    left: 74%;
    right: 2%;
    background-color: rgba(255, 255, 255, 0.95);
    z-index: 3;
    padding: 15px;
    border: 1px solid #5b8d813b;
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 8px;
    transform-origin: top;
    transform: translateY(75%);
    transition: transform 0.8s ease-in-out, box-shadow 0.5s ease-in-out;

    &.show-form {
        transform: translateY(0);
        box-shadow: rgba(0, 0, 0, 0.3) 0px 10px 20px;
    }

    .form-head {
        display: flex;
        align-items: center;
        padding: 5px;

        p {
            font-weight: 500;
            flex-grow: 1;
        }
    }
}

.form-custom {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-bottom: 10px;

    .btn-wrap {
        margin-top: 10px;
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
    top: -85px;
    left: 0px;
    gap: 10px;

    .src-icon {
        font-size: 15px;
    }

}

.map-container {
    width: 100%;
    height: 600px;
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 8px;
}

@media (max-width: 575.98px) {
    .text-thumb {
        width: 100%;
    }

    .images-preview {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
    }

    .wrap-images {
        flex-direction: column;
    }

    .preview {
        max-width: 120px;
    }

    .section {
        margin-left: 0;
        width: 100%;
        text-align: center;
    }

    .services {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        justify-content: center;
    }

    .map-container {
        height: 340px;
    }

    .form-wrap {
        left: 10%;
        right: 10%;
    }
}
</style>