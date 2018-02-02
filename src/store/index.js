import Vue from 'vue'
import Vuex from 'vuex'
import { firebaseMutations, firebaseAction } from 'vuexfire'
import * as actions from './actions'
import createLogger from '../logger'
import * as types from './mutation-types'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  actions,
  state: {
    room: null,
    lastVisitedRoomId: '',
    userIdentity: '',
  },
  strict: debug,
  mutations: {
    [types.SET_USER_IDENTITY] (state, { identity }) {
      state.userIdentity = identity
    },
    [types.SET_CELL_VALUE] (state, { cellNumber, value }) {
      state.room.cells[cellNumber] = value;
      state.room.lastPlayedCellIndex = cellNumber;
    },
    [types.SET_ROOM_ID] (state, { roomId }) {
      state.lastVisitedRoomId = roomId;
    },
    [types.LEFT_CURRENT_GAME_ROOM] (state) {
      state.room = null;
    },
    ...firebaseMutations
  },
  actions: {
    setRoomRef: firebaseAction(({ bindFirebaseRef }, { roomRef, readyCallback}) => {
      bindFirebaseRef('room', roomRef, {
        readyCallback,
      })
    }),
    deleteRoomRef: firebaseAction(({ state, commit, unbindFirebaseRef }) => {
      if (state.room) {
        unbindFirebaseRef('room');
        commit(types.LEFT_CURRENT_GAME_ROOM);
      }
    }),
    setLastVisitedRoomId({ commit }, roomId) {
      localStorage.setItem('tic-tac-toe-room-id', roomId);
      commit(types.SET_ROOM_ID, {
        roomId,
      })
    }
  },
  plugins: debug ? [createLogger()] : []
})