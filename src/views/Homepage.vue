<script>

export default {
    data() {
        return {
            currentElement : 0,
            currentClass: '', 
        }
    },
    methods : {
        carouselGO(){
            this.currentElement = (this.currentElement + 1) % 5;
            if(this.currentElement === 1){
                this.currentClass = '.second'
            } else if (this.currentElement === 2){
                this.currentClass = '.third'
            }else if (this.currentElement === 3){
                this.currentClass = '.fourth'            
            }else {
                this.currentClass = '.fifth'
            }
        },
    },
    mounted() {
        setInterval(() => {
            this.carouselGO(); 
        }, 2000);
    },

}


</script>

<template >

    <div class="hero-c" :class="currentClass">
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
    position: relative; 
}

.text-wrap {
    display: flex; 
    justify-content: space-between; 
    padding: 30px 30px 10px 30px; 
    gap: 80px; 

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

        .t-green {
            color:  #5A8D80; 
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }

        .t-gold {
            color:  #C6B35D;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
        }
    }

}

.action {
    display: flex; 
    flex-direction: column; 
    justify-content: center; 
    align-items: center;
    color: white; 
    position: absolute; 
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

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


/* Stili per desktop (e dispositivi più grandi) */
@media (min-width: 1200px) {
    /* Stili per desktop extra-large */
    .text-wrap{

        .title{
        font-size: 45px; 
        }

        .description {
            font-size: 25px; 
        }
    }

    .action {
        margin-top: 10px; 
        .wrap {
            font-size: 18px; 

            p {
                font-size: 20px;
            }
        }
    }
}

@media (max-width: 992px) {
    /* Stili per desktop large */
    .action {
        margin-top: 20px; 
    }

    .text-wrap{

.title{
font-size: 28px; 
}

.description {
    font-size: 16px; 
}
}
}

@media (max-width: 768px) {
    /* Stili per tablet orizzontale e desktop medium */
    .action {
        margin-top: 20px; 
    }
}

/* Stili per tablet verticale */
@media (max-width: 576px) {
    /* Stili per dispositivi più grandi di smartphone, come tablet in modalità verticale */
    .text-wrap{
        padding: 60px 10px 30px 10px; 
        gap: 60px; 

        .title{
        font-size: 25px; 
        align-items: flex-start; 
        }

        .description {
            font-size: 14px; 
            text-align: right; 
        }
    }

    .action {
        margin-top: 60px; 
    }

    
}

/* Stili per smartphone e dispositivi più piccoli */
@media (max-width: 575px) {
    
}

</style>