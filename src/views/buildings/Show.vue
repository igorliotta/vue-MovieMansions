<script>
import axios from "axios";
import { store } from "../../store";

export default {
    data() {
        return {
            building: null,
            store: store,
            guestName : "", 
            guestSurname : "", 
            guestEmail: "",
            guestMessage: "",
            confirm : null,
            showForm : false,
            currentPreview: 10,


        };
    },
    methods: {
        fetchProject() {
            axios.get(`${store.BASE_URL}/buildings/${this.$route.params.slug}`)
                .then((res) => {
            //console.log(res.data)
                    this.building = res.data.building;
                    console.log(this.building)
            })
                .catch((error) => {
                    console.log("building not found", error.response);

                    if (error.response.status === 404) {
                        this.$router.push({ name: "not-found" });
                    }
            });
        },
        sendMessage(){

            //la chiamata axios viene fatta non in get, ma in post

            axios.post(`${store.BASE_URL}/messages`, {
                //come secondo parametro passiamo un oggetto composto riempiendo i campi dei messaggi nel backend
                'building_id' : this.building.id,
                'name': this.guestName, 
                'surname': this.guestSurname, 
                'guest_email' : this.guestEmail,
                'text' : this.guestMessage
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
        closeConfirm(){
            this.confirm = null; 
        },
        toggleForm(){
            if(this.showForm === false){
                this.showForm = true
            } else {
                this.showForm = false
            }
            
        },
        activePreview(ind){
            this.currentPreview = ind
            console.log(this.currentPreview)
        }
    },
  created() {
    this.fetchProject()
  }
};
</script>

<template>
    <div v-if="building" class="container-fluid">
        <div class="col-12">
            <h1 class="title">{{ building.title }}</h1>
            <div class="wrap-images">
                <div class="text-thumb">
                    <p>Passa sull'immagine per ingrandirla</p>
                    <img class="thumb" 
                    :src="'http://127.0.0.1:8000/storage/' + building.image"
                    :class=" currentPreview === 10 ? 'active-now' : 'd-none'"
                >
                    <img  v-for="(image,index) in building.images" class="thumb" 
                        :src="'http://127.0.0.1:8000/storage/' + image.url" 
                        :key="index"
                        :class=" currentPreview === index ? 'active-now' : 'd-none'"
                    >
                </div>
                
                <div class="preview-wrap">
                    <p>Clicca sull'immagine per visualizzarla a sinistra</p>
                    <div class="images-preview ">
                    <img class="preview"  
                        :class=" currentPreview === 10 ? 'active-now' : '' " 
                        :src="'http://127.0.0.1:8000/storage/' + building.image" 
                        @click="activePreview(10)"
                    >
                    <img v-for="(image,index) in building.images" 
                        class="preview"  
                        :class=" currentPreview ===  index? 'active-now' : ''" 
                        :src="'http://127.0.0.1:8000/storage/' + image.url" 
                        :key="index" 
                        @click="activePreview(index)"
                    >
                </div>
                </div>
                
            </div>
            
            <div class="container">
                <p class="description">{{ building.description }}</p>
                <div class="tags" v-if="building.services" >
                    <p v-for="service in building.services" >{{ service.name }}</p>
                </div>
            </div>
            
        </div>
        
            <div class="form-wrap">
                <div class="alert-custom" v-if="confirm !== null" :class="confirm === null? 'd-none': '' ">
                    <p class="mb-0">{{ confirm }}</p>
                    <span @click="closeConfirm()" class="src-icon ">
                        Chiudi
                        <i class="fa-solid fa-rectangle-xmark"></i>
                    </span>
                </div>
                <div class="form-head">
                    <p class=" txt-form text-center mb-0">Vuoi saperne di più o prenotare? <span class="text-green">Contatta l'host!</span></p>
                    <span @click="toggleForm()" class="src-icon btn-pen">
                        <i class="fa-solid fa-pen"></i>
                    </span>
                </div>
                
                <form class="form-custom" :class="showForm ===false? 'd-none' : ''">
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
    .wrap-images{
        display: flex; 
        justify-content: center; 
        margin-bottom: 40px; 
        gap: 30px; 
        margin-right: -20px; 
    }
    
    .thumb {
        width: 600px;
        display: none; 
        height: 300px; 
        object-fit: cover;
        transition: width ease-out 0.2s;
    }
    .thumb:hover {
        width: 700px; 
        height: 500px; 
        margin-top: -25px; 
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
    .text-thumb:hover{

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
    gap: 3px; 
        p {
            border-radius : 10px; 
            padding: 2px 8px ; 
            border: 2px solid; 
        }
        p:hover{
        border: 2px solid #5B8D81;
    }
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
        left: 30%; 
        right: 30%;
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

    /* Stili per desktop (e dispositivi più grandi) */
@media (min-width: 1200px) {
}

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
}

/* Stili per tablet verticale */
@media (max-width: 576px) {

    .txt-form {
        display: none; 
    }

    .form-wrap {
        left: 10%; 
        right: 10%;
        // padding: 0; 
        height: 20px; 

        .btn-pen {
            // margin-top: -10px; 
        }
    }
}

/* Stili per smartphone e dispositivi più piccoli */
@media (max-width: 575px) {
}

</style>