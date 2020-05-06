<template>
	<div id="app">
		<div id="formulaBar">
			<formulaBar
				@transformUpdate="transformUpdate"
				v-bind="{ selectTransforms, selection }"
			></formulaBar>
		</div>
		<div id="container">
			<div id="interpreterContainer">
				<div id="interpreter" v-show="showInterpreter">
					<interpreter
						@evaluated="evaluated"
						@transformUpdate="transformUpdate"
						v-bind="{
							height,
							width,
							urlHash,
							selectTransforms,
							renderCount,
							showInterpreter,
						}"
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
					<span v-show="showExportPane"> > </span>
					<span v-if="!showExportPane"> < </span>
				</div>
				<div v-if="showExportPane" id="exportPane">
					<!-- <colourSelector @colours="updateColour"></colourSelector> -->
					<div id="unweavedForms">
						<unweavedForm
							:key="key + 1"
							@selection="select"
							v-bind="{ columns, cells, selection, colours }"
						></unweavedForm>
					</div>
					<div
						id="arrow"
						style="text-align: center; font-size: 2em; padding-top: 1.25rem;"
					>
						⇣
					</div>
					<div id="weavedFormContainer">
						<weavedForm
							:key="key + 2"
							@selection="select"
							v-bind="{ columns, cells, selection, colours }"
						></weavedForm>
					</div>
					<button v-on:click="print()">Print</button>
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
		print: function() {
			window.print()
		},
		transformUpdate: function(data: {}) {
			this.renderCount++
			this.selectTransforms = data.selectTransforms
		},
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
				gridTemplateColumns = '400px 3fr 400px'
			} else if (this.showInterpreter) {
				gridTemplateColumns = '400px 25fr 1fr'
			} else if (this.showExportPane) {
				gridTemplateColumns = '1fr 25fr 400px'
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
	overflow: hidden;
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

#weavedFormContainer {
	position: absolute;
	top: 250px;
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

#exportPane {
	width: 400px;
}

#exportPaneContainer {
	display: flex;
}

.toggler {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	background: #f7f7f7;
	font-size: 2em;
	max-width: 50px;
}

button {
	margin: 0 auto;
	width: 150px;
	height: 50px;
	font-size: 1.5em;
	padding: 0.75rem;
	border-radius: 1rem;
	position: absolute;

	bottom: 15px;
	right: 115px;
}

button:focus {
	outline: none;
}

@media print {
	#interpreter {
		display: none;
	}

	#arrow {
		display: none;
	}

	#interface {
		display: none;
	}

	#weavedFormContainer {
		transform: scale(0.25);
		position: absolute;
		top: -200;
		left: 30;
	}

	#exportPane {
		transform: rotate(90deg) scale(3.5);
		position: absolute;
		width: auto;
		right: 300;
		bottom: 100;
	}

	rect {
		stroke: black;
		stroke-width: 1;
		fill: none;
	}

	path {
		stroke: black;
		stroke-width: 1;
		fill: none;
	}

	button {
		display: none;
	}

	.toggler {
		display: none;
	}

	#formulaBar {
		display: none;
	}
}
</style>
