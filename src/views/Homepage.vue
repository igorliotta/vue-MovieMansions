<script>

export default {
    data() {
        return {
            currentElement : 0,
        }
    },
    methods : {
        carouselGO(){
            this.currentElement = (this.currentElement + 1) % 5;
            this.currentImage = ''
        },
    },
    mounted() {
        setInterval(() => {
            this.carouselGO(); 
        }, 1500);
    },

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
        
        <div class="img-holder"  :class="currentElement !== 1 ? 'hide' : ''">
            <img v-show="currentElement === 1" key="1" src="../assets/homepage/collage0.png" :class="currentElement !== 1 ? 'hide' : ''" />
        </div>
        <div class="img-holder" :class="currentElement !== 2 ? 'hide' : ''">
            <img v-show="currentElement === 2" key="2" src="../assets/homepage/collage1.png" :class="currentElement !== 2 ? 'hide' : ''" />
        </div>
        <div class="img-holder" :class="currentElement !== 3 ? 'hide' : ''">
            <img v-show="currentElement === 3" key="3" src="../assets/homepage/collage2.png" :class="currentElement !== 3 ? 'hide' : ''" />
        </div>
        <div class="img-holder" :class="currentElement !== 4 ? 'hide' : ''">
            <img v-show="currentElement === 4" key="4" src="../assets/homepage/collage3.png" :class="currentElement !== 4 ? 'hide' : ''" />
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

.hide {
    opacity: 0; 
    scale: 0.5; 
    transform: translate(-20%, 0);
    transition: all 0.2s ease-in;
}

.img-holder {
    display: flex; 
    justify-content: center;
    align-items: center;
    opacity: 1; 
    transition: all 0.2s ease-in;
    


    img {
        width: 25%; 
        opacity: 1;
        scale: 1; 
        transition: all 0.2s ease-in;
        box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
    }

}
.action {
    display: flex; 
    flex-direction: column; 
    justify-content: center; 
    align-items: center;
    color: white; 
    position: absolute;  
    top: 30%;
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