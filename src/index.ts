import { interpretLispString } from './lisp'

interface KeysPressed {
	[key: string]: true
}

const keysPressed: KeysPressed = {}

window.onkeydown = (event: KeyboardEvent): any => {
	if (event) {
		keysPressed[event.key] = true
	}

	if (keysPressed.Meta && keysPressed.Enter) {
		const interpreter: HTMLTextAreaElement = document.getElementsByTagName(
			'textarea',
		)[0]

		if (interpreter) {
			interpretLispString(interpreter.value)
		}
	}
}

window.onkeyup = (event: KeyboardEvent): any => {
	delete keysPressed[event.key]
}
