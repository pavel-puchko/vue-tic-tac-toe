import Vue from 'vue'
import VueRouter from 'vue-router'
import VueFire from 'vuefire'

import App from './App.vue'
import './firebase';

import Game from './components/Game.vue'
import Menu from './components/Menu.vue'


Vue.use(VueRouter);
Vue.use(VueFire);

window.Event = new Vue();

if (!localStorage.getItem('tic-tac-toe-id')) {
  localStorage.setItem('tic-tac-toe-id', new Date().getTime() + '-' + Math.random());
}

const routes = [
  { name: 'game', path: '/game/:gameId', component: Game, props: true },
  { name: 'menu', path: '/', component: Menu },
  { path: '*', redirect: '/' }
]

const router = new VueRouter({
  routes // short for `routes: routes`
})

new Vue({
  router,
  el: "#app",
  data: {
    // identity: localStorage.getItem('tic-tac-toe-id')
    identity: new Date().getTime()
  },
  render: h => h(App)
});