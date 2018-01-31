<template>
  <div v-if="room['.key']">
    <div class="scoreBoard">
      <section>
        <span>My wins: {{ myWins }}</span>
        <span>Opponent wins: {{ opponentWins }}</span>
      </section>
      <h2>Room ID: {{room['.key']}}</h2>
      <router-link to="/">Menu</router-link>
    </div>
    <div id="game">
      <div id="details">
        <h1>{{gameType}}</h1>
      </div>
      <grid 
        :board-size="room.boardSize"
        :win-count="room.winCount"
        :moves="room.moves"
        :cells="room.cells"
        :active-player="room.activePlayer"
        :winner="room.winner"
        :game-status="room.gameStatus"
        :hard-freeze="room.hardFreeze"
        :player-o="room.playerO"
        :player-x="room.playerX"
        ></grid>
      <button class="restart" @click="restart" v-if="(this.$root.identity === room.playerO || this.$root.identity === room.playerX ) && (room.gameStatus === 'win' || room.gameStatus === 'draw')">Restart</button>
    </div>
  </div>
  <div v-else>
    <h1>Loading...</h1>
  </div>
</template>

<script>
import Grid from './Grid.vue'

import { db } from './../firebase';
import { getEmptyCells } from "./../helpers";


export default {
  components: { Grid },
  props: ['gameId'],
  data () {
    return {
      room: {},
    }
  },

  computed: {
    gameType () {
      return this.room.boardSize === 15 ? 'Gomoku' : 'Classik';
    },
		myWins () {
			if (this.room.creator === this.$root.identity) {
				return this.room.creatorWins;
			} else {
				return this.room.opponentWins;
			}
    },

    opponentWins () {
			if (this.room.creator === this.$root.identity) {
				return this.room.opponentWins;
			} else {
				return this.room.creatorWins;
			}
		},
  },

  methods: {

    updateRoom (newData) {
      this.$firebaseRefs.room.update(newData);
    },

    creatorWin() {
      this.updateRoom({
        creatorWins: this.room.creatorWins + 1
      });
    },

    opponentWin() {
      this.updateRoom({
        opponentWins: this.room.opponentWins + 1
      });
    },
    
    restart () {
      const opponentIdentity = this.room.playerX === this.$root.identity ? 
        this.room.playerO :
        this.room.playerX;
      this.$firebaseRefs.room.update({
        gameStatus: 'turn',
        activePlayer: 'X',
        moves: 0,
        winner: '',
        playerX: this.$root.identity,
        playerO: opponentIdentity,
        hardFreeze: false,
        cells: getEmptyCells(this.room.boardSize),
      });
    }
  },

  firebase: function () {
    return {
      room: {
        source: db.ref(`rooms/${this.gameId}`),
        asObject: true,
        readyCallback(data) {
          const val = data.val();
          if (!val || (val.playerX && val.playerO && val.playerO !== this.$root.identity && val.playerX !== this.$root.identity)) {
            return this.$router.push({ name: "menu" });
          }
          localStorage.setItem('tic-tac-toe-room-id', this.gameId);
          if (!val.playerO && val.playerX !== this.$root.identity) {
            this.updateRoom({
              playerO: this.$root.identity
            })
          }
        },
        cancelCallback(err) {
          console.error(err);
        }
      }
    }
  },

  created () {
    Event.$on('win', winner => {
      if (!winner) {
        return;
      }
      const winnerPlayer = winner === 'X' ? this.room.playerX : this.room.playerO;
      if (winnerPlayer === this.room.creator) {
        this.creatorWin();
      } else {
        this.opponentWin();
      }
    })

    Event.$on('update', board => {
      this.updateRoom(board);
    })
  }
}
</script>

<style>
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
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 15px;
  box-shadow: 10px solid #fff;
  padding: 20px 0;
  overflow-x: none;
}

.scoreBoard h2 {
  margin: 0px;
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
