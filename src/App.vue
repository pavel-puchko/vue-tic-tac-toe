<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app',
  data () {
    return {
    }
  },
}
</script>

<style>
  html {
    height: 100%;
  }
  body {
    background-image: url("https://wallup.net/wp-content/uploads/2016/01/52654-technology-anime-Joystick-simple_background-simple-video_games-PlayStation-digital_art-controllers-broken.jpg");
    background-size: hover;
    background-repeat: no-repeat;
    background-size: 100% 100%;
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
    font-size: 3em;
    margin: 20px 0;
  }
</style>
