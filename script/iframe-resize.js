;(function resizeSelectIframe() {
  const frames = document.querySelectorAll('iframe.iframe-resize')
  for (const frame of frames) {
    const parent = frame.parentElement
    if (!parent) {
      continue
    }

    const rect = parent.getBoundingClientRect()
    if (!rect) {
      continue
    }

    const frameHeight = +frame.getAttribute('width')
    if (!isFinite(frameHeight)) {
      continue
    }

    const frameWidth = +frame.getAttribute('height')
    if (!isFinite(frameWidth)) {
      continue
    }

    const parentWidth = rect.width
    const proportionalHeight = (frameWidth / frameHeight) * parentWidth

    Object.assign(frame, { width: parentWidth, height: proportionalHeight })
  }
})()
