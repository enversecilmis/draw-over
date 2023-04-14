class CanvasPen {
	color: string
	size: number
	drawed: boolean
	erasing: boolean
	coords: { x: number, y: number, px: number, py: number }
	onColorChangeCallbacks: (() => void)[]
	onSizeChangeCallbacks: (() => void)[]
	onErasingStateChangeCallbacks: (() => void)[]

	constructor(hexColor = "#000000", size = 5) {
		this.size = size
		this.color = hexColor
		this.coords = { x: 0, y: 0, px: 0, py: 0 }
		this.erasing = false
		this.drawed = false
		this.onColorChangeCallbacks = []
		this.onSizeChangeCallbacks = []
		this.onErasingStateChangeCallbacks = []
	}


	setColor(newHexColor: string) {
		if (this.color === newHexColor)
			return

		this.color = newHexColor
		this.onColorChangeCallbacks.forEach(callback => callback())
	}

	setSize(newSize: number) {
		if (this.size === newSize)
			return

		this.size = newSize
		this.onSizeChangeCallbacks.forEach(callback => callback())
	}

	startErasing() {
		if (this.erasing === true)
			return

		this.erasing = true
		this.onErasingStateChangeCallbacks.forEach(callback => callback())
	}

	stopErasing() {
		if (this.erasing === false)
			return

		this.erasing = false
		this.onErasingStateChangeCallbacks.forEach(callback => callback())
	}


	onColorChange(callback: () => void) {
		this.onColorChangeCallbacks.push(callback)
	}

	onSizeChange(callback: () => void) {
		this.onSizeChangeCallbacks.push(callback)
	}

	onErasingStateChange(callback: () => void) {
		this.onErasingStateChangeCallbacks.push(callback)
	}
}


export default CanvasPen