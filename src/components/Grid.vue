<template>
	<div class="grid-wrapper" :class="{'gomoku' : isGomoku}">
		<div class="gameStatus" :class="gameStatusColor">
			{{ gameStatusMessage }}
		</div>
		<table class="grid">
			<tr v-for="n in boardSize" :key="n + '_column'">
		    <cell v-for="k in boardSize" :key="k + '_cell'" :name="getIndex(n, k)" :mark="cells[getIndex(n, k)]"></cell>
			</tr>
		</table>
	</div>
</template>

<script>
import Cell from './Cell.vue'

export default {
	components: { Cell },
  props: ['boardSize', 'winCount', 'moves', 'cells', 'activePlayer', 'winner', 'gameStatus', 'hardFreeze', 'playerO', 'playerX'],
  data () {
    return {
    }
  },

  computed: {
		isGomoku() {
			return this.boardSize === 15;
		},

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
		getIndex(n, k) {
			return (n - 1) * this.boardSize +  k;
		},
		checkForWin (checkedFunction) {
			let markCount = 0;
			for (let i = 1; i < this.cells.length; i++) {
				const cell = this.cells[i];
				let tempIndex = i;
				if (this.activePlayer === cell) {
					markCount += 1;
					debugger;
					for (let i = 0; i < this.winCount - 1; i++) {
						const nextIndex = checkedFunction(tempIndex);
						if (this.cells[nextIndex] === this.activePlayer) {
							markCount += 1;
							tempIndex = nextIndex;
						} else {
							markCount = 0;
							break;
						}
					}
					if (markCount === this.winCount) {
						return true;
					}
				} else {
					markCount = 0;
				}
			}
			return false
		},

		gameIsWon () {
			Event.$emit('win', this.activePlayer)
			console.log('win');
		},

		getGameStatus () {
			if (this.checkForWin(this.getNextHorizontalCellIndex) ||
			this.checkForWin(this.getNextVerticalCellIndex) ||
			this.checkForWin(this.getNextRightDiagonalCellIndex) || 
			this.checkForWin(this.getNextLeftDiagonalCellIndex)) {
				return 'win'
			} else if (this.moves === this.boardSize * this.boardSize - 1) {
				return 'draw'
			}
			return 'turn'
		},

		getNextHorizontalCellIndex(index) {
			if (index % this.boardSize === 0) {
				return null;
			} else {
				return index + 1;
			}
		},
		getNextVerticalCellIndex(index) {
			const nextIndex = index + this.boardSize;
			return nextIndex > this.cells.length - 1 ? null : nextIndex;
		},
		getNextRightDiagonalCellIndex(index) {
			const nextIndex = index + this.boardSize;
			if ((nextIndex > this.cells.length - 1) || (nextIndex % this.boardSize === 0)) {
				return null;
			} else {
				return nextIndex + 1;
			}
		},
		getNextLeftDiagonalCellIndex(index) {
			const nextIndex = index + this.boardSize;
			if ((nextIndex > this.cells.length - 1) || (nextIndex - 1 % this.boardSize === 0)) {
				return null;
			} else {
				return nextIndex - 1;
			}
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
.grid-wrapper {
	display: flex;
	flex-direction: column;
	align-items: center;
}
.grid {
	background-color: #34495e;
	color: #fff;
  width: auto;
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
	width: 300px;
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
.cell {
  width: 125px;
  height: 125px;
  border: 6px solid #2c3e50;
  font-size: 100px;
  font-family: 'Gochi Hand', sans-serif;
  border-top-color: transparent;
}
.gomoku .cell {
  width: 25px;
  height: 25px;
  border: 2px solid #2c3e50;
  font-size: 20px;
}

.statusDraw {
	background-color: #9b59b6;
}
</style>
