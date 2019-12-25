// inspired by Mary Rose Cook's Little Lisp: https://maryrosecook.com/blog/post/little-lisp-interpreter

import { library } from './library'

// parser

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

const parse = (input: string): LispList => {
	//@ts-ignore
	return parenthesize(tokenize(input), undefined)
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
			throw 'not identifier with provided value'
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

const special: Special = {
	lambda: function(input: LambdaList, context: Context) {
		return function() {
			const lambdaArguments = arguments
			const lambdaScope = input[1].reduce(
				(acc: LambdaArguments, x: Input, i: number) => {
					acc[x.value] = lambdaArguments[i]
					return acc
				},
				{},
			)

			return interpret(input[2], new Context(lambdaScope, context))
		}
	},
}

const interpretList = (input: LispList, context: Context): any[] => {
	if (input.length > 0 && input[0].value in special) {
		return special[input[0].value](input, context)
	} else {
		const list = input.map(function(x) {
			return interpret(x, context)
		})
		if (list[0] instanceof Function) {
			return list[0].apply(undefined, list.slice(1))
		} else {
			return list
		}
	}
}

const interpret = (
	input: LispList | Input,
	context: Context | undefined,
): any => {
	if (context === undefined) {
		return interpret(input, new Context(library, undefined))
	} else if (input instanceof Array) {
		return interpretList(input, context)
	} else if (input.type === 'identifier') {
		return context.get(input.value)
	} else {
		return input.value
	}
}

export function interpretLispString(str: string): any {
	console.log(str)
	const parsed = parse(str)
	interpret(parsed, undefined)
}
