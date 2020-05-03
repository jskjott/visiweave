<template>
	<div id="app">
		<div>
			<formulaBar></formulaBar>
		</div>
		<div id="container">
			<div id="interpreterContainer">
				<div id="interpreter" v-if="showInterpreter">
					<interpreter
						@evaluated="evaluated"
						v-bind="{ height, width, urlHash }"
					></interpreter>
				</div>
				<div class="toggler" v-on:click="toggle('showInterpreter')">
					<span v-if="showInterpreter"> < </span>
					<span v-else> > </span>
				</div>
			</div>
			<div id="interface">
				<interface
					:key="key"
					@selection="select"
					v-bind="{ height, width, columns, cells, colours }"
				></interface>
			</div>
			<div id="exportPaneContainer">
				<div class="toggler" v-on:click="toggle('showExportPane')">
					<span v-if="showExportPane"> > </span>
					<span v-else> < </span>
				</div>
				<div v-if="showExportPane" id="exportPane">
					<colourSelector @colours="updateColour"></colourSelector>
					<div id="unweavedForms">
						<unweavedForm
							:key="key + 1"
							@selection="select"
							v-bind="{ columns, cells, selection, colours }"
						></unweavedForm>
					</div>
					<weavedForm
						:key="key + 2"
						@selection="select"
						v-bind="{ columns, cells, selection, colours }"
					></weavedForm>
				</div>
			</div>
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
import FormulaBar from './components/formulaBar.vue'

import { state } from './scripts/state'

const vue = Vue.extend({
	name: 'app',
	components: {
		FormulaBar,
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
		toggle: function(element: string) {
			this[element] = !this[element]

			let gridTemplateColumns

			if (this.showInterpreter && this.showExportPane) {
				gridTemplateColumns = '2fr 3fr 2fr'
			} else if (this.showInterpreter) {
				gridTemplateColumns = '10fr 25fr 1fr'
			} else if (this.showExportPane) {
				gridTemplateColumns = '1fr 25fr 10fr'
			} else {
				gridTemplateColumns = '1fr 30fr 1fr'
			}
			document.getElementById(
				'container',
			).style.gridTemplateColumns = gridTemplateColumns
		},
	},
})

export default vue
</script>

<style>
body {
	padding: 0;
	margin: 0;
}

#app {
	width: 100%;
	height: 100%;
}

#commanLine {
	height: 100px;
}

#container {
	width: 100%;
	height: calc(100% - 50px);
	display: grid;
	grid-template-columns: 1fr 30fr 1fr;
}

#unweavedForms {
	display: grid;
	grid-template-columns: 1fr 1fr;
}

#interpreterContainer {
	display: flex;
}

#interpreter {
	width: 100%;
}

#interface {
	height: 100%;
	overflow: hidden;
}

#exportPaneContainer {
	display: flex;
}

.toggler {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 40px;
	background: #f7f7f7;
}
</style>
