<script>

export default {
    data() {
        return {
            currentElement : 0,
        }
    },
    methods : {
        movieGO(){
            this.currentElement = 1;
        },
        mansionsGO(){
            this.currentElement = 2;
        },
        titleSTOP(){
            this.currentElement = 0;
        }
    },
    mounted() {
        setTimeout(() => {
            this.movieGO();
        }, 1000);
        setTimeout(() => {
            this.mansionsGO();
        }, 1700);
        setTimeout(() => {
            this.titleSTOP();
        }, 3000);
    },

}


</script>

<template >

    <div class="hero-c">
        <div class="text-wrap">
            <div class="title">
                <div class="home-title t-green" :class="currentElement !== 0 ? 'active-title' : '' ">
                    <div class="original">Movie</div>
                    <div class="letters">
                        <span>M</span>
                        <span>o</span>
                        <span>v</span>
                        <span>i</span>
                        <span>e</span>
                    </div>
                </div>
                <div class="home-title t-gold" :class="currentElement === 2 ? 'active-title' : '' ">
                    <div class="original bg-green">Mansions</div>
                    <div class="letters">
                        <span>M</span>
                        <span>a</span>
                        <span>n</span>
                        <span>s</span>
                        <span>i</span>
                        <span>o</span>
                        <span>n</span>
                        <span>s</span>
                    </div>
                </div>
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

.home-title,
.home-title *,
.home-title :after,
.home-title :before,
.home-title:after,
.home-title:before {
    border: 0 solid;
    box-sizing: border-box;
}

.home-title {
    -webkit-tap-highlight-color: transparent;
    background-color: white;
    background-image: none;
    color: #D3BF6B;
    cursor: pointer;
    font-size: 100%;
    margin: 0;
    padding: 0;
}

.home-title:disabled {
    cursor: default;
}

.home-title:-moz-focusring {
    outline: auto;
}


.home-title {
    border-radius: 20px;
    box-sizing: border-box;
    display: block;
    font-weight: 700;
    overflow: hidden;
    padding: 4px 6px;
    position: relative;

}

.home-title .original {
    background: #D3BF6B;
    color: white;
    display: grid;
    inset: 0;
    place-content: center;
    position: absolute;
    transition: transform 0.2s cubic-bezier(0.87, 0, 0.13, 1);
}

.home-title.active-title .original {
    transform: translateY(100%);
}

.home-title .letters {
    display: inline-flex;
}

.home-title span {
    opacity: 0;
    transform: translateY(-15px);
    transition: transform 0.2s cubic-bezier(0.87, 0, 0.13, 1), opacity 0.2s;
}

.home-title span:nth-child(2n) {
    transform: translateY(15px);
}

.home-title.active-title span {
    opacity: 1;
    transform: translateY(0);
}

.home-title.active-title span:nth-child(2) {
    transition-delay: 0.1s;
}

.home-title.active-title span:nth-child(3) {
    transition-delay: 0.2s;
}

.home-title.active-title span:nth-child(4) {
    transition-delay: 0.3s;
}

.home-title.active-title span:nth-child(5) {
    transition-delay: 0.4s;
}

.home-title.active-title span:nth-child(6) {
    transition-delay: 0.5s;
}
.home-title.active-title span:nth-child(7) {
    transition-delay: 0.6s;
}
.home-title.active-title span:nth-child(8) {
    transition-delay: 0.7s;
}




.action {
    display: flex; 
    flex-direction: column; 
    justify-content: center; 
    align-items: center;
    color: white; 
    position: absolute;  
    top: 35%;
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

        .bg-green {
            background-color:  #5A8D80;
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
        margin-top: 40px; 
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

    .img-holder {
    top: 180px; 
    left: 0; 
    right: 0; 

    img {
        width: 40%; 
        opacity: 0.8;
        scale: 1; 
        transition: all 0.2s ease-in;
        box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
    }
}
.lft {
    left: 20px; 
    right: 20px;
    bottom: 250px; 
    justify-content: flex-start;
    align-items: flex-end;
}

.btm {
    bottom: 60px; 
    align-items: flex-end;
    left: 0; 
    right: 0;
    justify-content: center;
}

.rgt{
    bottom: 220px; 
    left: 0px; 
    right: 60px;
    justify-content: flex-end;
    align-items: flex-end;
}

    .action {
        margin-top: 60px; 
    }

    
}

/* Stili per smartphone e dispositivi più piccoli */
@media (max-width: 575px) {
    
}

</style>