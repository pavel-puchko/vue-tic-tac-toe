<template>
	<div class="grid-wrapper" :class="{'gomoku' : isGomoku}">
		<div class="gameStatus" :class="gameStatusColor" :data-end="room.gameStatus === 'turn' && room.playerO ? room.activePlayer : ''">
			{{ gameStatusMessage }}
		</div>
		<table class="grid">
			<tr v-for="n in room.boardSize" :key="n + '_column'">
		    <cell v-for="k in room.boardSize" :key="getCellIndex(n, k) + '_cell'" :name="getCellIndex(n, k)" :mark="room.cells[getCellIndex(n, k)]"></cell>
			</tr>
		</table>
	</div>
</template>

<script>
import { mapState } from 'vuex'
import Cell from './Cell.vue'
import { SET_CELL_VALUE } from '../store/mutation-types'

export default {
	components: { Cell },
  computed: {
		...mapState(['room', 'userIdentity']),

		isGomoku() {
			return this.room.boardSize === 15;
		},

		isMyTurn () {
			if (this.room.gameStatus !== 'turn') {
				return false;
			}
			if (this.room.activePlayer === 'X') {
				return this.room.playerX === this.userIdentity;
			} else {
				return this.room.playerO === this.userIdentity;
			}
		},

  	nonActivePlayer () {
  		if (this.room.activePlayer === 'O') {
  			return 'X'
  		}

  		return 'O'
		},
		
		gameStatusColor() {
			if (!this.room.playerO) {
				return 'statusWait'
			}
			if (this.room.gameStatus === 'win') {
				return 'statusWin'
  		} else if (this.room.gameStatus === 'draw') {
  		 	return 'statusDraw'
			} 
			
			return 'statusTurn'
		},

		gameStatusMessage() {
			if (!this.room.playerO) {
				return 'Waiting for opponent'
			}
  		if (this.room.gameStatus === 'win') {
  			return `${this.winner} Wins !`
			} 
			if (this.room.gameStatus === 'draw') {
  			return 'Draw !'
  		}
			return this.isMyTurn ? `You turn: ` :  `Opponent turn: `
		}
  },
  methods: {
		getCellIndex(n, k) {
			return (n - 1) * this.room.boardSize +  k;
		},
	
		checkForWin (checkedFunction) {
			const cells = this.room.cells;
			const winCount = this.room.winCount;
			const activePlayer = this.room.activePlayer;
			let markCount = 0;

			for (let i = 1; i < cells.length; i++) {
				const cell = cells[i];
				let tempIndex = i;
				if (activePlayer === cell) {
					markCount += 1;
					for (let i = 0; i < winCount - 1; i++) {
						const nextIndex = checkedFunction(tempIndex);
						if (cells[nextIndex] === activePlayer) {
							markCount += 1;
							tempIndex = nextIndex;
						} else {
							markCount = 0;
							break;
						}
					}
					if (markCount === winCount) {
						return true;
					}
				} else {
					markCount = 0;
				}
			}
			return false;
		},

		getGameStatus () {
			if (this.checkForWin(this.getNextHorizontalCellIndex) ||
			this.checkForWin(this.getNextVerticalCellIndex) ||
			this.checkForWin(this.getNextRightDiagonalCellIndex) || 
			this.checkForWin(this.getNextLeftDiagonalCellIndex)) {
				return 'win'
			} else if (this.room.moves === this.room.boardSize * this.room.boardSize - 1) {
				return 'draw'
			}
			return 'turn'
		},

		getNextHorizontalCellIndex(index) {
			if (index % this.room.boardSize === 0) {
				return null;
			} else {
				return index + 1;
			}
		},

		getNextVerticalCellIndex(index) {
			const nextIndex = index + this.room.boardSize;
			return nextIndex > this.room.cells.length - 1 ? null : nextIndex;
		},

		getNextRightDiagonalCellIndex(index) {
			const nextIndex = index + this.room.boardSize;
			if ((nextIndex > this.room.cells.length - 1) || (nextIndex % this.room.boardSize === 0)) {
				return null;
			} else {
				return nextIndex + 1;
			}
		},

		getNextLeftDiagonalCellIndex(index) {
			const nextIndex = index + this.room.boardSize;
			if ((nextIndex > this.room.cells.length - 1) || (nextIndex - 1 % this.room.boardSize === 0)) {
				return null;
			} else {
				return nextIndex - 1;
			}
		}
  },
  created () {
  	Event.$on('strike', (cellNumber) => {
			const gameStatus = this.getGameStatus();
    	this.$store.commit(SET_CELL_VALUE, {
				cellNumber,
				value: this.room.activePlayer
			});

			Event.$emit('updateRoom', { 
				moves: this.room.moves + 1,
				activePlayer: this.nonActivePlayer,
				cells: this.room.cells,
				gameStatus: gameStatus,
				winner: gameStatus === 'win' ? this.room.activePlayer : '',
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

.gameStatus::after {
  content: attr(data-end) ;
  color: white;
	font-size: 1.4em;
  font-weight: bold;
  font-family: 'Gochi Hand', sans-serif;
	
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
