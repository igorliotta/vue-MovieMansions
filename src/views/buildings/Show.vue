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
        <h1>{{ building.title }}</h1>
    </div>
    

</template>

<style>

</style>