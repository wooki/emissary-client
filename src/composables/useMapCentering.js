export function useMapCentering(focusX, focusY, viewBoxCoords, clientWidth, clientHeight) {
    const centerMapOnClick = (e) => {
      e.preventDefault()

      if (!viewBoxCoords.value || !clientWidth.value || !clientHeight.value) {
        console.log('Missing required values, aborting')
        return
      }

      const rect = e.currentTarget.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const clickY = e.clientY - rect.top

      const [viewBoxX, viewBoxY, viewBoxWidth, viewBoxHeight] = viewBoxCoords.value

      const mapX = viewBoxX + (clickX / clientWidth.value) * viewBoxWidth
      const mapY = viewBoxY + (clickY / clientHeight.value) * viewBoxHeight

      const currentCenterX = viewBoxX + viewBoxWidth / 2
      const currentCenterY = viewBoxY + viewBoxHeight / 2

      const offsetX = mapX - currentCenterX
      const offsetY = mapY - currentCenterY

      focusX.value += offsetX
      focusY.value += offsetY
    }

    return { centerMapOnClick }
}