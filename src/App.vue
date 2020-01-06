<template>
	<div id="app">
		<div id="interpreter">
			<interpreter
				@evaluated="evaluated"
				v-bind="{ height, width }"
			></interpreter>
		</div>
		<div id="interface">
			<interface
				:key="key"
				v-bind="{ height, width, columns, cells }"
			></interface>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'

// components
import Interpreter from './components/interpreter.vue'
import Interface from './components/interface.vue'

import { state } from './scripts/state'

const vue = Vue.extend({
	name: 'app',
	components: {
		Interpreter,
		Interface,
	},
	data() {
		return state
	},
	methods: {
		evaluated: function(data: {}) {
			const { cells, columns } = data

			this.columns = columns
			this.cells = cells
			this.key++
		},
	},
})

export default vue
</script>

<style>
#app {
	width: 100%;
	height: 100%;
	display: grid;
	grid-template-columns: 1fr 2fr;
}
</style>