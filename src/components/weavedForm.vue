<template>
	<div id="weavedForm">
		<div style="height: 100px;">
			<svg
:height="height / 2" :width="width" transform="rotate(180)">
				<path :d="`M0,0 a1,1 0 0,0 ${width},0`" fill="lavender" />
			</svg>
		</div>
		<div
			style="height: 200px; width: 300px; display: grid; grid-template-columns: 2fr 1fr;"
		>
			<svg
				:height="height"
				:width="width"
				transform="rotate(90)"
				xmlns="http://www.w3.org/2000/svg"
			>
				<g>
					<path
						v-for="(cell, index) in Object.values(cells)"
						:id="cell.id"
						:d="cell.points.join(' ').replace(',', ' ') + ' Z'"
						:fill="
							index % 2 === 0 ? colours.colourA : colours.colourB
						"
						:transform="
							`scale(${2.71 /
								(selectionEnd /
									0.04)}) translate(${-selectionOrigin.x},${-selectionOrigin.y})`
						"
					/>
				</g>
			</svg>
			<div style="height: 200px; width: 100px;">
				<svg
					:height="height / 2"
					:width="width"
					transform="scale(1,-1)  rotate(-90) translate(50,-52)"
				>
					<path :d="`M0,0 a1,1 0 0,0 ${width},0`" fill="crimson" />
				</svg>
			</div>
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
	name: 'WeavedForm',
	props: ['columns', 'cells', 'selection', 'colours'],
	data() {
		return {
			selectionOrigin,
			selectionEnd,
			width: 200,
			height: 200,
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
})

export default vue
</script>

<style scoped="">
#weavedForm {
	transform-origin: 150px 150px;
	transform: rotate(-45deg) scale(0.9);
	width: 300px;
	padding-top: 2.5rem;
}

span {
	display: inline-block;
}

svg {
	/*border: 1px solid grey;*/
	box-sizing: border-box;
	padding: 0;
	margin: 0;
}
</style>
