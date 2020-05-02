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
				v-bind="{ height, width, columns, cells, colours }"
			></interface>
		</div>
		<div id="visualisations">
			<colourSelector @colours="updateColour"></colourSelector>
			<div id="unweavedForms">
				<unweavedForm
					:key="key + 1"
					@selection="select"
					v-bind="{ columns, cells, colours }"
				></unweavedForm>
			</div>
			<weavedForm
				:key="key + 2"
				@selection="select"
				v-bind="{ columns, cells, colours }"
			></weavedForm>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'

// components
import Interpreter from './components/interpreter.vue'
import Interface from './components/interface.vue'
import UnweavedForm from './components/unweavedForm.vue'
import WeavedForm from './components/weavedForm.vue'
import ColourSelector from './components/colourSelector.vue'

import { state } from './scripts/state'

const vue = Vue.extend({
	name: 'app',
	components: {
		Interpreter,
		Interface,
		UnweavedForm,
		WeavedForm,
		ColourSelector,
	},
	data() {
		return state
	},
	mounted() {
		if (window.location.hash) {
			this.urlHash = decodeURI(window.location.hash)
		} else {
			this.urlHash = ''
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
		select: function(data: string) {
			this.selection = data
		},
		updateColour: function(data: {}) {
			this.colours = data
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
	grid-template-columns: 2fr 3fr 2fr;
}

#unweavedForms {
	display: grid;
	grid-template-columns: 1fr 1fr;
}
</style>
