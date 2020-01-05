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
				/>
			</g>
		</svg>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

const vue = Vue.extend({
	name: 'Interface',
	props: ['width', 'height', 'columns'],
	data() {
		return {
			alphabet,
		}
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

					console.log(xAxis, yAxis)

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

			console.log(cells.length)
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
</style>
