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
    <div class="col-3">
        <div class="card">
            <h4>{{ building.title }}</h4>
            <p class="address">{{ building.address }}</p>
            <img v-if="building.image" class="thumb" :src="'http://127.0.0.1:8000/storage' + building.image">
            <div class="row-pic">
                <img v-for="image in building.images" class="preview" :src="'http://127.0.0.1:8000/storage' + image.url">
            </div>
            <p class="btn-custom">
                <router-link :to="{ name: 'buildings.show', params: { slug: building.slug } }">Dettagli</router-link>
            </p>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.col-3 {
    padding: 10px;
}

.card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    padding: 10px;
    height: 100%;
    border-radius: 10px;

    &:hover {
        border: 3px solid #D3BF6A;
    }

    h4 {
        color: #5B8E81;
        text-align: center;
    }

    .thumb {
        max-width: 100%;
        width: 200px;
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

    .address {
        text-align: center;
        font-size: 12px;
    }
}

.tags {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 3px;

    p {
        border-radius: 10px;
        padding: 2px 8px;
        border: 2px solid;
    }
}
</style>