import Vue from '../components/interpreter.vue'

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
	print: (x: string) => {
		console.log(x)
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

	map: (arr: [], fn: () => {}) => {
		return arr.map(fn)
	},

	each: (arr: any[], fn: (...args: any[]) => {}) => {
		for (let i = 0; i < arr.length; i++) {
			const arg: [] = Array.isArray(arr[i]) ? arr[i] : [arr[i]]
			fn(...arg)
		}
	},

	select: (input: []): object[] => {
		const elements = input.map(val =>
			document.getElementsByTagName('polygon').namedItem(val),
		)

		const pointCoordinates: object[] = elements.map(element => {
			let curElement = {}

			if (element && element.dataset.width && element.dataset.height) {
				curElement = {
					id: element.id,
					fill: element.style.fill,
					width: parseInt(element.dataset.width),
					height: parseInt(element.dataset.height),
					x: element.points[0].x,
					y: element.points[0].y,
				}
			}

			return curElement
		})
		return pointCoordinates
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

	// lineTo: (lst: GridElement[], x: number, y: number) => {
	// 	const element = lst[0]

	// 	const toDelete = document.getElementById(element.id)
	// 	toDelete.setAttribute('points', '100 100 300 100 300 300')
	// 	const [svg] = document.getElementsByTagName('svg')

	// 	if (toDelete) {
	// 		toDelete.innerHTML = ''
	// 	}

	// 	const polygon = document.createElementNS(
	// 		'http://www.w3.org/2000/svg',
	// 		'polygon',
	// 	)
	// 	polygon.id = element.id
	// 	polygon.style.fill = 'yellow'
	// 	svg.appendChild(polygon)

	// 	const polygonPoints = [
	// 		[element.y, element.x],
	// 		[element.y, element.x + element.width],
	// 		[element.y + element.height, element.x + element.width],
	// 		[
	// 			element.y + element.height + x * element.height,
	// 			element.x + element.width + y * element.width,
	// 		],
	// 		[element.y + element.height, element.x],
	// 	]

	// 	polygonPoints.forEach(value => {
	// 		const point = svg.createSVGPoint()
	// 		const [x, y] = value
	// 		point.x = x
	// 		point.y = y
	// 		polygon.points.appendItem(point)
	// 	})
	// },

	// curve: (cx: number, cy: number, x: number, y: number) => {},
}

export { library }
