
# draw-over
Give it a css selector and start drawing over the HTML element you want.
It also puts it's own control panel under the element (color selection etc.) which is not customizable at the time.

## API Reference

#### Select the HTML element to draw on.

```javascript
import DrawOver from "draw-over"

const drawover = DrawOver("#drawable")
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `selector` | `string` | **Required**. A CSS selector.|

#### Start and stop drawing.

```javascript
  drawover.startDrawing()
  drawover.stopDrawing()
  
  // or
  drawover.toggleDrawing()
```
## Usage/Examples

```javascript
const drawover = new DrawOver("#drawable")

someButton.addEventListener("click", drawover.toggle)
```
## Things To Consider
It places a canvas on top of the element using `absolute` positioning. So the element should not have static positioning. Which is why it checks if the element is static and changes it to `relative` position if it is.

When the HTML element changes in size it doesn't automatically fit itself accordingly. So you have to call the `refresh` method on the drawable object.
Which resets the canvas.
```javascript
drawable.refresh()
```