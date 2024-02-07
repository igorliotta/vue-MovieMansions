<script>
import BuildingCard from "../../components/BuildingCard.vue";
import axios from "axios";

export default {
components: {
    BuildingCard,
},
data() {
    return {
    buildings: [],
    currentPage: 1,
    lastPage: 0,
    page: 0,
    BASE_URL: "http://127.0.0.1:8000/api",
    };
},
methods: {
    fetchBuildings() {
    axios
        .get(`${this.BASE_URL}/buildings`, {
        params: {
            page: this.page,
        },
        })
        .then((res) => {
        console.log(
            res,
            res.data.results.current_page,
            res.data.results.last_page
        );
        this.buildings = res.data.results.data;
        this.currentPage = res.data.results.current_page;
        this.lastPage = res.data.results.last_page;
        });
    },
    getPage(n) {
    this.page = n;

    this.fetchBuildings();
    } ,
},
beforeMount() {
    this.fetchBuildings();
},
};
</script>

<template>
    <div class="section">
    <div class="container">
        <div v-if="buildings.length > 0" class="row cards">
        <BuildingCard
            class="card_"
            v-for="building in buildings"
            :building="building"
            :key="building.id"
        />
        </div>
        <div class="loading" v-else>
            <p>Caricamento...</p>
            <!-- <img src="/img/loading.webp"> -->
        </div>
    </div>

        <div class="container">
        <ul class="paginate">
            <li v-for="n in lastPage"  @click="getPage(n)">
            <p :class="n === currentPage ? 'active' : ''">
                {{ n }}
            </p>
            </li>
        </ul>
        </div>
    </div>

</template>

<style lang="scss">
.section {
  padding: 30px;
  margin-top: 10px; 
}

.paginate {
    padding: 10px; 
  display: flex;
  justify-content: center;
  gap: 10px;

  li {
    border: 2px solid #3b7ed6;
    border-radius: 10px;
    padding: 2px 8px; 
    background-color: rgb(173, 209, 232);
  }

  p {
    text-align: center;
    cursor: pointer;
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
</style>