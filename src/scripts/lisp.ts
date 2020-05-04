// inspired by Mary Rose Cook's Little Lisp: https://maryrosecook.com/blog/post/little-lisp-interpreter

// parser
const split = (input: string): string[] => {
	let depth = 0

	const lst = [...input]

	const chunks = lst.reduce(
		(acc: string[], char: string): string[] => {
			if (char === '(') {
				depth = depth + 1
			} else if (char === ')') {
				depth = depth - 1
			}

			if (char === ')' && depth === 0) {
				acc[acc.length - 1] = acc[acc.length - 1] + char
				acc.push('')
				return acc
			} else {
				acc[acc.length - 1] = acc[acc.length - 1] + char
				return acc
			}
		},
		[''],
	)

	return chunks.slice(0, chunks.length - 1)
}

const tokenize = (input: string): string[] => {
	return input
		.replace(/\(/g, ' ( ')
		.replace(/\)/g, ' ) ')
		.trim()
		.split(/\s+/)
}

const categorize = (input: string): object => {
	if (!isNaN(parseFloat(input))) {
		return { type: 'literal', value: parseFloat(input) }
	} else if (input[0] === '"' && input.slice(-1) === '"') {
		return { type: 'literal', value: input.slice(1, -1) }
	} else {
		return { type: 'identifier', value: input }
	}
}

const parenthesize = (input: string[], list: any[] | undefined): any[] => {
	if (list === undefined) {
		return parenthesize(input, [])
	} else {
		const token = input.shift()
		if (token === undefined) {
			return list.pop()
		} else if (token === '(') {
			list.push(parenthesize(input, []))
			return parenthesize(input, list)
		} else if (token === ')') {
			return list
		} else {
			return parenthesize(input, list.concat(categorize(token)))
		}
	}
}

type LispList = [Input, ...Array<LispList | Input>]

const parse = (input: string): LispList[] => {
	const chunks = split(input)
	//@ts-ignore
	return chunks.map(chunk => parenthesize(tokenize(chunk), undefined))
}

// interpreter

interface Scope {
	[identifier: string]: Input
}
interface Input {
	type: string
	value: string
}

class Context {
	constructor(scope: {}, parent: Context | undefined) {
		this.scope = scope
		this.parent = parent
	}
	scope: Scope
	parent: Context | undefined
	get(identifier: string): Input {
		if (identifier in this.scope) {
			return this.scope[identifier]
		} else if (this.parent !== undefined) {
			return this.parent.get(identifier)
		} else {
			throw Error(`not identifier with provided value: ${identifier}`)
		}
	}
}

interface LambdaArguments {
	[identifier: string]: Input
}
interface Special {
	[name: string]: Function
}
type LambdaList = [Input, Input[], ...Array<LispList>]
type DefList = [Input, Input, ...Array<LispList>]
type DefnList = [Input, Input, Input[], ...Array<LispList>]

const special: Special = {
	lambda: function(input: LambdaList, context: Context, library: any) {
		return function() {
			const lambdaArguments = arguments
			const lambdaScope = input[1].reduce(
				(acc: LambdaArguments, x: Input, i: number) => {
					acc[x.value] = lambdaArguments[i]
					return acc
				},
				{},
			)

			return interpret(
				input[2],
				new Context(lambdaScope, context),
				library,
			)
		}
	},
	def: function(input: DefList, context: Context, library: any) {
		const identifier = input[1].value
		const [, value] = input
		context.scope[identifier] = interpret(value, context, library)
		return value
	},
	defn: function(input: DefList, context: Context, library: any) {
		const identifier = input[1].value

		const fnParams = input[2]
		const fnBody = input[3]

		context.scope[identifier] = function() {
			const lambdaArguments = arguments
			const lambdaScope = fnParams.reduce(
				(acc: LambdaArguments, x: Input, i: number) => {
					acc[x.value] = lambdaArguments[i + 1]
					return acc
				},
				{},
			)
			const returned = interpret(
				fnBody,
				new Context(lambdaScope, context),
				library,
			)
			return returned
		}
	},
}

const interpretList = (
	input: LispList,
	context: Context,
	library: any,
): any[] => {
	if (input.length > 0 && input[0].value in special) {
		return special[input[0].value](input, context, library)
	} else {
		const list = input.map(function(x) {
			return interpret(x, context, library)
		})
		if (list[0] instanceof Function) {
			return list[0].apply(undefined, [library, ...list.slice(1)])
		} else {
			return list
		}
	}
}

const interpret = (
	input: LispList | Input,
	context: Context | undefined,
	library: any,
): any => {
	if (context === undefined) {
		return interpret(input, new Context(library, undefined), library)
	} else if (input instanceof Array) {
		return interpretList(input, context, library)
	} else if (input.type === 'identifier') {
		return context.get(input.value)
	} else {
		return input.value
	}
}

export function interpretLispString(str: string, library: any): any {
	const parsed = parse(str)
	parsed.forEach(chunk => interpret(chunk, undefined, library))

	Object.values(library.cells).forEach(cell => {
		const { length } = Object.values(cell.transformations)
		Object.values(cell.transformations)
			.reverse()
			.forEach((axis, index) => {
				axis.forEach((transformation, tIndex) => {
					cell.points.splice(
						length - index + tIndex,
						0,
						transformation,
					)
				})
			})
	})
}
