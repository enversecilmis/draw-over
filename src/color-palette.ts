import { NEmptyArr } from "./utils"

type OnColorsChangeCallback = (colors: {
	default: string[]
	custom: string[]
}) => void


class ColorPalette {
	defaultColors: NEmptyArr<string>
	customColors: NEmptyArr<string>
	private onColorsChangeCallbacks: OnColorsChangeCallback[]


	constructor(defaultColorPalette: NEmptyArr<string>) {
		this.defaultColors = defaultColorPalette
		this.customColors = new Array(this.defaultColors.length).fill("") as NEmptyArr<string>
		this.onColorsChangeCallbacks = []
	}


	addCustomColor = (newHexColor: string) => {
		if (this.customColors.includes(newHexColor))
			return

		this.customColors.pop()
		this.customColors.unshift(newHexColor)
		this.onColorsChangeCallbacks.forEach(callback => callback({
			default: this.defaultColors,
			custom: this.customColors,
		}))
	}

	onColorsChange = (callback: OnColorsChangeCallback) => {
		this.onColorsChangeCallbacks.push(callback)
	}

	reset = () => {
		this.customColors = new Array(this.defaultColors.length).fill("") as [string, ...string[]]
		this.onColorsChangeCallbacks.forEach(callback => callback({
			default: this.defaultColors,
			custom: this.customColors,
		}))
	}
}


export default ColorPalette