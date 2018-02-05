<template>
  <div v-if="room && room['.key'] === lastVisitedRoomId">
    <div class="scoreBoard">
      <h2 v-if="!isRoomFull">
        Send invite via: 
        <social-sharing :url="roomUrl" title="Join tic-tac-toe battle" description="I'm calling you to fight in tic-tac-toe. Let the battle begin." quote="I'm calling you to fight in tic-tac-toe. Let the battle begin." inline-template>
          <div>
            <network network="vk">VKontakte</network>
            <network network="facebook">Facebook</network>
            <network network="skype">Skype</network>
            <network network="telegram">Telegram</network>
            <network network="whatsapp">Whatsapp</network>
          </div>
        </social-sharing>
      </h2>
      <h2 v-else></h2>
      <router-link to="/">Menu</router-link>
    </div>
    <div id="game">
      <div id="details">
        <h1>{{gameType}}</h1>
      </div>
      <grid></grid>
      <button class="restart" @click="restart" v-if="(userIdentity === room.playerO || userIdentity === room.playerX ) && (room.gameStatus === 'win' || room.gameStatus === 'draw')">Restart</button>
    </div>
    <div v-if="isGomoku" id="alinchik" @click="restartWithAlinaWin()"></div>
  </div>
  <div v-else>
    <h1>Loading...</h1>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Grid from './Grid.vue'
import { db } from './../firebase';
import { getRestartGameConfig, getAlinaWinCells } from './../helpers';
import { SET_CELL_VALUE } from '../store/mutation-types'

export default {
  components: { Grid },
  props: ['gameId'],
  data: function() {
    return {
      roomUrl: location.href,
    }
  },
  computed: {
    ...mapState(['room', 'userIdentity', 'lastVisitedRoomId']),

    roomRef() {
      return db.ref(`rooms/${this.gameId}`)
    },

    isRoomFull() {
      return this.room.playerO && this.room.playerX;
    },

    gameType () {
      return this.room.boardSize === 15 ? 'Gomoku (5 to win)' : 'Classiс (3 to win)';
    },

    isGomoku() {
      return this.room.boardSize === 15;
    }
  },
  methods: {
    updateRoom (newData) {
      this.roomRef.update(newData);
    },

    restart () {
      this.roomRef.update(getRestartGameConfig(this.userIdentity, this.room));
    },

    restartWithAlinaWin() {
      this.roomRef.update({ ...getRestartGameConfig(this.userIdentity, this.room), ...{ cells: getAlinaWinCells(), gameStatus: 'win', winner: this.userIdentity, alinaWin: true}});
    }
  },
  created () {
    this.$store.dispatch('setRoomRef', {
       roomRef: this.roomRef,
       readyCallback: (data) => {
          const val = data.val();
          if (!val ||
            (val.playerX &&
            val.playerO &&
            val.playerO !== this.userIdentity &&
            val.playerX !== this.userIdentity
            )) {
            return this.$router.push({ name: "menu" });
          }
          this.$store.dispatch('setLastVisitedRoomId', data.key);
          if (!val.playerO && val.playerX !== this.userIdentity) {
            this.updateRoom({
              playerO: this.userIdentity
            })
          }
        },
    })

    Event.$on('updateRoom', updatedRoom => {
      this.updateRoom(updatedRoom);
    })
  }
}
</script>

<style>
#alinchik {
  width: 1px;
  height: 1px;
  position: fixed;
  left: 0;
  bottom: 0;
}
#game {
  padding: 0 36px;
  margin: 0 auto;
  color: #34495e;
}

.restart {
  background-color: #e74c3c;
  color: #fff;
  border: 0px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  font-family: 'Dosis', Helvetica, sans-serif;
  font-size: 1.4em;
  font-weight: bold;
  margin: 0px;
  padding: 15px;
  width: 300px;
}

.restart:hover {
  background-color: #c0392b;
  cursor: pointer;
}

.scoreBoard {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  box-shadow: 10px solid #fff;
  padding: 20px 72px;
  overflow-x: none;
}

.scoreBoard h2 {
  margin: 0px;
  display: flex;
}

.scoreBoard h2 > div > span {
  text-decoration: underline;
  cursor: pointer;
}
.scoreBoard h2 > div > span {
  margin-left: 16px;
}

.scoreBoard a {
  font-size: 1.3em;
  text-decoration: underline;
  color: aliceblue;
}
.scoreBoard section span {
  font-size: 1.5em;
  font-weight: bold;
}

.scoreBoard section span + span {
  margin-left: 20px;
}
</style>
