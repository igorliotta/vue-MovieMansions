<script>

export default {
    data() {
        return {
            titles : [
                "Padme Palace",
                "Il Padrino: la casa",
                "Villa di Bruce Wayne",
                "Mamma ho perso l'aereo",
                "Scarface House", 
                "House of Gucci",
                "Hogwarts",
                "Privet Drive n.4",
                "Casa Baggins",
                "Casa di Jep Gambardella",
                "la Marinella di Montalbano"
            ]
        }
    },
    methods : {

        showTitle(array){
            
        }
    }

}


</script>

<template >

    <div class="hero-c">
        <div class="text-wrap">
            <div class="title">
                <span class="t-green">Movie</span>
                <span class="t-gold">Mansions</span>
            </div>
            <div class="description">
                <p>Prenditi una vacanza nelle case set dei tuoi film preferiti</p>
            </div>
        </div>

        <div class="action">
            <div class="wrap">
                <p>Pronto a prenotare?</p>
                <router-link class="a" :to="{name:'buildings.index'}">Ciack, si gira! &rarrw;</router-link>
            </div>
        </div>
    </div>
    

</template>

<style lang="scss" scoped>

.hero-c {
    background-image: url(../assets/home_bg.jpeg);
    background-size: cover;
    background-position: bottom;
}

.text-wrap {
    display: flex; 
    justify-content: space-between; 
    padding: 30px 30px 10px 30px; 

    .description {
        max-width: 200px; 
        font-size: 20px; 

    }

    .title {
        display: flex; 
        flex-direction: column; 
        align-items: center; 
        font-size: 35px; 
        font-weight: 700;
        background-size: cover;
        transform: rotate(0);
        transition: transform 0.5s;

        .t-green {
            color:  #5A8D80; 
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }

        .t-gold {
            color:  #C6B35D;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
        }
    }

    .title:hover {
        transform: rotate(360deg);
    }
}

.action {
    display: flex; 
    flex-direction: column; 
    justify-content: center; 
    align-items: center;
    color: white; 

    .wrap {
        background-color: rgba($color: #06323B , $alpha: 0.7);
        text-align: center;
        padding: 5px; 
    }

    .a{
        text-decoration: underline;
    }

    p {
        font-size: 18px; 
    }
}

</style>