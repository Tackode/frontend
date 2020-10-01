const inlineWorker = (func: () => void) => {
  const functionBodyMatch = func
    .toString()
    .trim()
    .match(/^function\s*\w*\s*\([\w\s,]*\)\s*{([\w\W]*?)}$/)

  if (functionBodyMatch == null || functionBodyMatch.length < 2) {
    console.error('Cannot find QRCode function.')
    return null
  }

  return new Worker(
    URL.createObjectURL(
      new Blob([functionBodyMatch[1]], { type: 'text/javascript' })
    )
  )
}

export default () => {
  return inlineWorker(() => {
    // @ts-ignore
    self.importScripts(`${self.location.origin}/vendors/jsQR.min.js`)

    self.addEventListener('message', function (event) {
      const imageData = event.data

      // @ts-ignore
      // eslint-disable-next-line no-undef
      const result = jsQR(imageData.data, imageData.width, imageData.height)

      let content = null
      let location = null

      if (result !== null) {
        content = result.data
        location = result.location
      }

      const message = { content, location, imageData }
      // @ts-ignore
      self.postMessage(message, [imageData.data.buffer])
    })
  })
}
