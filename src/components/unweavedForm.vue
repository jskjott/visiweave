<template>
	<div id="unweavedForms">
		<div class="unweavedForm">
			<svg
				:height="height / 2"
				:width="width"
				transform="rotate(180) translate(0,-1)"
			>
				<path :d="`M0,0 a1,1 0 0,0 ${width},0`" fill="lavender" />
			</svg>
			<svg
				class="weave"
				:height="height"
				:width="width"
				xmlns="http://www.w3.org/2000/svg"
				:transform="`rotate(90,0,0)  scale(1,-1)`"
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
						stroke-width="2"
						fill="none"
						:transform="
							`scale(${1.8 /
								(selectionEnd /
									0.04)}) translate(${-selectionOrigin.x},${-selectionOrigin.y})`
						"
					/>
				</g>
			</svg>
		</div>

		<div class="unweavedForm">
			<svg
				:height="height / 2"
				:width="width"
				transform="rotate(180) translate(0,-1)"
			>
				<path :d="`M0,0 a1,1 0 0,0 ${width},0`" fill="crimson" />
			</svg>
			<svg
				class="weave"
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
						stroke-width="2"
						fill="none"
						:transform="
							`scale(${1.8 /
								(selectionEnd /
									0.04)}) translate(${-selectionOrigin.x},${-selectionOrigin.y})`
						"
					/>
				</g>
			</svg>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'

const selectionOrigin = {
	x: 0,
	y: 0,
}
const selectionEnd = 1

const vue = Vue.extend({
	name: 'UnweavedForm',
	props: ['columns', 'cells', 'selection', 'colours'],
	data() {
		return {
			selectionOrigin,
			selectionEnd,
			width: 133.5,
			height: 133.5,
		}
	},
	watch: {
		selection: function(selection) {
			const [begin, end] = selection
			const init = parseInt(begin.id.slice(1))
			const limit = parseInt(end.id.slice(1))
			const upper = this.columns.reduce((acc, cur, idx) => {
				return idx <= limit && idx >= init ? acc + cur : acc
			}, 0)
			this.selectionEnd = upper
			this.selectionOrigin = begin.origin
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
	/*grid-template-columns: 133.5px;
	grid-template-rows: 133.5px;*/
}

.unweavedForm {
	padding: 0.5rem;
	padding-left: 1.5rem;
}

span {
	display: inline-block;
}

.weave {
	/*border-right: 1px solid grey;
	border-bottom: 1px solid grey;
	border-top: 1px solid grey;*/
	box-sizing: border-box;
}
</style>
