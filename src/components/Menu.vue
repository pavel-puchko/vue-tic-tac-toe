<template>
  <div class="menu-wrapper">
    <h1>Tic Tac Toe</h1>
    <div class="main-menu">
      <button @click="startGame(3, 3)" class="button start-game">Create Classic Board</button>
      <button @click="startGame(15, 5)" class="button start-game">Create Gomoku Board</button>
      <button @click="startGame(15, 5, true)" class="button start-game">Play Gomoku vs AI</button>
      <button v-if="lastVisitedRoomId" @click="backGame" class="button back-game">Back To Board</button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { uuid } from 'vue-uuid'
import { db } from "./../firebase"
import { getNewRoomDefaultConfig } from "./../helpers"

export default {
  computed: {
    ...mapState(['userIdentity', 'lastVisitedRoomId'])
  },
  methods: {
    startGame(size, winCount, vsBot) {
      this.$store.dispatch('deleteRoomRef');
      const id = uuid.v4();
      db.ref(`rooms/${id}`)
        .set(getNewRoomDefaultConfig(this.userIdentity, size, winCount, vsBot))
        .then(res => {
          this.$router.push({ name: "game", params: { gameId: id } });
        });
    },

    backGame() {
      this.$router.push({ name: "game", params: { gameId: this.lastVisitedRoomId } });
    }
  },
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
