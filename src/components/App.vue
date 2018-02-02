<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import Game from './Game.vue';
import Menu from './Menu.vue';


export default {
  name: 'app',
  components: { Menu, Game }
}
</script>

<style>
  html {
    height: 100%;
  }
  body {
    background: rgb(10,18,31) url("https://wallup.net/wp-content/uploads/2016/01/52654-technology-anime-Joystick-simple_background-simple-video_games-PlayStation-digital_art-controllers-broken.jpg");
    background-size: cover;
    background-repeat: no-repeat;
    width: 100%;
    color: #fff;
    font-family: 'Dosis', Helvetica, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    margin: 0px;
  }
  h1 {
    color: azure;
    text-transform: uppercase;
    font-size: 2.5em;
    margin: 10px 0 20px 0;
    
  }
</style>
