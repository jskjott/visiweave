<template>
	<div>
		<textarea id="interpreter" style="height: 525px; width: 525px">
(grid 1 2 1 2 1)</textarea
		>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'

// lisp interpreter
import { interpretLispString } from '../scripts/lisp'
import { library } from '../scripts/library'

const columns: number[] = []

const vue = Vue.extend({
	name: 'Interpreter',
	methods: library,
	props: [],
	data() {
		return {
			columns,
		}
	},
	watch: {},
	mounted() {
		interface KeysPressed {
			[key: string]: true
		}

		const keysPressed: KeysPressed = {}

		window.onkeydown = (event: KeyboardEvent): any => {
			if (event) {
				keysPressed[event.key] = true
			}

			if (keysPressed.Meta && keysPressed.Enter) {
				const [svg] = document.getElementsByTagName('svg')
				if (svg && svg.parentNode) {
					svg.parentNode.replaceChild(svg.cloneNode(false), svg)
				}

				const [interpreter] = document.getElementsByTagName('textarea')

				if (interpreter) {
					interpretLispString(interpreter.value, this)

					this.$emit('evaluated', this.columns)
				}
			}
		}

		window.onkeyup = (event: KeyboardEvent): any => {
			delete keysPressed[event.key]
		}
	},
})

export default vue
</script>

<style scoped="">
#interpreter {
	background: #a36566;
	color: floralwhite;
	padding: 1rem;
	font-size: 1.5em;
}
</style>
