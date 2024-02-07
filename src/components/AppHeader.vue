
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
                    <router-link :to="{name:'home'}">Home</router-link>
                </li>
            </ul>
            <ul class="links">
                <li>
                    <router-link :to="{name:'contacts'}">Contatti</router-link>
                </li>
                <li>
                    <router-link :to="{name:'buildings.index'}">Portfolio</router-link>
                </li>
                <li>
                    <a href="http://127.0.0.1:8000/login" target="_blank">Admin Zone</a>
                </li>
            </ul>
        </div>
    </header>

</template>

<style lang="scss">
header{
   padding-bottom: 20px; 
}

.navbar {
    display: flex; 
    justify-content: space-around;
    align-items: center; 
    padding: 10px 0; 
    background-color: #1C506E;
    color:  #F18908;
    height: 50px;
    position: fixed;
    top:0;
    right: 0; 
    left: 0; 
    transition: height 0.2s;

    .links {
        display: flex; 
        gap: 10px; 

        li:hover {
            color: #FEC572;
        }
    }
}

.navbar:hover {
    height: 70px;
    font-size: 20px;
}

.logo {
    width: 25px; 
    transform: rotate(0);
    transition: transform 0.5s;
}

.logo:hover{
    transform: rotate(180deg);
}
</style>