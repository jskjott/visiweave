interface Library {
	[name: string]: Function
}

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
}

export { library }
