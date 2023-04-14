type OnColorChangeCallback = (newHexColor: string) => void
type OnSizeChangeCallback = (newSize: number) => void
type OnErasingStateChangeCallback = (newErasingState: boolean) => void


class CanvasPen {
	private context: CanvasRenderingContext2D
	private _color
	private _size
	private _erasing = false

	private onColorChangeCallbacks: OnColorChangeCallback[]
	private onSizeChangeCallbacks: OnSizeChangeCallback[]
	private onErasingStateChangeCallbacks: OnErasingStateChangeCallback[]

	get color() {
		return this._color
	}
	set color(value) {
		if (this._color === value) return

		this._color = value
		this.context.strokeStyle = value
		this.onColorChangeCallbacks.forEach(callback => callback(value))
		this.erasing = false // ???
	}

	get size() {
		return this._size
	}
	set size(value) {
		if (this._size === value) return

		this._size = value
		this.context.lineWidth = value
		this.onSizeChangeCallbacks.forEach(callback => callback(value))
	}

	get erasing() {
		return this._erasing
	}
	set erasing(value) {
		if (this._erasing === value) return

		this._erasing = value
		if (value)
			this.context.globalCompositeOperation = "destination-out"
		else
			this.context.globalCompositeOperation = "source-over"
		this.onErasingStateChangeCallbacks.forEach(callback => callback(value))
	}


	constructor(context: CanvasRenderingContext2D, { hexColor = "#000000", size = 5 } = {}) {
		this.context = context
		this._size = size
		this._color = hexColor
		this._erasing = false
		this.onColorChangeCallbacks = []
		this.onSizeChangeCallbacks = []
		this.onErasingStateChangeCallbacks = []
	}

	startErasing = () => {
		this.erasing = true
	}

	stopErasing = () => {
		this.erasing = false
	}


	onColorChange = (callback: OnColorChangeCallback) => {
		this.onColorChangeCallbacks.push(callback)
	}

	onSizeChange = (callback: OnSizeChangeCallback) => {
		this.onSizeChangeCallbacks.push(callback)
	}

	onErasingStateChange = (callback: OnErasingStateChangeCallback) => {
		this.onErasingStateChangeCallbacks.push(callback)
	}
}


export default CanvasPen