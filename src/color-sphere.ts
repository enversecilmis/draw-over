import CanvasPen from "./canvas-pen"
import { cn } from "./utils"



class ColorSphere {
	private pen: CanvasPen
	private _color = ""
	
	view: HTMLDivElement
	
	get color(): string {
		return this._color
	}
	set color(value: string) {
		this._color = value
		this.view.style.backgroundColor = value

		if (value === this.pen.color)
			this.view.classList.add(cn("color-sphere-selected"))
		else
			this.view.classList.remove(cn("color-sphere-selected"))
	}


	constructor(color: string, pen: CanvasPen) {
		this.pen = pen
		this.color = color
		this.view = document.createElement("div")
		this.view.classList.add(cn("color-sphere"))
		

		this.view.addEventListener("click", () => {
			if (!this.color)
				return
			pen.stopErasing()
			pen.color = this.color
		})

		pen.onColorChange(color => {
			if (this.color === color)
				this.view.classList.add(cn("color-sphere-selected"))
			else
				this.view.classList.remove(cn("color-sphere-selected"))
		})
	}
}


export default ColorSphere