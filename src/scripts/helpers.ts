export const getSelectionRange = (a, b) => {
	const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

	const columnRange = [a[0], b[0]].sort()
	const columnArray = []
	const startIndex = alphabet.findIndex(ele => ele === columnRange[0])
	for (let i = startIndex; alphabet[i - 1] !== columnRange[1]; ++i) {
		columnArray.push(alphabet[i])
	}

	const rowRange = [a.slice(1), b.slice(1)].sort()
	const rowArray = []
	for (let [i] = rowRange; i <= rowRange[1]; ++i) {
		rowArray.push(i)
	}

	const selectedCells = columnArray.flatMap(column => {
		return rowArray.map(row => {
			return `${column}${row}`
		})
	})

	return selectedCells
}
