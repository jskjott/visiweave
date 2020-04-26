<template>
	<div id="weavedForm">
		<svg
			:height="height"
			:width="width"
			xmlns="http://www.w3.org/2000/svg"
			transform="rotate(45,0,0)"
		>
			<g>
				<path
					v-for="(cell, index) in Object.values(cells)"
					:id="cell.id"
					:d="cell.points.join(' ').replace(',', ' ') + ' Z'"
					:fill="index % 2 === 0 ? colours.colourA : colours.colourB"
					transform="scale(0.5,0.5)"
				/>
			</g>
		</svg>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'

import { getSelectionRange } from '../scripts/helpers'

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const selecting = false
const selection = ''

const vue = Vue.extend({
	name: 'Interface',
	props: ['columns', 'cells', 'colours'],
	data() {
		return {
			alphabet,
			selecting,
			selection,
			width: 200,
			height: 200,
		}
	},
	methods: {
		select: function(cellId: string) {
			this.selecting = true
			this.selection = cellId
		},
		updateSelection: function(cellId: string) {
			const previous = this.$el.querySelectorAll('.selected')

			if (previous) {
				for (const cell of previous) {
					cell.setAttribute('class', '')
				}
			}

			getSelectionRange(this.selection, cellId).forEach(cell => {
				const cellDOMElement = this.$el.querySelector(`#${cell}`)

				if (cellDOMElement) {
					cellDOMElement.setAttribute('class', 'selected')
				}
			})
		},
		endSelection: function(cellId: string) {
			const previous = this.$el.querySelectorAll('.selected')
			for (const cell of previous) {
				cell.setAttribute('class', '')
			}

			this.$emit('selection', `${this.selection}:${cellId}`)

			this.selecting = false
			this.selection = ''
		},
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
