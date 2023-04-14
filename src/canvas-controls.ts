import CanvasHistory from "./canvas-history"
import CanvasPen from "./canvas-pen"
import ColorPalette from "./color-palette"
import ColorSphere from "./color-sphere"
import Drawable from "./drawable"
import { cn, createClearIcon, createEraserIcon, createRedoIcon, createUndoIcon } from "./utils"





class CanvasControls {
	view: HTMLDivElement

	constructor(
		drawable: Drawable,
		pen: CanvasPen,
		colorPalette: ColorPalette,
		history: CanvasHistory,
	) {
		const verticalSeperator = document.createElement("div")
		verticalSeperator.className = cn("vertical-seperator")

		const verticalSeperator2 = document.createElement("div")
		verticalSeperator2.className = cn("vertical-seperator")

		const horizontalSeperator = document.createElement("div")
		horizontalSeperator.className = cn("horizontal-seperator")


		this.view = document.createElement("div")
		this.view.className = cn("control-view")


		const stateControls = document.createElement("div")
		stateControls.className = cn("state-controls")
		this.view.appendChild(stateControls)
		// this.view.appendChild(verticalSeperator)

		const undoButton = document.createElement("button")
		undoButton.className = cn("undo-redo-button")
		if (history.currentStepIndex === 0)
			undoButton.disabled = true
		const undoIcon = createUndoIcon()
		undoButton.appendChild(undoIcon)
		stateControls.appendChild(undoButton)

		const redoButton = document.createElement("button")
		redoButton.className = cn("undo-redo-button")
		if (history.currentStepIndex === history.steps.length - 1)
			redoButton.disabled = true
		const redoIcon = createRedoIcon()
		redoButton.appendChild(redoIcon)
		stateControls.appendChild(redoButton)

		const clearButton = document.createElement("button")
		clearButton.className = cn("clear-button")
		const clearIcon = createClearIcon()
		clearButton.appendChild(clearIcon)
		stateControls.appendChild(clearButton)



		const colorControls = document.createElement("div")
		colorControls.className = cn("color-controls")
		this.view.appendChild(colorControls)
		// this.view.appendChild(verticalSeperator2)


		const colorPicker = document.createElement("input")
		colorPicker.type = "color"
		colorPicker.value = pen.color
		colorControls.appendChild(colorPicker)


		const colorsContainer = document.createElement("div")
		colorsContainer.className = cn("colors-container")
		colorControls.appendChild(colorsContainer)


		const defaultColorsContainer = document.createElement("div")
		defaultColorsContainer.className = cn("default-colors")
		colorsContainer.appendChild(defaultColorsContainer)

		const defaultColorSpheres = colorPalette.defaultColors.map(color => new ColorSphere(color, pen))
		defaultColorSpheres.forEach(sphere => defaultColorsContainer.appendChild(sphere.view))

		const customColorsContainer = document.createElement("div")
		customColorsContainer.className = cn("custom-colors-container")
		colorsContainer.appendChild(customColorsContainer)

		const customColorSpheres = colorPalette.customColors.map(color => new ColorSphere(color, pen))
		customColorSpheres.map(sphere => customColorsContainer.appendChild(sphere.view))


		const eraserButton = document.createElement("button")
		eraserButton.classList.add(cn("eraser-button"))
		const eraserIcon = createEraserIcon()
		eraserButton.appendChild(eraserIcon)
		colorControls.appendChild(eraserButton)

		const penControl = document.createElement("div")
		penControl.className = cn("pen-control")
		this.view.appendChild(penControl)

		const penSizeSlider = document.createElement("input")
		penSizeSlider.type = "range"
		penSizeSlider.min = "0.1"
		penSizeSlider.max = "50"
		penSizeSlider.step = "1"
		penSizeSlider.value = `${pen.size}`
		penControl.appendChild(penSizeSlider)

		const penPreviewLineContainer = document.createElement("div")
		penPreviewLineContainer.className = cn("pen-preview-line-container")
		penControl.appendChild(penPreviewLineContainer)

		const penPreviewLine = document.createElement("div")
		penPreviewLine.className = cn("pen-preview-line")
		penPreviewLine.style.height = `${pen.size}px`
		penPreviewLine.style.backgroundColor = pen.color
		penPreviewLineContainer.appendChild(penPreviewLine)



		undoButton.addEventListener("click", history.back)
		redoButton.addEventListener("click", history.forward)
		clearButton.addEventListener("click", drawable.clearCanvas)
		eraserButton.addEventListener("click", () => {
			pen.erasing ?
				pen.stopErasing() :
				pen.startErasing()
		})


		colorPicker.addEventListener("change", (e) => {
			const color = (e.target as HTMLInputElement).value
			pen.setColor(color)
			colorPalette.addCustomColor(color)
		})


		penSizeSlider.addEventListener("change", e => pen.setSize((e.target as HTMLInputElement).valueAsNumber))
		penSizeSlider.addEventListener("input", e => penPreviewLine.style.height = `${(e.target as HTMLInputElement).valueAsNumber}px`)



		pen.onColorChange(() => {
			penPreviewLine.style.backgroundColor = pen.color
			colorPicker.value = pen.color
		})
		pen.onSizeChange(() => {
			penPreviewLine.style.height = `${pen.size}px`
		})
		pen.onErasingStateChange(() => {
			if (pen.erasing)
				eraserButton.classList.add(cn("eraser-button-selected"))
			else
				eraserButton.classList.remove(cn("eraser-button-selected"))
		})


		colorPalette.onColorsChange(() => {
			customColorSpheres.forEach((sphere, idx) => {
				sphere.setColor(colorPalette.customColors[idx])
			})
		})


		history.onHistoryChange(() => {
			console.log("History Chagned")
			if (history.currentStepIndex === 0)
				undoButton.disabled = true
			else
				undoButton.disabled = false

			if (history.currentStepIndex === history.steps.length - 1)
				redoButton.disabled = true
			else
				redoButton.disabled = false
		})
	}
}


export default CanvasControls