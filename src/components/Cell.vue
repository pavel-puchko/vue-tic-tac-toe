<template>
	<td class="cell" @click="strike">{{ mark }}</td>
</template>

<script>
	import { mapState } from 'vuex'

	export default {
		props: ['name', 'mark'],
		computed: {
			...mapState(['room']),

			frozen () {
  			return !!this.mark || this.room.hardFreeze || !this.$parent.isMyTurn || !this.room.playerO;
			},
		},
		methods: {
			strike () {
				if (!this.frozen) {
					Event.$emit('strike', this.name)
				}
			}
		},
	}
</script>

<style>

.cell:hover {
	background-color: #7f8c8d;
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