import CanvasControls from "./canvas-controls"
import CanvasHistory from "./canvas-history"
import CanvasPen from "./canvas-pen"
import ColorPalette from "./color-palette"
import { DEFAULT_COLOR_PALETTE, cn } from "./utils"






class Drawable {
	drawedOnElement: HTMLElement
	canvas: HTMLCanvasElement
	context: CanvasRenderingContext2D
	pen: CanvasPen
	history: CanvasHistory
	colorPalette: ColorPalette
	controlPanel: CanvasControls


	constructor(
		selector: string,
		{
			defaultColors = DEFAULT_COLOR_PALETTE,
		} = {},
	) {
		this.drawedOnElement = document.querySelector(selector) as HTMLElement

		if (!this.drawedOnElement)
			throw new Error(`Couldn't find any element with the selector: ${selector}.`)


		if (!this.drawedOnElement.style.position || this.drawedOnElement.style.position === "static")
			this.drawedOnElement.style.position = "relative"


		// SETUP THE CANVAS
		this.canvas = document.createElement("canvas")
		this.canvas.className = cn("canvas")
		this.canvas.width = this.drawedOnElement.clientWidth
		this.canvas.height = this.drawedOnElement.clientHeight
		this.canvas.addEventListener("mousedown", this.penDown)
		this.canvas.addEventListener("mouseup", this.penUp)
		this.canvas.addEventListener("mouseleave", this.penUp)
		this.canvas.addEventListener("touchstart", this.touchPenDown)
		this.canvas.addEventListener("touchend", this.touchPenUp)
		this.canvas.addEventListener("touchcancel", this.touchPenMove)


		// SETUP THE CONTEXT
		const context = this.canvas.getContext("2d")
		if (!context)
			throw new Error("Couldn't create the context.")

		this.context = context
		this.context.lineCap = "round"
		this.context.globalCompositeOperation = "source-over"


		this.colorPalette = new ColorPalette(defaultColors)
		this.pen = new CanvasPen(this.colorPalette.defaultColors[0])
		this.history = new CanvasHistory(this.canvas.toDataURL())
		this.controlPanel = new CanvasControls(this, this.pen, this.colorPalette, this.history)
		this.context.strokeStyle = this.pen.color
		this.context.lineWidth = this.pen.size


		// State syncronization
		this.pen.onColorChange(() => {
			this.context.strokeStyle = this.pen.color
			this.pen.stopErasing()
		})
		this.pen.onSizeChange(() => {
			this.context.lineWidth = this.pen.size
		})
		this.pen.onErasingStateChange(() => {
			if (this.pen.erasing)
				this.context.globalCompositeOperation = "destination-out"
			else
				this.context.globalCompositeOperation = "source-over"
		})

		this.history.onHistoryMove(() => {
			this.loadFromDataUrl(this.history.currentStep)
		})
	}

	penDown = (e: MouseEvent) => {
		const rect = this.canvas.getBoundingClientRect()
		this.pen.coords.px = e.pageX - window.pageXOffset - rect.left
		this.pen.coords.py = e.pageY - window.pageYOffset - rect.top
		this.canvas.addEventListener("mousemove", this.penMove)
	}


	penUp = () => {
		if (this.pen.drawed)
			this.history.pushHistory(this.canvas.toDataURL())
		this.pen.drawed = false
		this.canvas.removeEventListener("mousemove", this.penMove)
	}


	penMove = (e: MouseEvent) => {
		const rect = this.canvas.getBoundingClientRect()
		this.pen.coords.x = e.pageX - window.pageXOffset - rect.left
		this.pen.coords.y = e.pageY - window.pageYOffset - rect.top

		// DRAW THE LINE
		this.context.beginPath()
		this.context.moveTo(this.pen.coords.px, this.pen.coords.py)
		this.context.lineTo(this.pen.coords.x, this.pen.coords.y)
		this.context.stroke()

		this.pen.coords.px = this.pen.coords.x
		this.pen.coords.py = this.pen.coords.y
		this.pen.drawed = true
	}


	touchPenDown = (e: TouchEvent) => {
		e.preventDefault()

		const rect = this.canvas.getBoundingClientRect()
		this.pen.coords.px = e.touches[0].pageX - window.pageXOffset - rect.left
		this.pen.coords.py = e.touches[0].pageY - window.pageYOffset - rect.top
		this.canvas.addEventListener("touchmove", this.touchPenMove)
	}

	touchPenUp = (e: TouchEvent) => {
		e.preventDefault()
		if (this.pen.drawed)
			this.history.pushHistory(this.canvas.toDataURL())
		this.pen.drawed = false
		this.canvas.removeEventListener("touchmove", this.touchPenMove)
	}

	touchPenMove = (e: TouchEvent) => {
		e.preventDefault()
		const rect = this.canvas.getBoundingClientRect()
		this.pen.coords.x = e.touches[0].pageX - window.pageXOffset - rect.left
		this.pen.coords.y = e.touches[0].pageY - window.pageYOffset - rect.top

		// DRAW THE LINE
		this.context.beginPath()
		this.context.moveTo(this.pen.coords.px, this.pen.coords.py)
		this.context.lineTo(this.pen.coords.x, this.pen.coords.y)
		this.context.stroke()

		this.pen.coords.px = this.pen.coords.x
		this.pen.coords.py = this.pen.coords.y
		this.pen.drawed = true
	}


	clearCanvas = () => {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
		this.history.pushHistory(this.canvas.toDataURL())
	}

	startDrawing = () => {
		this.drawedOnElement.style.userSelect = "none"
		this.drawedOnElement.appendChild(this.canvas)
		this.drawedOnElement.appendChild(this.controlPanel.view)
	}

	stopDrawing = () => {
		this.drawedOnElement.style.userSelect = "auto"
		this.drawedOnElement.removeChild(this.canvas)
		this.drawedOnElement.removeChild(this.controlPanel.view)
	}

	toggleCanvas = () => {
		if (this.drawedOnElement.contains(this.canvas))
			this.stopDrawing()
		else
			this.startDrawing()
	}

	reset = () => {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
		this.colorPalette.reset()
		this.history.reset(this.canvas.toDataURL())
	}


	loadFromDataUrl = (canvasDataUrl: string) => {
		this.pen.stopErasing()
		const canvasImage = new Image()
		canvasImage.src = canvasDataUrl
		canvasImage.onload = () => {
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
			this.context.drawImage(canvasImage, 0, 0, this.canvas.width, this.canvas.height, 0, 0, this.canvas.width, this.canvas.height)
		}
	}
}





export default Drawable