<template>
	<div style="height: 100%">
		<textarea id="interpreter" style="height: 100%; width: 300px">
()</textarea
		>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'

import CodeMirror from 'codemirror/lib/codemirror.js'
import 'codemirror/mode/commonlisp/commonlisp.js'
import '../../node_modules/codemirror/lib/codemirror.css'
import './codeMirror.css'
import 'codemirror/theme/elegant.css'

// lisp interpreter
import { interpretLispString } from '../scripts/lisp'
import { library } from '../scripts/library'
import { compress, decompress } from '../scripts/compression'

const columns: number[] = [
	0.04,
	0.04,
	0.04,
	0.04,
	0.04,
	0.04,
	0.04,
	0.04,
	0.04,
	0.04,
	0.04,
	0.04,
	0.04,
	0.04,
	0.04,
	0.04,
	0.04,
	0.04,
	0.04,
	0.04,
	0.04,
	0.04,
	0.04,
	0.04,
	0.04,
]
let interpreter: CodeMirror
let text

const vue = Vue.extend({
	name: 'Interpreter',
	methods: library,
	props: [
		'width',
		'height',
		'selection',
		'urlHash',
		'selectTransforms',
		'renderCount',
		'showInterpreter',
	],
	data() {
		return {
			text,
			columns,
			interpreter,
		}
	},
	watch: {
		showInterpreter: function() {
			this.interpreter.setCursor(this.interpreter.lineCount(), 0)
		},
		renderCount: function() {
			const stateData = {
				text: this.text,
				selectTransforms: this.selectTransforms,
			}

			const compressed = `#0${compress(JSON.stringify(stateData))}`

			const cellTransformations = Object.values(
				this.selectTransforms,
			).reduce((acc, cur) => {
				return acc + cur
			}, '')

			Object.values(this.cells).forEach((cell, index) => {
				if (index === 0) {
					console.log(cell.points.length)
				}
				console.log()
				cell.transformations = {
					a: [],
					b: [],
					c: [],
					d: [],
				}
				cell.points = [
					[`M${cell.origin.x}`, cell.origin.y],
					[
						`L${cell.origin.x}`,
						cell.origin.y + this.height * cell.coordinate.y,
					],
					[
						`L${cell.origin.x + this.width * cell.coordinate.x}`,
						cell.origin.y + this.height * cell.coordinate.y,
					],
					[
						`L${cell.origin.x + this.width * cell.coordinate.x}`,
						cell.origin.y,
					],
				]
			})

			interpretLispString(text + ' ' + cellTransformations, this)

			this.$emit('evaluated', {
				compressed,
				columns: this.columns,
				cells: this.cells,
			})
		},
		selection: function(selection) {
			const selectionString = `

(each
	(select "${selection}") 
	(lambda (a) 
		()
	)
)`

			this.interpreter.replaceRange(selectionString, { line: Infinity })
		},
		urlHash: function(url) {
			const decompressed = decompress(url.substr(2))

			const { text, selectTransforms } = JSON.parse(decompressed)

			this.interpreter.setValue(text)

			this.$emit('transformUpdate', {
				selectTransforms,
			})

			Vue.nextTick(() => {
				this.interpreter.refresh()
			})
		},
	},
	mounted() {
		const [textareaElement] = document.getElementsByTagName('textarea')

		this.interpreter = CodeMirror.fromTextArea(textareaElement, {
			lineNumbers: true,
			theme: 'elegant',
		})

		this.interpreter.on('change', (cm: CodeMirror) => {
			const text = cm.getValue()
			this.text = text

			const stateData = {
				text,
				selectTransforms: this.selectTransforms,
			}

			const compressed = `#0${compress(JSON.stringify(stateData))}`

			const cellTransformations = Object.values(
				this.selectTransforms,
			).reduce((acc, cur) => {
				return acc + cur
			}, '')

			Object.values(this.cells).forEach((cell, index) => {
				if (index === 0) {
					console.log(cell.points.length)
				}
				console.log()
				cell.transformations = {
					a: [],
					b: [],
					c: [],
					d: [],
				}
				cell.points = [
					[`M${cell.origin.x}`, cell.origin.y],
					[
						`L${cell.origin.x}`,
						cell.origin.y + this.height * cell.coordinate.y,
					],
					[
						`L${cell.origin.x + this.width * cell.coordinate.x}`,
						cell.origin.y + this.height * cell.coordinate.y,
					],
					[
						`L${cell.origin.x + this.width * cell.coordinate.x}`,
						cell.origin.y,
					],
				]
			})

			interpretLispString(text + ' ' + cellTransformations, this)

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

		window.onkeyup = (event: KeyboardEvent): any => {
			delete keysPressed[event.key]
		}

		this.interpreter.refresh()

		if (!window.location.hash) {
			window.location.hash = '#0{"text":"()","selectTransformsĆ{}}'
		}
	},
	computed: {
		cells: function() {
			this.recompute

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
						selected: false,
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
						coordinate: {
							x: xAxis,
							y: yAxis,
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
