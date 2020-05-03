<template>
	<div id="weavedForm">
		<svg
			:height="height"
			:width="width"
			xmlns="http://www.w3.org/2000/svg"
			transform="rotate(45,0,0) scale(0.7,0.7)"
		>
			<g>
				<path
					v-for="(cell, index) in Object.values(cells)"
					:id="cell.id"
					:d="cell.points.join(' ').replace(',', ' ') + ' Z'"
					:fill="index % 2 === 0 ? colours.colourA : colours.colourB"
					:transform="
						`scale(${2.7 /
							(selectionEnd /
								0.04)}) translate(${-selectionOrigin.x},${-selectionOrigin.y})`
					"
				/>
			</g>
		</svg>
		<button>Export</button>
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
	margin-top: 100px;
}

span {
	display: inline-block;
}

button {
	padding: 2rem;
	border-radius: 1rem;
}

button:focus {
	outline: none;
}

svg {
	border: 1px solid grey;
	box-sizing: border-box;
}
</style>
