import CanvasPen from "./canvas-pen"
import { cn } from "./utils"





class ColorSphere {
	color: string
	view: HTMLDivElement
	setColor: (newColor: string) => void


	constructor(color: string, pen: CanvasPen) {
		this.color = color
		this.view = document.createElement("div")
		this.view.style.backgroundColor = color
		this.view.classList.add(cn("color-sphere"))
		if (color === pen.color)
			this.view.classList.add(cn("color-sphere-selected"))

		this.view.onclick = () => this.color && pen.setColor(this.color)

		pen.onColorChange(() => {
			if (this.color === pen.color)
				this.view.classList.add(cn("color-sphere-selected"))
			else
				this.view.classList.remove(cn("color-sphere-selected"))
		})

		this.setColor = (newColor: string) => {
			this.color = newColor
			this.view.style.backgroundColor = newColor

			if (this.color === pen.color)
				this.view.classList.add(cn("color-sphere-selected"))
			else
				this.view.classList.remove(cn("color-sphere-selected"))
		}
	}
}


export default ColorSphere