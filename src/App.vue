<script>
import Appheader from './components/Appheader.vue';

export default {
    components: {
      Appheader,
    }
  }
</script>

<template>
    <Appheader class="z-ind"/>
      <router-view class="main">
      </router-view>

</template>

<style lang="scss">
@use './styles/general.scss';

.main {
  padding: 50px; 
  min-height: 100vh;
}

.z-ind {
  position: sticky;
  z-index: 100; 
}




@import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@300;500;700&family=Dosis:wght@300;500;700&display=swap');
</style>
