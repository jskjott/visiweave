<template>
	<div>
		<textarea
			id="interpreter"
			style="height: 100%; width: 400px"
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
import { compress, decompress } from '../scripts/compression'

const columns: number[] = []
let interpreter: CodeMirror

const vue = Vue.extend({
	name: 'Interpreter',
	methods: library,
	props: ['width', 'height', 'selection', 'urlHash'],
	data() {
		return {
			columns,
			interpreter,
		}
	},
	watch: {
		selection: function(selection) {

			const selectionString = `

(map
	(select "${selection}") 
	(lambda (a) 
		()
	)
)`

			this.interpreter.replaceRange(selectionString, {line: Infinity})
		},
		urlHash: function(url) {
			console.log(url)
			const decompressed = decompress(url.substr(2))
			this.interpreter.setValue(decompressed)
		}
	},
	mounted() {
		const [textareaElement] = document.getElementsByTagName('textarea')

		this.interpreter = CodeMirror.fromTextArea(textareaElement, {
			lineNumbers: true,
			theme: 'elegant',
		})

		this.interpreter.on('change', (cm: CodeMirror) => {
			const text = cm.getValue()

			const compressed = `#0${compress(text)}`
			interpretLispString(text, this)

			this.$emit('evaluated', {
				compressed,
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
