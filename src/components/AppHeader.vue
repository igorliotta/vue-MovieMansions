
<script>

export default {
    data() {
        return {

        }
    }
}

</script>

<template>

    <header>
        <div class="container-fluid navbar-c">
            <router-link :to="{name:'home'}">
                <div class="home">
                        <img class="logo" src="../assets/logo.png">
                        Home 
                </div>
            </router-link>
            <ul class="links sx">
                <li class="m-sx">
                    <router-link :to="{name:'buildings.index'}">Prenota</router-link>
                </li>
                <li>
                    <a href="http://127.0.0.1:8000/register" target="_blank">Registra Immobile</a>
                </li>
            </ul>
        </div>
    </header>

</template>

<style lang="scss">

.navbar-c {
    display: flex; 
    justify-content: space-between;
    align-items: center; 
    padding: 10px 40px; 
    background-color: white;
    border-bottom: 2px solid rgba(0, 0, 0, 0.333);
    height: 50px;
    position: fixed;
    top:0;
    right: 0; 
    left: 0; 
    background: rgb(255, 255, 255);
    background: linear-gradient(77deg, rgba(255, 255, 255, 1) 13%, rgba(226, 231, 221, 0.7457107843137255) 65%, rgba(90, 141, 129, 0.7961309523809523) 100%);
    transition: height 0.2s;

    .links {
        display: flex; 
        gap: 10px; 

        .m-sx {
            margin-right: 10px; 
        }

        li {
        display: flex; 
        justify-content: center;
        align-items: center;
        color: white; 
        }


        li:hover {
            color: #5A8D80;;
        }
    }
}


    .home {
        display: flex; 
        gap: 10px;
        align-items: center;
        color: #5A8D80;
    }
    
    .home:hover {
        color : #D3BF6A;
    }


.navbar-c:hover {
    height: 60px;
    font-size: 18px;
}

.logo {
    width: 50px; 
    transform: rotate(0);
    transition: transform 0.5s;
}

.logo:hover{
    transform: rotate(360deg);
}
</style>