import Vue from 'vue'
import VueRouter from 'vue-router'

import Game from './components/Game.vue'
import Menu from './components/Menu.vue'

Vue.use(VueRouter);

const testcomp = {
  template: `<div>hello</div>`,
}

const routes = [
  { name: 'game', path: '/game/:gameId', component: Game, props: true },
  { name: 'menu', path: '/', component: Menu },
  { path: '*', redirect: '/' }
]

export const router = new VueRouter({
  routes,
  mode: 'history'
});