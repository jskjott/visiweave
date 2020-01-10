<template>
	<div id="app">
		<div id="interpreter">
			<interpreter
				@evaluated="evaluated"
				v-bind="{ height, width, selection, urlHash }"
			></interpreter>
		</div>
		<div id="interface">
			<interface
				:key="key"
				@selection="select"
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
	mounted() {
		if (window.location.hash) {
			this.urlHash = decodeURI(window.location.hash)
		} else {
			this.urlHash = '(grid%201ąą)'
		}
	},
	methods: {
		evaluated: function(data: {}) {
			const { cells, columns, compressed } = data

			window.location.hash = compressed

			this.columns = columns
			this.cells = cells
			this.key++
		},
		select: function( data: string) {
			this.selection = data
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
