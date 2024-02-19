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
            <img v-if="building.image" class="img-fluid" :src="'http://127.0.0.1:8000/storage/' + building.image">
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
                            <i v-if="service.name === 'Wi-Fi'" class="fa-solid fa-wifi" title="Wi-Fi"></i>
                            <i v-else-if="service.name === 'Piscina'" class="fa-solid fa-person-swimming"
                                title="Piscina"></i>
                            <i v-else-if="service.name === 'Ristorante'" class="fa-solid fa-utensils"
                                title="Ristorante"></i>
                            <i v-else-if="service.name === 'Palestra'" class="fa-solid fa-dumbbell" title="Palestra"></i>
                            <i v-else-if="service.name === 'Servizio in camera'" class="fa-solid fa-door-open"
                                title="Servizio in camera"></i>
                            <i v-else-if="service.name === 'Colazione inclusa'" class="fa-solid fa-mug-saucer"
                                title="Colazione inclusa"></i>
                            <i v-else-if="service.name === 'Parcheggio'" class="fa-solid fa-square-parking"
                                title="Parcheggio"></i>
                            <i v-else-if="service.name === 'Centro benessere'" class="fa-solid fa-spa"
                                title="Centro benessere"></i>
                            <i v-else-if="service.name === 'Navetta aeroportuale'" class="fa-solid fa-van-shuttle"
                                title="Navetta aeroportuale"></i>
                            <i v-else-if="service.name === 'Animali ammessi'" class="fa-solid fa-paw"
                                title="Animali ammessi"></i>
                            <i v-else-if="service.name === 'Reception 24 ore'" class="fa-solid fa-bell-concierge"
                                title="Reception 24 ore"></i>
                        </span>
                        <div class="popular-icon" v-if="building.isSponsored">
                            <img src="/depositphotos_183585148-stock-illustration-vector-most-popular-gold-sign-transformed.webp"
                                alt="">
                        </div>
                    </div>
                </div>
                <button class="card-button">
                    <router-link :to="{ name: 'buildings.show', params: { slug: building.slug } }">Dettagli</router-link>
                </button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.col-3 {
    padding: 10px;
}


.popular-icon {
    top: -15px;
    left: -16px;
    position: absolute;
    animation: pulse 2s infinite;
}

.popular-icon img {
    width: 70px;
}

@keyframes pulse {
    0% {
        transform: scale(0.90);
    }

    70% {
        transform: scale(1.01);
    }

    100% {
        transform: scale(0.90);
    }
}

.card {
    user-select: none;
    height: 100%;
    border-radius: 20px;
    background: #f5f5f5;
    position: relative;
    padding: 1.8rem;
    border: 2px solid #c3c6ce;
    transition: 0.5s ease-out;
    overflow: visible;

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

    .card-button {
        transform: translate(-50%, 125%);
        width: 60%;
        border-radius: 1rem;
        border: none;
        background-color: #D4C06C;
        color: white;
        font-weight: bold;
        font-size: 1rem;
        padding: .5rem 1rem;
        position: absolute;
        left: 50%;
        bottom: 0;
        opacity: 0;
        transition: 0.3s ease-out;
    }

    &:hover {
        border-color: #D4C06C;
        box-shadow: 0 4px 18px 0 rgba(0, 0, 0, 0.25);
        cursor: pointer;
    }

    &:hover .card-button {
        transform: translate(-50%, 50%);
        opacity: 1;
    }

    .sponsor-badge {
        top: 6px;
        left: 8px;
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