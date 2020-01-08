import Vue from '../components/interpreter.vue'
import { getSelectionRange } from '../scripts/helpers'

interface Library {
	[name: string]: Function
}

interface GridElement {
	id: string
	fill: string
	width: number
	height: number
	x: number
	y: number
}

type Coordinate = [number, number]

const library: Library = {
	print: (...args: string) => {
		console.log(args[1])
	},

	test: (name: string, a: any, b: any): boolean => {
		if (`${a}` !== `${b}`) {
			console.warn('failed ' + name, a, b)
		} else {
			console.log('passed ' + name, a)
		}
		return a === b
	},

	// Math

	add: (...args: number[]): number => {
		return args.reduce((sum, val) => sum + val)
	},
	sub: (...args: number[]): number => {
		return args.reduce((sum, val) => sum - val)
	},
	mul: (...args: number[]): number => {
		return args.reduce((sum, val) => sum * val)
	},
	div: (...args: number[]): number => {
		return args.reduce((sum, val) => sum / val)
	},

	// Spreadsheet Flow

	map: (vue, arr: [], fn: () => {}) => {
		return arr.map(fn)
	},

	each: (vue, arr: any[], fn: (...args: any[]) => {}) => {
		for (let i = 0; i < arr.length; i++) {
			const arg: [] = Array.isArray(arr[i]) ? arr[i] : [arr[i]]
			fn(vue, ...arg)
		}
	},

	select: (...args: any[]): object[] => {
		const [vue, selection] = args

		let selectedCells

		if (selection.includes(':')) {
			selectedCells = getSelectionRange(...selection.split(':'))
		} else {
			selectedCells = [selection]
		}

		const elements = selectedCells.map(val =>
			document.getElementsByTagName('path').namedItem(val),
		)

		return selectedCells
	},

	// Grids

	grid: (...args: any[]) => {
		const [vue]: typeof Vue = args
		const columns = args.slice(1)

		const sum = columns.reduce((sum, val) => sum + val)
		const areas = columns.map(val => val / sum)
		const cumsum = areas.reduce(
			(sum: number[], val, index) => {
				sum[sum.length - 1] = sum[sum.length - 1] + val

				if (index !== areas.length - 1) {
					sum.push(0)
				}

				return sum
			},
			[0],
		)

		vue.columns = cumsum
	},

	// Drawing

	lineTo: (vue, pathElement, x: number, y: number) => {
		const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

		const cell = vue.cells[pathElement]
		const cellIndex = Object.values(vue.cells).findIndex(
			element => element.id === cell.id,
		)

		const columnIndex = alphabet.findIndex(
			element => element === cell.id[0],
		)

		const { length } = vue.columns
		const [reflectedColumn, reflectedRow] = [
			alphabet[cell.id.slice(1)],
			columnIndex,
		]
		const reflectedCellIndex = Object.values(vue.cells).findIndex(
			element => element.id === `${reflectedColumn}${reflectedRow}`,
		)

		if (cellIndex % 2 === 0) {
			const nextColumnLetter = String.fromCharCode(
				cell.id[0].charCodeAt(0) + 1,
			)
			const redCellId = `${nextColumnLetter}${cell.id.slice(1)}`

			const redCell = vue.cells[redCellId]

			const reflectedCellId = `${reflectedColumn}${reflectedRow + 1}`
			const reflectedCell = vue.cells[reflectedCellId]

			if (redCell && reflectedCell) {
				const item = [
					`L${redCell.origin.x - (1 - x) * redCell.width}`,
					redCell.origin.y + y * redCell.height,
				]
				redCell.transformations.a.push(item)

				const reflectedCellItem = [
					`L${reflectedCell.origin.x + y * reflectedCell.width}`,
					reflectedCell.origin.y + (x - 1) * reflectedCell.height,
				]

				reflectedCell.transformations.d.push(reflectedCellItem)
			}
		} else {
			const item = [
				`L${cell.origin.x + x * cell.width}`,
				cell.origin.y + y * cell.height,
			]

			cell.transformations.c.push(item)

			const reflectedCellId = `${reflectedColumn}${reflectedRow}`
			const reflectedCell = vue.cells[reflectedCellId]

			const reflectedCellItem = [
				`L${reflectedCell.origin.x + y * reflectedCell.width}`,
				reflectedCell.origin.y + x * reflectedCell.height,
			]

			reflectedCell.transformations.b.push(reflectedCellItem)

			const nextColumnLetter = String.fromCharCode(
				vue.cells[reflectedCellId].id[0].charCodeAt(0) + 1,
			)

			const whiteColumn = alphabet[reflectedCellIndex]
			const whiteCell = vue.cells[`${nextColumnLetter}${reflectedRow}`]

			if (whiteCell) {
				const whiteItem = [
					`L${whiteCell.origin.x + (x - 1) * cell.height}`,
					whiteCell.origin.y + y * cell.width,
				]
				whiteCell.transformations.a.push(whiteItem)
			}

			const reflectedWhiteCell =
				vue.cells[`${reflectedColumn}${reflectedRow + 1}`]

			if (reflectedWhiteCell) {
				const reflectedWhiteItem = [
					`L${reflectedWhiteCell.origin.x +
						y * reflectedWhiteCell.width}`,
					reflectedWhiteCell.origin.y +
						(x - 1) * reflectedCell.height,
				]
				reflectedWhiteCell.transformations.d.push(reflectedWhiteItem)
			}
		}
	},
}

export { library }
