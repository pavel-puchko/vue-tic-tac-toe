<template>
  <div class="menu-wrapper">
    <h1>Tic Tac Toe</h1>
    <div class="main-menu">
      <button @click="startGame" class="button start-game">Create Classic Board</button>
      <button @click="joinGame" class="button join-game" disabled>Join Board</button>
      <button v-if="roomId" @click="backGame" class="button back-game">Back To Board</button>
    </div>
  </div>
</template>

<script>
import { db } from "./../firebase";

export default {
  data() {
    return {
      roomId: localStorage.getItem("tic-tac-toe-room-id")
    };
  },

  methods: {
    startGame() {
      this.$firebaseRefs.rooms
        .push({
          playerO: "",
          playerX: this.$root.identity,
          creator: this.$root.identity,
          creatorWins: 0,
          opponentWins: 0,
          moves: 0,
          activePlayer: "X",
          gameStatus: "turn",
          winner: "",
          cells: {
            1: "",
            2: "",
            3: "",
            4: "",
            5: "",
            6: "",
            7: "",
            8: "",
            9: ""
          }
        })
        .then(res => {
          this.$router.push({ name: "game", params: { gameId: res.key } });
        });
    },
    joinGame(room) {
      return;
    },

    backGame() {
      this.$router.push({ name: "game", params: { gameId: this.roomId } });
    }
  },

  firebase: {
    rooms: {
      source: db.ref("rooms"),
      // Optional, allows you to handle any errors.
      cancelCallback(err) {
        console.error(err);
      }
    }
  }
};
</script>

<style>
.menu-wrapper {
  margin-top: 87px;
}

.main-menu {
  margin: 0 auto;
  width: 20vw;
  padding: 24px 32px;
}

.button {
  color: #fff;
  border: 0px;
  font-family: "Dosis", Helvetica, sans-serif;
  font-size: 1.4em;
  font-weight: bold;
  margin: 0px;
  padding: 15px;
  width: 100%;
}

.start-game {
  background-color: #2c3e50;
}

.join-game {
  background-color: #f1c40f;
}

.back-game {
  background-color: #e74c3c;
}

.button + .button {
  margin-top: 16px;
}

.button:hover {
  cursor: pointer;
  opacity: 0.9;
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
