<template>
	<td class="cell" :class="{'frozen' : frozen, 'last-played': room.lastPlayedCellIndex === index}" @click="strike">{{ mark }}</td>
</template>

<script>
	import { mapState } from 'vuex'

	export default {
		props: ['index', 'mark'],
		computed: {
			...mapState(['room']),

			frozen () {
  			return !!this.mark || this.room.hardFreeze || !this.$parent.isMyTurn || !this.room.playerO;
			},
		},
		methods: {
			strike () {
				if (!this.frozen) {
					Event.$emit('strike', this.index)
				}
			}
		},
	}
</script>

<style>

.cell:not(.frozen):hover {
	cursor: cell;
	background-color: #7f8c8d;
}

.cell.last-played {
	color: #e74c3c;
}

.cell::after {
  content: '';
  display: block;
}

.cell:first-of-type {
  border-left-color: transparent;
}

.cell:last-of-type {
  border-right-color: transparent;
}

tr:last-of-type .cell {
  border-bottom-color: transparent;
}
</style>