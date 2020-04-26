type Coordinates = [number | string, number]

export interface Cell {
	id: string
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
	height: 400,
	width: 400,
	columns: [],
	cells: {},
	key: 0,
	selection: '',
	urlHash: '',
	colours: {
		colourA: 'white',
		colourB: 'red',
	},
}
