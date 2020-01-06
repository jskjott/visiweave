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
	heartmap: {
		[targetCell: string]: string
	}
	key: number
}

export const state: State = {
	height: 500,
	width: 500,
	columns: [],
	cells: {},
	key: 0,
}
