import Vue from 'vue'
import { sync} from 'vuex-router-sync'

import './firebase';
import store from './store'
import { router } from './router'

import App from './components/App.vue'

import { SET_USER_IDENTITY, SET_ROOM_ID }  from './store/mutation-types'

window.Event = new Vue();

if (!localStorage.getItem('tic-tac-toe-id')) {
  localStorage.setItem('tic-tac-toe-id', new Date().getTime() + '-' + Math.random());
}

sync(store, router);

new Vue({
  router,
  store,
  el: "#app",
  render: h => h(App),
  created() {
    store.commit(SET_USER_IDENTITY, {
      identity: new Date().getTime() + '-' + Math.random() || localStorage.getItem('tic-tac-toe-id')
    });
    store.commit(SET_ROOM_ID, {
      roomId: localStorage.getItem('tic-tac-toe-room-id')
    });
  }
});