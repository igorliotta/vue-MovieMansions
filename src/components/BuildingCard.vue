<script>

export default {
    components: {
    },
    data() {
        return {

        }
    },
    methods: {

    },
    props: {
        building: {
            type: Object,
            required: true
        }
    },
    created() {
    }
}
</script>


<template>
    <div class="col-lg-3 col-md-3 col-sm-2">
        <div class="card">
            <img v-if="building.image" class="card-img-top" :src="'http://127.0.0.1:8000/storage/' + building.image">
            <div class="card-body">
                <h5>
                    <router-link :to="{ name: 'buildings.show', params: { slug: building.slug } }">{{ building.title
                    }}</router-link>
                </h5>
                <p class="address mb-0 text-center flex-grow-1">{{ building.address }}</p>
                <div class="row flex-column gap-3">
                    <div class="col p-0 d-flex justify-content-center gap-3">
                        <p class="details mb-0"><strong>m<sup>2</sup></strong> {{ building.sqm }}</p>
                        <p class="details mb-0"><i class="fa-solid fa-door-closed"></i> {{ building.rooms }}</p>
                        <p class="details mb-0"><i class="fa-solid fa-bed"></i> {{ building.beds }}</p>
                    </div>
                    <div class="col p-0 d-flex gap-2 flex-wrap justify-content-center">
                        <!-- Gestiamo i servizi con le icone -->
                        <span class="services" v-for="service in building.services" :key="service.name">
                            <i v-if="service.name === 'Wi-Fi'" class="fa-solid fa-wifi"></i>
                            <i v-else-if="service.name === 'Piscina'" class="fa-solid fa-person-swimming"></i>
                            <i v-else-if="service.name === 'Ristorante'" class="fa-solid fa-utensils"></i>
                            <i v-else-if="service.name === 'Palestra'" class="fa-solid fa-dumbbell"></i>
                            <i v-else-if="service.name === 'Servizio in camera'" class="fa-solid fa-door-open"></i>
                            <i v-else-if="service.name === 'Colazione inclusa'" class="fa-solid fa-mug-saucer"></i>
                            <i v-else-if="service.name === 'Parcheggio'" class="fa-solid fa-square-parking"></i>
                            <i v-else-if="service.name === 'Centro benessere'" class="fa-solid fa-spa"></i>
                            <i v-else-if="service.name === 'Navetta aeroportuale'" class="fa-solid fa-van-shuttle"></i>
                            <i v-else-if="service.name === 'Animali ammessi'" class="fa-solid fa-paw"></i>
                            <i v-else-if="service.name === 'Reception 24 ore'" class="fa-solid fa-bell-concierge"></i>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.col-3 {
    padding: 10px;
}

.card {
    height: 100%;
    border: none;
    box-shadow: rgba(0, 0, 0, 0.15) 0px 15px 25px, rgba(0, 0, 0, 0.05) 0px 5px 10px;

    &:hover {
        transform: translateY(-5px);
        transition: 300ms ease-in-out;
        cursor: pointer;
    }

    .card-body {
        display: flex;
        flex-direction: column;
        gap: 10px;

        h5 {
            color: #5B8E81;
            text-align: center;
        }

        .row {
            font-size: 14px;
        }
    }

    .row-pic {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 5px;
    }

    .preview {
        width: 50px;
    }

    .link {
        text-align: center;
        margin-top: auto;
        font-size: 18px;
        font-weight: 700;
        color: whitesmoke;
        background-color: #5B8E81;
        border-radius: 10px;
        padding: 2px 8px;
        width: 60%;
    }
}

.services,
.details {

    i,
    strong {
        color: #5B8E81;
    }

}
</style>