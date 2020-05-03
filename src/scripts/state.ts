type Coordinates = [number | string, number]

export interface Cell {
	id: string
	selected: boolean
	points: Coordinates[]
	origin: {
		x: number
		y: number
	}
	width: number
	height: number
	transformations: {
		a: []
		b: []
		c: []
		d: []
	}
}

export interface State {
	showInterpreter: boolean
	showExportPane: boolean
	height: number
	width: number
	columns: number[]
	cells: {}
	heartmap: {
		[targetCell: string]: string
	}
	key: number
	selection: string
	urlHash: string
	colours: {
		colourA: string
		colourB: string
	}
}

export const state: State = {
	showInterpreter: false,
	showExportPane: false,
	height: 1840,
	width: 1840,
	columns: [],
	cells: {},
	key: 0,
	selection: '',
	urlHash: '',
	colours: {
		colourA: 'lavender',
		colourB: 'crimson',
	},
}
