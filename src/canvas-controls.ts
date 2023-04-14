import CanvasHistory from "./canvas-history"
import CanvasPen from "./canvas-pen"
import ColorPalette from "./color-palette"
import ColorSphere from "./color-sphere"
import DrawOver from "./draw-over"
import { cn, createClearIcon, createEraserIcon, createRedoIcon, createUndoIcon } from "./utils"





class CanvasControls {
	view: HTMLDivElement

	constructor(
		drawOver: DrawOver,
		pen: CanvasPen,
		colorPalette: ColorPalette,
		history: CanvasHistory,
	) {
		this.view = document.createElement("div")
		this.view.className = cn("control-view")


		const stateControls = document.createElement("div")
		stateControls.className = cn("state-controls")
		this.view.appendChild(stateControls)

		const undoButton = document.createElement("button")
		undoButton.className = cn("undo-redo-button")
		if (history.currentStepIndex === 0)
			undoButton.disabled = true
		undoButton.appendChild(createUndoIcon())
		stateControls.appendChild(undoButton)

		const redoButton = document.createElement("button")
		redoButton.className = cn("undo-redo-button")
		if (history.currentStepIndex === history.steps.length - 1)
			redoButton.disabled = true
		redoButton.appendChild(createRedoIcon())
		stateControls.appendChild(redoButton)

		const clearButton = document.createElement("button")
		clearButton.className = cn("clear-button")
		clearButton.appendChild(createClearIcon())
		stateControls.appendChild(clearButton)



		const colorControls = document.createElement("div")
		colorControls.className = cn("color-controls")
		this.view.appendChild(colorControls)


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
		eraserButton.appendChild(createEraserIcon())
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



		// EVENT LISTENERS
		undoButton.addEventListener("click", history.back)
		redoButton.addEventListener("click", history.forward)
		clearButton.addEventListener("click", drawOver.clearCanvas)
		eraserButton.addEventListener("click", () => {
			pen.erasing = !pen.erasing
		})

		colorPicker.addEventListener("change", (e) => {
			const color = (e.target as HTMLInputElement).value
			pen.color = color
			colorPalette.addCustomColor(color)
		})

		penSizeSlider.addEventListener("change", e => {
			const size = (e.target as HTMLInputElement).valueAsNumber
			pen.size = size
			penPreviewLine.style.height = `${size}px`
		})
		penSizeSlider.addEventListener("input", e => {
			const size = (e.target as HTMLInputElement).valueAsNumber
			penPreviewLine.style.height = `${size}px`
		})


		// STATE SYNCRONISING
		pen.onColorChange(color => {
			penPreviewLine.style.backgroundColor = color
			colorPicker.value = color
		})
		pen.onSizeChange(size => {
			penPreviewLine.style.height = `${size}px`
		})
		pen.onErasingStateChange(erasing => {
			if (erasing)
				eraserButton.classList.add(cn("eraser-button-selected"))
			else
				eraserButton.classList.remove(cn("eraser-button-selected"))
		})

		colorPalette.onColorsChange(colors => {
			customColorSpheres.forEach((sphere, i) => {
				sphere.color = colors.custom[i]
			})
		})

		history.onHistoryChange(() => {
			undoButton.disabled = history.currentStepIndex === 0
			redoButton.disabled = history.currentStepIndex === history.steps.length - 1
		})
	}
}


export default CanvasControls