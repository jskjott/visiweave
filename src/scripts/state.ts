type Coordinates = [number | string, number]

export interface Cell {
	id: string
	points: Coordinates[]
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
	columns: [1 / 7, 2 / 7, 1 / 7, 2 / 7, 1 / 7],
	heartmap: {},
	key: 0,
}
