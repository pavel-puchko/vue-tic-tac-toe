<template>
	<div class="grid-wrapper" :class="{'gomoku' : isGomoku}">
		<div class="gameStatus" :class="gameStatusColor" :data-end="room.gameStatus === 'turn' && room.playerO ? room.activePlayer : ''">
			{{ gameStatusMessage }}
		</div>
		<table class="grid">
			<tr v-for="n in room.boardSize" :key="n + '_column'">
		    <cell v-for="k in room.boardSize" :key="getCellIndex(n, k) + '_cell'" :index="getCellIndex(n, k)" :mark="room.cells[getCellIndex(n, k)]"></cell>
			</tr>
			<img id="alina1" v-if="room.alinaWin" src="https://pp.userapi.com/c841429/v841429163/46af4/MBB-5-xZ9IE.jpg" />
			<img id="alina2" v-if="room.alinaWin" src="https://pp.userapi.com/c841030/v841030106/4dbb6/Cn1byOiHDJ4.jpg" />
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

		isImWinner() {
			return this.room.winner === this.userIdentity;
		},
		
		gameStatusColor() {
			if (!this.room.playerO) {
				return 'statusWait'
			}
			if (this.room.gameStatus === 'win') {
				return this.isImWinner ? 'statusWin' : 'statusLose'
  		} else if (this.room.gameStatus === 'draw') {
  		 	return 'statusDraw'
			} 
			
			return this.isMyTurn ? 'statusMyTurn' : 'statusOpponentTurn'
		},

		gameStatusMessage() {
			if (!this.room.playerO) {
				return 'Waiting for opponent'
			}
			if (this.room.alinaWin) {

			}
  		if (this.room.gameStatus === 'win') {
				if (this.room.alinaWin) {
  				return this.isImWinner ? 'Alipusik win :)': 'You lose :('
				}

  			return this.isImWinner ? 'You win !': 'You lose :('
			} 
			if (this.room.gameStatus === 'draw') {
  			return 'Draw !'
			}
			
			if (this.isMyTurn) {
				return `You turn: ` 
			} else if (this.room.vsBot) {
				return `AI turn: `
			} else {
				return `Opponent turn: `
			}
		}
  },
  methods: {
		getCellIndex(n, k) {
			return (n - 1) * this.room.boardSize +  k;
		},
	
		checkForWin (checkedFunction, aPlayer) {
			const cells = this.room.cells;
			const winCount = this.room.winCount;
			const activePlayer = aPlayer || this.room.activePlayer;
			const winMap = [];
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
							if (cells[nextIndex] === '') {
								winMap.push({
									count: markCount + 1,
									index: nextIndex,
								})
							}
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
			return winMap;
		},

		getGameStatus () {
			if (
				this.checkForWin(this.getNextRightHorizontalCellIndex) === true ||
				this.checkForWin(this.getNextBottomVerticalCellIndex) === true ||
				this.checkForWin(this.getNextRightDiagonalCellIndex) === true ||
				this.checkForWin(this.getNextLeftDiagonalCellIndex) === true
			) {
				return 'win'
			} else if (this.room.moves === this.room.boardSize * this.room.boardSize - 1) {
				return 'draw'
			}
			return 'turn'
		},

		getNextRightHorizontalCellIndex(index) {
			if (index % this.room.boardSize === 0) {
				return null;
			} else {
				return index + 1;
			}
		},

		getNextLeftHorizontalCellIndex(index) {
			if ((index - 1) % this.room.boardSize === 0) {
				return null;
			} else {
				return index - 1;
			}
		},

		getNextBottomVerticalCellIndex(index) {
			const nextIndex = index + this.room.boardSize;
			return nextIndex > this.room.cells.length - 1 ? null : nextIndex;
		},

		getNextTopVerticalCellIndex(index) {
			const nextIndex = index - this.room.boardSize;
			return nextIndex < 1 ? null : nextIndex;
		},

		getNextRightDiagonalCellIndex(index) {
			const nextIndex = index + this.room.boardSize;
			if ((nextIndex > this.room.cells.length - 1) || ((nextIndex - 1) % this.room.boardSize === 0)) {
				return null;
			} else {
				return nextIndex - 1;
			}
		},

		getNextRightToTopDiagonalCellIndex(index) {
			const nextIndex = index - this.room.boardSize;
			if ((nextIndex < 1) || (nextIndex  % this.room.boardSize === 0)) {
				return null;
			} else {
				return nextIndex + 1;
			}
		},

		getNextLeftDiagonalCellIndex(index) {
			const nextIndex = index + this.room.boardSize;
			if ((nextIndex > this.room.cells.length - 1) || (nextIndex % this.room.boardSize === 0)) {
				return null;
			} else {
				return nextIndex + 1;
			}
		}, 
		getNextLeftToTopDiagonalCellIndex(index) {
			const nextIndex = index - this.room.boardSize;
			if ((nextIndex < 1) || ((nextIndex - 1) % this.room.boardSize === 0)) {
				return null;
			} else {
				return nextIndex - 1;
			}
		}, 
		getAICellNumber(AIMark) {
			const playerMark = AIMark === 'O' ? 'X' : 'O';
			const playerWinMap = [
				...this.checkForWin(this.getNextRightHorizontalCellIndex, playerMark),
				...this.checkForWin(this.getNextLeftHorizontalCellIndex, playerMark),
				...this.checkForWin(this.getNextBottomVerticalCellIndex, playerMark),
				...this.checkForWin(this.getNextTopVerticalCellIndex, playerMark),
				...this.checkForWin(this.getNextRightDiagonalCellIndex, playerMark),
				...this.checkForWin(this.getNextRightToTopDiagonalCellIndex, playerMark),
				...this.checkForWin(this.getNextLeftToTopDiagonalCellIndex, playerMark),
				...this.checkForWin(this.getNextLeftDiagonalCellIndex, playerMark)]
					
			const sortedWinMap = playerWinMap.sort((a,b) => b.count - a.count);
			const biggerCount = sortedWinMap[0].count;
			const onlyMoreDangerousPlayerCells = sortedWinMap.filter(p => p.count === biggerCount);

			return onlyMoreDangerousPlayerCells[Math.floor(Math.random()*onlyMoreDangerousPlayerCells.length)].index;
		}
  },
  created () {
  	Event.$on('strike', (cellNumber) => {
    	this.$store.commit(SET_CELL_VALUE, {
				cellNumber,
				value: this.room.activePlayer
			});

			const gameStatus = this.getGameStatus();

			Event.$emit('updateRoom', { 
				moves: this.room.moves + 1,
				activePlayer: gameStatus === 'turn' ? this.nonActivePlayer : '',
				cells: this.room.cells,
				gameStatus: gameStatus,
				lastPlayedCellIndex: cellNumber,
				winner: gameStatus === 'win' ? this.userIdentity : '',
				hardFreeze: gameStatus !== 'turn'
			});
			if (this.room.vsBot && !this.isMyTurn && gameStatus === 'turn'){
				setTimeout(() => {
					Event.$emit('strike', this.getAICellNumber('O'))
				}, 500);
			}
  	})
  }
}
</script>

<style>
#alina1, #alina2 {
	border-radius: 20px;
	position: absolute;
	height: 185px;
	top: 125px;
	width: 115px;
	object-fit: cover;
	
}
#alina1 {
	left: 0;
}
#alina2 {
	left: 321px;
}
.grid-wrapper {
	display: flex;
	flex-direction: column;
	align-items: center;
}
.grid {
	position: relative;
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
.statusMyTurn {
	background-color:#238e88;
}
.statusOpponentTurn {
	background-color:#68707c;
}
.statusWin {
	background-color: #2ecc71;
}
.statusLose {
	background-color: #e74c3c;
}
.statusWait {
	background-color: #f1c40f;
}
.statusDraw {
	background-color: #9b59b6;
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
</style>
