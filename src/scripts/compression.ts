export const compress = (str: string) => {
	const dictionary = {},
		uncompressed = str,
		result = []

	let i,
		c,
		wc,
		w = '',
		ASCII = '',
		dictSize = 256
	for (i = 0; i < 256; i += 1) {
		dictionary[String.fromCharCode(i)] = i
	}

	for (i = 0; i < uncompressed.length; i += 1) {
		c = uncompressed.charAt(i)
		wc = w + c
		if (dictionary.hasOwnProperty(wc)) {
			w = wc
		} else {
			result.push(dictionary[w])
			ASCII += String.fromCharCode(dictionary[w])
			dictionary[wc] = dictSize++
			w = String(c)
		}
	}

	if (w !== '') {
		result.push(dictionary[w])
		ASCII += String.fromCharCode(dictionary[w])
	}
	return ASCII
}

export const decompress = (str: string) => {
	let i,
		tmp = [],
		dictionary = [],
		compressed = str,
		w,
		result,
		k,
		entry = '',
		dictSize = 256
	for (i = 0; i < 256; i += 1) {
		dictionary[i] = String.fromCharCode(i)
	}

	if (compressed && typeof compressed === 'string') {
		for (i = 0; i < compressed.length; i += 1) {
			tmp.push(compressed[i].charCodeAt(0))
		}
		compressed = tmp
		tmp = null
	}

	w = String.fromCharCode(compressed[0])
	result = w
	for (i = 1; i < compressed.length; i += 1) {
		k = compressed[i]
		if (dictionary[k]) {
			entry = dictionary[k]
		} else {
			if (k === dictSize) {
				entry = w + w.charAt(0)
			} else {
				return null
			}
		}

		result += entry

		dictionary[dictSize++] = w + entry.charAt(0)

		w = entry
	}
	return result
}
