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
			:key="cells.length"
			:height="height"
			:width="width"
			xmlns="http://www.w3.org/2000/svg"
		>
			<g>
				<path
					v-for="(cell, index) in cells"
					:id="cell.id"
					:d="cell.points.join(' ').replace(',', ' ')"
					:fill="index % 2 === 0 ? 'white' : 'red'"
					@mousedown="select(cell.id)"
					@mouseover="updateSelection(cell.id)"
					@mouseup="endSelection(cell.id)"
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
	props: ['width', 'height', 'columns'],
	data() {
		return {
			alphabet,
			selecting,
			selection,
		}
	},
	methods: {
		select: function(cellId) {
			this.selecting = true
			this.selection = cellId
		},
		updateSelection: function(cellId) {
			const previous = this.$el.querySelectorAll('.selected')
			for (const cell of previous) {
				cell.setAttribute('class', '')
			}

			getSelectionRange(this.selection, cellId).forEach(cell => {
				this.$el
					.querySelector(`#${cell}`)
					.setAttribute('class', 'selected')
			})
		},
		endSelection: function(cellId) {

			const previous = this.$el.querySelectorAll('.selected')
			for (const cell of previous) {
				cell.setAttribute('class', '')
			}
			this.selecting = false
			this.selection = ''
		},
	},
	computed: {
		cells: function() {
			const { columns } = this

			const cells: Cell[] = []

			let xCum = 0

			columns.forEach((xAxis: number, i: number) => {
				let yCum = 0
				columns.forEach((yAxis: number, cellIndex: number) => {
					const cellName = `${this.alphabet[i]}${cellIndex}`

					const xOri = this.width * xCum
					const yOri = this.height * yCum

					const cell = {
						id: cellName,
						points: [
							[`M${xOri}`, yOri],
							[`L${xOri}`, yOri + this.height * yAxis],
							[
								`L${xOri + this.width * xAxis}`,
								yOri + this.height * yAxis,
							],
							[`L${xOri + this.width * xAxis}`, yOri],
						],
					}

					cells.push(cell)

					yCum = yCum + yAxis
				})
				xCum = xCum + xAxis
			})

			return cells
		},
	},
})

export default vue
</script>

<style scoped="">
#interface {
	display: grid;
	grid-template-columns: 50px 500px;
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
}

.selected {
	fill: silver;
	stroke: grey;
	stroke-width: 5px;
}
</style>
