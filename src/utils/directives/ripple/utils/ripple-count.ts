const RIPPLE_COUNT = 'vRippleCountInternal'

const setRippleCount = (el: HTMLElement, count: number) => {
	el.dataset[RIPPLE_COUNT] = count.toString()
}

export const getRippleCount = (el: HTMLElement): number => {
	return parseInt(el.dataset[RIPPLE_COUNT] ?? '0', 10)
}

export const incrementRippleCount = (el: HTMLElement): void => {
	const count = getRippleCount(el)
	setRippleCount(el, count + 1)
}

export const decrementRippleCount = (el: HTMLElement): void => {
	const count = getRippleCount(el)
	setRippleCount(el, count - 1)
}

export const deleteRippleCount = (el: HTMLElement): void => {
	delete el.dataset[RIPPLE_COUNT]
}