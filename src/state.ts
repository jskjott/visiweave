type Coordinates = [number | string, number]

interface Cell {
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
}

export const state: State = {
	height: 400,
	width: 400,
	columns: [0.25, 0.5, 0.75],
	heartmap: {},
}
