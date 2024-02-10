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
                'surname': this.guestName, 
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
                <img class="thumb" :src="'http://127.0.0.1:8000/storage' + building.image">
                <div class="pic">
                    <img  v-for="image in building.images" class="preview" :src="'http://127.0.0.1:8000/storage' + image.url">
                </div>
            </div>
            
            <p>{{ building.description }}</p>
            <div class="tags" v-if="building.services" >
                <p v-for="service in building.services" >{{ service.name }}</p>
            </div>
        </div>
        <div class="alert-custom" v-if="confirm !== null" :class="confirm === null? 'd-none': '' ">
                <p class="mb-0">{{ confirm }}</p>
                <span @click="closeConfirm()" class="src-icon ">
                    Chiudi
                    <i class="fa-solid fa-rectangle-xmark"></i>
                </span>
            </div>
            <div class="form-wrap">
                <div class="form-head">
                    <p class="text-center mb-0">Vuoi saperne di più o prenotare? Contatta l'host!</p>
                    <span @click="toggleForm()" class="src-icon">
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
        justify-content: space-around; 
        align-items: center;
    }
    
    .thumb {
        width: 600px;
        transition: width ease-out 0.2s; 
    }
    .thumb:hover {
        width: 800px; 
    }
    .preview {
        width: 200px; 
    }

    .pic {
        display: flex; 
        flex-direction: column; 
        gap: 20px; 
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

</style>