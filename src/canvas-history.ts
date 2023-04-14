class CanvasHistory {
	currentStepIndex: number
	steps: string[]
	onHistoryMoveCallbacks: (() => void)[]
	onHistoryChangeCallbacks: (() => void)[]

	get currentStep() {
		return this.steps[this.currentStepIndex] ?? ""
	}


	constructor(initialStateDataUrl: string) {
		this.currentStepIndex = 0
		this.steps = [initialStateDataUrl]
		this.onHistoryMoveCallbacks = []
		this.onHistoryChangeCallbacks = []
	}

	forward = () => {
		if (this.currentStepIndex === this.steps.length - 1)
			return
		this.currentStepIndex++
		this.onHistoryMoveCallbacks.forEach(callback => callback())
		this.onHistoryChangeCallbacks.forEach(callback => callback())
	}

	back = () => {
		if (this.currentStepIndex === 0)
			return
		this.currentStepIndex--
		this.onHistoryMoveCallbacks.forEach(callback => callback())
		this.onHistoryChangeCallbacks.forEach(callback => callback())
	}

	pushHistory = (canvasDataUrl: string) => {
		if (this.currentStepIndex < this.steps.length - 1)
			this.steps = this.steps.slice(0, this.currentStepIndex + 1)

		this.currentStepIndex++
		this.steps.push(canvasDataUrl)
		this.onHistoryChangeCallbacks.forEach(callback => callback())
	}

	onHistoryMove = (callback: () => void) => {
		this.onHistoryMoveCallbacks.push(callback)
	}


	onHistoryChange = (callback: () => void) => {
		this.onHistoryChangeCallbacks.push(callback)
	}


	reset = (initialStateDataUrlAfterReset: string) => {
		this.currentStepIndex = 0
		this.steps = [initialStateDataUrlAfterReset]
		this.onHistoryMoveCallbacks.forEach(callback => callback())
		this.onHistoryChangeCallbacks.forEach(callback => callback())
	}
}


export default CanvasHistory