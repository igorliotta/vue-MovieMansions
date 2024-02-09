<script>
import axios from "axios";
import { store } from "../../store";

export default {
    data() {
        return {
            building: null,
            store: store,
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
        
    </div>
    

</template>

<style lang="scss" scoped>
    .col-12 {
    display: flex; 
    flex-direction: column;
    gap: 12px; 

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


    .row {
        justify-content: center; 
    }

    .section {
    margin-bottom: 20px;
    margin-top: 20px;
    }

</style>