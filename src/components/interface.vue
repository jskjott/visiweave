<template>
	<div id="interface">
		<div></div>
		<div id="columnSider">
			<span
				class="tick"
				v-for="(columnWidth, index) in columns"
				:style="{ width: `${columnWidth * width}px` }"
			>
				{{ alphabet[index] }}
			</span>
		</div>
		<div>
			<div
				class="tick"
				v-for="(rowHeight, index) in columns"
				:style="{ height: `${rowHeight * height}px` }"
			>
				{{ index }}
			</div>
		</div>
		<svg
:height="height" :width="width" xmlns="http://www.w3.org/2000/svg">
			<g>
				<path
					v-for="(cell, index) in Object.values(cells)"
					:id="cell.id"
					:d="cell.points.join(' ').replace(',', ' ') + ' Z'"
					:fill="assignColour(index, cell)"
					@mousedown="select(cell.id)"
					@mouseover="updateSelection(cell.id)"
					@mouseup="endSelection(cell.id)"
				/>
			</g>
		</svg>
		<div></div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'

import { getSelectionRange } from '../scripts/helpers'

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const selecting = false
const selection = ''
const mouseDown = false
const columns = [
	0.04,
	0.04,
	0.04,
	0.04,
	0.04,
	0.04,
	0.04,
	0.04,
	0.04,
	0.04,
	0.04,
	0.04,
	0.04,
	0.04,
	0.04,
	0.04,
	0.04,
	0.04,
	0.04,
	0.04,
	0.04,
	0.04,
	0.04,
	0.04,
	0.04,
]

const vue = Vue.extend({
	name: 'Interface',
	props: ['width', 'height', 'cells', 'colours'],
	data() {
		return {
			alphabet,
			selecting,
			selection,
			mouseDown,
			columns,
		}
	},
	methods: {
		assignColour: function(index, cell) {
			let colour

			if (cell.selected) {
				colour =
					index % 2 === 0
						? this.colours.colourA
						: this.colours.colourB
			} else {
				colour = index % 2 === 0 ? this.colours.colourA : 'white'
			}

			return colour
		},
		select: function(cellId: string) {
			const previous = this.$el.querySelectorAll('.selected')

			for (const cell of previous) {
				this.cells[cell.id].selected = false
				cell.setAttribute('class', '')
			}

			const cellDOMElement = this.$el.querySelector(`#${cellId}`)
			this.cells[cellId].selected = true

			if (cellDOMElement) {
				cellDOMElement.setAttribute('class', 'selected')
			}

			this.selection = ''

			this.mouseDown = true
			this.selecting = true
			this.selection = cellId
		},
		updateSelection: function(cellId: string) {
			const previous = this.$el.querySelectorAll('.selected')

			if (previous && this.mouseDown) {
				for (const cell of previous) {
					this.cells[cell.id].selected = false
					cell.setAttribute('class', '')
				}
			}

			if (this.mouseDown) {
				getSelectionRange(this.selection, cellId).forEach(cell => {
					const cellDOMElement = this.$el.querySelector(`#${cell}`)
					this.cells[cell].selected = true

					if (cellDOMElement) {
						cellDOMElement.setAttribute('class', 'selected')
					}
				})

				const range = getSelectionRange(this.selection, cellId)
				this.$emit('selection', [
					this.cells[range[0]],
					this.cells[range[range.length - 1]],
				])
			}
		},
		endSelection: function(cellId: string) {
			this.mouseDown = false
			const previous = this.$el.querySelectorAll('.selected')
			this.selection = `${this.selection}:${cellId}`
			const range = getSelectionRange(this.selection, cellId)

			this.$emit('selection', [
				this.cells[range[0]],
				this.cells[range[range.length - 1]],
			])
		},
	},
})

export default vue
</script>

<style scoped="">
#interface {
	display: grid;
	grid-template-columns: 50px 1fr;
	grid-template-rows: 50px 1fr;
	overflow: scroll;
	-ms-overflow-style: none;
	overflow: -moz-scrollbars-none;
}

#interface::-webkit-scrollbar {
	display: none;
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
	stroke: black;
	stroke-width: 1px;
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
