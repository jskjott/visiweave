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
		<div class="additionButton tick">
			<!-- + -->
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
		<svg :height="height" :width="width"
xmlns="http://www.w3.org/2000/svg">
			<g>
				<path
					v-for="(cell, index) in Object.values(cells)"
					:id="cell.id"
					:d="cell.points.join(' ').replace(',', ' ') + ' Z'"
					:fill="index % 2 === 0 ? 'white' : 'red'"
					@mousedown="select(cell.id)"
					@mouseover="updateSelection(cell.id)"
					@mouseup="endSelection(cell.id)"
				/>
			</g>
		</svg>
		<div></div>
		<div class="additionButton tick">
			<!-- + -->
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'

import { Cell } from '../scripts/state'
import { getSelectionRange } from '../scripts/helpers'

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const selecting = false
const selection = ''

const vue = Vue.extend({
	name: 'Interface',
	props: ['width', 'height', 'columns', 'cells'],
	data() {
		return {
			alphabet,
			selecting,
			selection,
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
#interface {
	display: grid;
	grid-template-columns: 50px 500px 50px;
	grid-template-rows: 50px 500px;
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
