<template>
	<div id="unweavedForms">
		<div class="unweavedForm">
			<svg
				:height="height"
				:width="width"
				xmlns="http://www.w3.org/2000/svg"
				transform="rotate(90,0,0)  scale(1,-1)"
			>
				<rect
					:width="width"
					:height="height"
					:fill="colours['colourA']"
				/>
				<g>
					<path
						v-for="(cell, index) in Object.values(
							unweavedColumns.rows,
						)"
						:id="cell.id"
						:d="cell.join(' ').replace(',', ' ')"
						stroke="black"
						fill="none"
						transform="scale(0.3333,0.3333)"
					/>
				</g>
			</svg>
		</div>

		<div class="unweavedForm">
			<svg
				:height="height"
				:width="width"
				xmlns="http://www.w3.org/2000/svg"
			>
				<rect
					:width="width"
					:height="height"
					:fill="colours['colourB']"
				/>
				<g>
					<path
						v-for="(cell, index) in Object.values(
							unweavedColumns.columns,
						)"
						:id="cell.id"
						:d="cell.join(' ').replace(',', ' ')"
						stroke="black"
						fill="none"
						transform="scale(0.3333,0.3333)"
					/>
				</g>
			</svg>
		</div>
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
			width: 133.5,
			height: 133.5,
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
	computed: {
		unweavedColumns: function() {
			const data = {
				rows: [],
				columns: [],
			}

			Object.values(this.cells).forEach((cell, index) => {
				let side = 0
				const { width } = cell
				const { height } = cell
				const { origin } = cell

				const columnNumber = Math.floor(index / this.columns.length)
				const rowNumber = index % this.columns.length

				const sideWest = JSON.stringify([origin.x, origin.y])
				const sideSouth = JSON.stringify([origin.x, origin.y + height])
				const sideEast = JSON.stringify([
					origin.x + width,
					origin.y + height,
				])
				const sideNorth = JSON.stringify([origin.x + width, origin.y])


				cell.points.forEach(point => {
					const x = parseFloat(point[0].slice(1))
					const [, y] = point
					let switchedThisTurn = false

					switch (JSON.stringify([x, y])) {
						case sideWest:
							side = 0
							switchedThisTurn = true
							break
						case sideSouth:
							side = 1
							switchedThisTurn = true
							break
						case sideEast:
							side = 2
							switchedThisTurn = true
							break
						case sideNorth:
							side = 3
							switchedThisTurn = true
							break
						default:
							break
					}

					if (side === 0) {

						if (data.columns.length - 1 < columnNumber) {
							data.columns.push([])
						}
						if (data.rows.length - 1 < rowNumber) {
							data.rows.push([])
						}
						data.columns[columnNumber].push(point)
					}
					if (side === 1) {
						if (data.rows.length - 1 < rowNumber) {
							data.rows.push([])
						}
						data.rows[rowNumber].push(point)
						if (switchedThisTurn) {
							data.columns[columnNumber].push(point)
						}
					}
					if (side === 2) {
						if (data.rows.length <= rowNumber) {
							data.rows.push([])
						}
						if (switchedThisTurn) {
							data.rows[rowNumber].push(point)
						}
					}
				})
			})

			data.columns = data.columns.map(column => {
				return column.map((point, index) => {
					if (index === 0) {
						return [`M${point[0].slice(1)}`, point[1]]
					} else {
						return [`L${point[0].slice(1)}`, point[1]]
					}
				})
			})

			data.rows = data.rows.map(row => {
				return row.map((point, index) => {
					if (index === 0) {
						return [`M${point[0].slice(1)}`, point[1]]
					} else {
						return [`L${point[0].slice(1)}`, point[1]]
					}
				})
			})


			return data
		},
	},
})

export default vue
</script>

<style scoped="">
#unweavedForms {
	display: grid;
	grid-template-columns: 1fr 1fr;
	/*grid-template-columns: 133.5px;
	grid-template-rows: 133.5px;*/
}

.unweavedForm {
	padding: 0.5rem;
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
