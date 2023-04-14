class ColorPalette {
	defaultColors: string[]
	customColors: string[]
	onColorsChangeCallbacks: (() => void)[]


	constructor(defaultColorPalette: string[]) {
		this.defaultColors = defaultColorPalette
		this.customColors = new Array(this.defaultColors.length).fill("")
		this.onColorsChangeCallbacks = []
	}


	addCustomColor = (newHexColor: string) => {
		if (this.customColors.includes(newHexColor))
			return

		this.customColors.pop()
		this.customColors.unshift(newHexColor)
		this.onColorsChangeCallbacks.forEach(callback => callback())
	}

	onColorsChange = (callback: () => void) => {
		this.onColorsChangeCallbacks.push(callback)
	}

	reset = () => {
		this.customColors = new Array(this.defaultColors.length).fill("")
		this.onColorsChangeCallbacks.forEach(callback => callback())
	}
}


export default ColorPalette