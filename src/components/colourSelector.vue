<template>
	<div id="colourSelector">
		<svg width="10" height="10">
		  <rect width="10" height="10" :fill="colours.colourA" />
		</svg>
		<input v-model="colours.colourA" v-on:input="() => this.$emit('colours', colours)">

		<svg width="10" height="10">
		  <rect width="10" height="10" :fill="colours.colourB" />
		</svg>
		<input v-model="colours.colourB" v-on:input="() => this.$emit('colours', colours)">
	</div>
</template>

<script lang="ts">
import Vue from 'vue'

const colourA = 'white'
const colourB = 'red'

const vue = Vue.extend({
	name: 'colourSelector',
	data() {
		return {
			colours: {
				colourA,
				colourB,
			},
			width: 200,
			height: 200,
		}
	},
	watch: {
		colours: function(colours) {
			console.log(colours)
			this.$emit('colours', colours)
	},
})

export default vue
</script>

<style scoped="">
#weavedForm {
	margin-top: 100px;
}

span {
	display: inline-block;
}

#columnSider {
	display: flex;
	flex-direction: row;
}

.tick {
	display: flex;
	justify-content: center;
	align-items: center;
	border: 1px solid grey;
	box-sizing: border-box;
	background: #f7f7f7;
}

.selected {
	fill: silver;
	stroke: grey;
	stroke-width: 5px;
}

.additionButton {
	width: 25px;
	height: 25px;
	margin: 12.5px;
	background: white;
}

svg {
	border: 1px solid grey;
	box-sizing: border-box;
}
</style>
