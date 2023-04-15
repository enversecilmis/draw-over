import CanvasControls from "./canvas-controls"
import CanvasHistory from "./canvas-history"
import CanvasPen from "./canvas-pen"
import ColorPalette from "./color-palette"
import { DEFAULT_COLOR_PALETTE, NEmptyArr, cn } from "./utils"



type Options = {
	defaultColors?: NEmptyArr<string>
}


class DrawOver {
	drawedOnElement: HTMLElement
	canvas: HTMLCanvasElement
	context: CanvasRenderingContext2D
	pen: CanvasPen
	history: CanvasHistory
	colorPalette: ColorPalette
	controlPanel: CanvasControls

	
	private penData = {
		dragged: false,
		coords: { x: 0, y: 0, px: 0, py: 0 }
	}


	constructor(selector: string, {
		defaultColors = DEFAULT_COLOR_PALETTE as NEmptyArr<string>,
	}: Options = {}) {
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


		this.history = new CanvasHistory(this.canvas.toDataURL())
		this.colorPalette = new ColorPalette(defaultColors)
		this.pen = new CanvasPen(this.context, { hexColor: this.colorPalette.defaultColors[0] })
		this.controlPanel = new CanvasControls(this, this.pen, this.colorPalette, this.history)
		this.context.strokeStyle = this.pen.color
		this.context.lineWidth = this.pen.size


		this.history.onHistoryMove(() => {
			this.loadFromDataUrl(this.history.currentStep)
		})
	}

	penDown = (e: MouseEvent) => {
		const rect = this.canvas.getBoundingClientRect()
		this.penData.coords.px = e.pageX - window.pageXOffset - rect.left
		this.penData.coords.py = e.pageY - window.pageYOffset - rect.top
		this.canvas.addEventListener("mousemove", this.penMove)
	}


	penUp = () => {
		if (this.penData.dragged)
			this.history.pushHistory(this.canvas.toDataURL())
		this.penData.dragged = false
		this.canvas.removeEventListener("mousemove", this.penMove)
	}


	penMove = (e: MouseEvent) => {
		const rect = this.canvas.getBoundingClientRect()
		this.penData.coords.x = e.pageX - window.pageXOffset - rect.left
		this.penData.coords.y = e.pageY - window.pageYOffset - rect.top

		// DRAW THE LINE
		this.context.beginPath()
		this.context.moveTo(this.penData.coords.px, this.penData.coords.py)
		this.context.lineTo(this.penData.coords.x, this.penData.coords.y)
		this.context.stroke()

		this.penData.coords.px = this.penData.coords.x
		this.penData.coords.py = this.penData.coords.y
		this.penData.dragged = true
	}


	touchPenDown = (e: TouchEvent) => {
		e.preventDefault()

		const rect = this.canvas.getBoundingClientRect()
		this.penData.coords.px = e.touches[0].pageX - window.pageXOffset - rect.left
		this.penData.coords.py = e.touches[0].pageY - window.pageYOffset - rect.top
		this.canvas.addEventListener("touchmove", this.touchPenMove)
	}

	touchPenUp = (e: TouchEvent) => {
		e.preventDefault()
		if (this.penData.dragged)
			this.history.pushHistory(this.canvas.toDataURL())
		this.penData.dragged = false
		this.canvas.removeEventListener("touchmove", this.touchPenMove)
	}

	touchPenMove = (e: TouchEvent) => {
		e.preventDefault()
		const rect = this.canvas.getBoundingClientRect()
		this.penData.coords.x = e.touches[0].pageX - window.pageXOffset - rect.left
		this.penData.coords.y = e.touches[0].pageY - window.pageYOffset - rect.top

		// DRAW THE LINE
		this.context.beginPath()
		this.context.moveTo(this.penData.coords.px, this.penData.coords.py)
		this.context.lineTo(this.penData.coords.x, this.penData.coords.y)
		this.context.stroke()

		this.penData.coords.px = this.penData.coords.x
		this.penData.coords.py = this.penData.coords.y
		this.penData.dragged = true
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

	toggleDrawing = () => {
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

	refresh = () => {
		this.clearCanvas()
		this.history.reset(this.canvas.toDataURL())
		this.canvas.width = this.drawedOnElement.clientWidth
		this.canvas.height = this.drawedOnElement.clientHeight

		const context = this.canvas.getContext("2d")
		if (!context)
			throw new Error("Couldn't create the context.")

		this.context = context
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





export default DrawOver