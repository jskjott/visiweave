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

	each: (vue, arr: [], fn: () => {}) => {
		return arr.map(fn)
	},

	// each: (vue, arr: any[], fn: (...args: any[]) => {}) => {
	// 	for (let i = 0; i < arr.length; i++) {
	// 		const arg: [] = Array.isArray(arr[i]) ? arr[i] : [arr[i]]
	// 		fn(vue, ...arg)
	// 	}
	// },

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

	range: (vue, start: number, end: number, step = 1) => {
		const arr = []
		if (step > 0) {
			for (let i = start; i <= end; i += step) {
				arr.push(i)
			}
		} else {
			for (let i = start; i >= end; i += step) {
				arr.push(i)
			}
		}
		return arr
	},

	// Grids

	sheet: (...args: any[]) => {
		const [vue]: typeof Vue = args
		const rest = args.slice(1)

		let columns

		if (Array.isArray(rest)) {
			;[columns] = rest
		} else {
			columns = rest
		}

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

		//vue.columns = cumsum
	},

	// Drawing

	sidepath: (vue, cellId, side, pathData) => {
		let cell

		if (Array.isArray(cellId)) {
			cell = vue.cells[cellId[0]]
		} else {
			cell = vue.cells[cellId]
		}

		const sidePaths = {
			'#NW': [cell.origin.x, cell.origin.y],
			'#N': [cell.origin.x + cell.width * 0.5, cell.origin.y],
			'#NE': [cell.origin.x + cell.width, cell.origin.y],
			'#W': [cell.origin.x, cell.origin.y + cell.height * 0.5],
			'#O': [
				cell.origin.x + cell.width * 0.5,
				cell.origin.x + cell.height * 0.5,
			],
			'#E': [
				cell.origin.x + cell.width,
				cell.origin.y + cell.height * 0.5,
			],
			'#SE': [cell.origin.x + cell.width, cell.origin.y + cell.height],
			'#S': [
				cell.origin.x + cell.width * 0.5,
				cell.origin.y + cell.height,
			],
			'#SW': [cell.origin.x, cell.origin.y + cell.height],
		}
		const sides = {
			'#N': 'd',
			'#W': 'a',
			'#S': 'b',
			'#E': 'c',
		}
		const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

		const cellIndex = Object.values(vue.cells).findIndex(
			element => element.id === cell.id,
		)

		function pythagoras(a: number, b: number) {
			return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2))
		}

		const [origin, end, degree] = pathData

		const x1 = sidePaths[origin][0] - cell.origin.x
		const x2 = sidePaths[end][0] - cell.origin.x
		const y1 = sidePaths[origin][1] - cell.origin.y
		const y2 = sidePaths[end][1] - cell.origin.y

		const a = Math.abs(x2 - x1)
		const b = Math.abs(y2 - y1)
		const aNon = x2 - x1
		const bNon = y2 - y1

		const diagonal = pythagoras(a, b)

		const widthRelationship = a / diagonal
		const heigthRelationship = b / diagonal

		let additionX
		let additionY

		if (sidePaths[end][0] < sidePaths[origin][0]) {
			additionX =
				sidePaths[origin][0] - diagonal * degree * widthRelationship
		} else {
			additionX =
				sidePaths[origin][0] + diagonal * degree * widthRelationship
		}

		if (sidePaths[end][1] < sidePaths[origin][1]) {
			additionY =
				sidePaths[origin][1] - diagonal * degree * heigthRelationship
		} else {
			additionY =
				sidePaths[origin][1] + diagonal * degree * heigthRelationship
		}

		const item = [`L${additionX}`, additionY]

		cell.transformations[sides[side]].push(item)

		// get contacting cell

		const columnIndex = alphabet.findIndex(
			element => element === cell.id[0],
		)

		let adjacentCellId
		let adjacentCellSide

		const columnNumber = Math.sqrt(Object.values(vue.cells).length)

		if (sides[side] === 'a' && columnIndex > 0) {
			adjacentCellId = `${alphabet[columnIndex - 1]}${cellId.slice(1)}`
			adjacentCellSide = 'c'
		} else if (
			sides[side] === 'b' &&
			parseInt(cellId.slice(1)) + 1 < columnNumber
		) {
			adjacentCellId = `${alphabet[columnIndex]}${parseInt(
				cellId.slice(1),
			) + 1}`
			adjacentCellSide = 'd'
		} else if (sides[side] === 'c' && columnIndex + 1 < columnNumber) {
			adjacentCellId = `${alphabet[columnIndex + 1]}${cellId.slice(1)}`
			adjacentCellSide = 'a'
		} else if (sides[side] === 'd' && parseInt(cellId.slice(1)) > 0) {
			adjacentCellId = `${alphabet[columnIndex]}${parseInt(
				cellId.slice(1),
			) - 1}`
			adjacentCellSide = 'b'
		}

		if (adjacentCellId) {
			const adjacentCell = vue.cells[adjacentCellId]
			adjacentCell.transformations[adjacentCellSide].push(item)
		}
	},

	addpoint: (vue, pathElement, x: number, y: number) => {
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
