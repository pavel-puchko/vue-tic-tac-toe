<template>
	<div>
		<div class="gameStatus" :class="gameStatusColor">
			{{ gameStatusMessage }}
		</div>
		<table class="grid">
		  <tr>
		    <cell name="1" :mark="cells[1]"></cell>
		    <cell name="2" :mark="cells[2]"></cell>
		    <cell name="3" :mark="cells[3]"></cell>
		  </tr>
		  <tr>
		    <cell name="4" :mark="cells[4]"></cell>
		    <cell name="5" :mark="cells[5]"></cell>
		    <cell name="6" :mark="cells[6]"></cell>
		  </tr>
		  <tr>
		    <cell name="7" :mark="cells[7]"></cell>
		    <cell name="8" :mark="cells[8]"></cell>
		    <cell name="9" :mark="cells[9]"></cell>
		  </tr>
		</table>
	</div>
</template>

<script>
import Cell from './Cell.vue'

export default {
	components: { Cell },
  props: ['moves', 'cells', 'activePlayer', 'winner', 'gameStatus', 'hardFreeze', 'playerO', 'playerX'],
  data () {
    return {
			winConditions: [
				[1, 2, 3], [4, 5, 6], [7, 8, 9], // rows
				[1, 4, 7], [2, 5, 8],	[3, 6, 9], // columns
				[1, 5, 9], [3, 5, 7]             // diagonals
			],
    }
  },

  computed: {
		isMyTurn () {
			if (this.activePlayer === 'X') {
				return this.playerX === this.$root.identity;
			} else {
				return this.playerO === this.$root.identity;
			}
		},

  	nonActivePlayer () {
  		if (this.activePlayer === 'O') {
  			return 'X'
  		}

  		return 'O'
		},
		
		gameStatusColor() {
			if (!this.playerO) {
				return 'statusWait'
			}
			if (this.gameStatus === 'win') {
				return 'statusWin'
  		} else if (this.gameStatus === 'draw') {
  		 	return 'statusDraw'
			} 
			
			return 'statusTurn'
		},

		gameStatusMessage() {
			if (!this.playerO) {
				return 'Waiting for opponent'
			}
  		if (this.gameStatus === 'win') {
  			return `${this.winner} Wins !`
			} 
			if (this.gameStatus === 'draw') {
  			return 'Draw !'
  		}
			return this.isMyTurn ? `You turn (${this.activePlayer})` :  `Opponent turn (${this.activePlayer})`
		}
  },

  methods: {
		checkForWin () {
			for (let i = 0; i < this.winConditions.length; i++) {
				// gets a single condition wc from the whole array
				let wc = this.winConditions[i]
				let cells = this.cells

				// compares 3 cell values based on the cells in the condition
				if (this.areEqual(cells[wc[0]], cells[wc[1]], cells[wc[2]])) {
					return true
				}
			}

			return false
		},

		gameIsWon () {
			Event.$emit('win', this.activePlayer)
			console.log('win');
		},

		getGameStatus () {
			if (this.checkForWin()) {
				return 'win'
			} else if (this.moves === 8) {
				return 'draw'
			}
			return 'turn'
		},

		areEqual () {
		  var len = arguments.length;

		  for (var i = 1; i < len; i++){
		    if (arguments[i] === '' || arguments[i] !== arguments[i-1])
		      return false;
		   }
		   return true;
		}
  },

  created () {
  	Event.$on('strike', (cellNumber) => {
			this.cells[cellNumber] = this.activePlayer
			
			const gameStatus = this.getGameStatus();
			let winner = '';

			if (gameStatus === 'win') {
				this.gameIsWon();
				winner = this.activePlayer;
			}

			Event.$emit('update', { 
				moves: this.moves + 1,
				activePlayer: this.nonActivePlayer,
				cells: this.cells,
				gameStatus: gameStatus,
				winner: winner,
				hardFreeze: gameStatus === 'win'
			});
  	})

  }
}
</script>

<style>
.grid {
	background-color: #34495e;
	color: #fff;
  width: 100%;
  border-collapse: collapse;
}

.gameStatus {
	margin: 0px;
	padding: 15px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  color: #fff;	
  font-size: 1.4em;
  font-weight: bold;
}

.statusTurn {
	background-color: #e74c3c;
}

.statusWin {
	background-color: #2ecc71;
}

.statusWait {
	background-color: #f1c40f;
}

.statusDraw {
	background-color: #9b59b6;
}
</style>
