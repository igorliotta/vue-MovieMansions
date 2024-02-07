
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
        <div class="container-fluid navbar">
            <ul class="links">
                <li>
                    <img class="logo" src="../assets/logo.png">
                </li>
                <li>
                    <router-link :to="{name:'home'}">Home </router-link>
                </li>
            </ul>
            <ul class="links">
                <li>
                    <router-link :to="{name:'buildings.index'}">Cerca Appartamento</router-link>
                </li>
                <li>
                    <a href="http://127.0.0.1:8000/register" target="_blank">Registrati</a>
                </li>
            </ul>
        </div>
    </header>

</template>

<style lang="scss">

.navbar {
    display: flex; 
    justify-content: space-between;
    align-items: center; 
    padding: 10px 40px; 
    background-color: white;
    border-bottom: 2px solid rgba(0, 0, 0, 0.333);
    color: #5A8D80;
    height: 50px;
    position: fixed;
    top:0;
    right: 0; 
    left: 0; 
    transition: height 0.2s;

    .links {
        display: flex; 
        gap: 10px; 

        li {
        display: flex; 
        justify-content: center;
        align-items: center;
    }

        li:hover {
            color: #C6B35D;
        }
    }
}

.navbar:hover {
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