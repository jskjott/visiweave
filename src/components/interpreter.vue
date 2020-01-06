<template>
	<div>
		<textarea
			id="interpreter"
			style="height: 525px; width: 525px"
		></textarea>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'

import CodeMirror from 'codemirror/lib/codemirror.js'
import 'codemirror/mode/commonlisp/commonlisp.js'
import '../../node_modules/codemirror/lib/codemirror.css'
import 'codemirror/theme/elegant.css'

// lisp interpreter
import { interpretLispString } from '../scripts/lisp'
import { library } from '../scripts/library'

const columns: number[] = []
let interpreter: CodeMirror

const vue = Vue.extend({
	name: 'Interpreter',
	methods: library,
	props: ['width', 'height'],
	data() {
		return {
			columns,
			interpreter,
		}
	},
	watch: {},
	mounted() {
		const [textareaElement] = document.getElementsByTagName('textarea')

		this.interpreter = CodeMirror.fromTextArea(textareaElement, {
			lineNumbers: true,
			theme: 'elegant',
		})

		this.interpreter.on('change', (cm: CodeMirror) => {
			const text = cm.getValue()

			interpretLispString(text, this)

			this.$emit('evaluated', {
				columns: this.columns,
				cells: this.cells,
			})
		})

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

					this.$emit('evaluated', {
						columns: this.columns,
						cells: this.cells,
					})
				}
			}
		}

		window.onkeyup = (event: KeyboardEvent): any => {
			delete keysPressed[event.key]
		}

		const startHeart = `(grid 1 2 1 2 1)

(map 
	(select "A0:E4") 
 	(lambda (a) 
    	(lineTo a 0.75 0.5)
    )
)`

		this.interpreter.setValue(startHeart)
	},
	computed: {
		cells: function() {
			const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
			const { columns } = this

			const cells: {} = {}

			let xCum = 0

			columns.forEach((xAxis: number, i: number) => {
				let yCum = 0
				columns.forEach((yAxis: number, cellIndex: number) => {
					const cellName = `${alphabet[i]}${cellIndex}`

					const xOri = this.width * xCum
					const yOri = this.height * yCum

					const cell: Cell = {
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
						origin: {
							x: xOri,
							y: yOri,
						},
						width: xAxis * this.width,
						height: yAxis * this.height,
						transformations: {
							a: [],
							b: [],
							c: [],
							d: [],
						},
					}

					cells[cellName] = cell

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

<style scoped=""></style>
