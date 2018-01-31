<template>
	<td class="cell" @click="strike">{{ mark }}</td>
</template>

<script>
	export default {
		props: ['name', 'mark'],
		data () {
			return {
			}	
		},

		computed: {
			frozen () {
  			return !!this.mark || this.$parent.hardFreeze || !this.$parent.isMyTurn || !this.$parent.playerO;
			}
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