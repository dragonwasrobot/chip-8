# # Display

# author: Peter Urbak <peter@dragonwasrobot.com>
# version: 2015-01-03

window.Chip8 = if window.Chip8? then window.Chip8 else {}
window.Chip8.Display = () ->

  log = window.Chip8.log

  # ## Properties

  # The original implementation of the Chip-8 language used a 64x32-pixel
  # monochrome display with the format:

  #     |------------------|
  #     |( 0, 0)    (63, 0)|
  #     |                  |
  #     |( 0,31)    (63,31)|
  #     |------------------|

  width = 64
  height = 32
  cells = ((0 for j in [0...height]) for i in [0...width])

  # The display is rendered with 10x10 pixel cells and we use a bright retro green
  # for coloring the pixels.

  cellSize = 10
  cellColor = { red: 0, green: 255, blue: 0, gray: 33 }

  # Canvases and drawing contexts
  context = {}
  canvas = {}

  # ## Functions

  clearCells = () ->
    cells = ((0 for j in [0...height]) for i in [0...width])
    drawCells()

  drawCells = () ->
    log 'Display->drawCells'
    buffer = document.createElement 'canvas'
    buffer.height = cellSize * height
    buffer.width = cellSize * width
    bufferContext = buffer.getContext '2d'

    drawCell = (cell) ->
      x = cell.column * cellSize
      y = cell.row * cellSize

      switch cell.value
        when 1 then bufferContext.fillStyle = getRGB(cellColor.red,
        cellColor.green, cellColor.blue)
        when 0 then bufferContext.fillStyle = getGrayscale(cellColor.gray)
        else throw new Error "Unknown cell value: #{cell.value}"

      bufferContext.fillRect(x, y, cellSize, cellSize)

    for column in [0...width]
      for row in [0...height]
        value = cells[column][row]
        drawCell {
          column: column
          row: row
          value: value
        }

    bufferContext.strokeStyle = getRGB(cellColor.red, cellColor.green,
      cellColor.blue)
    bufferContext.strokeRect(0, 0, cellSize * width, cellSize * height)

    context.drawImage(buffer, 0, 0)

  getCell = (column, row) -> {
    column: column,
    row: row,
    value: cells[column][row]
  }

  setCell = (cell) -> cells[cell.column][cell.row] = cell.value

  getGrayscale = (gray) -> "rgb(#{gray}, #{gray}, #{gray})"

  getRGB = (red, green, blue) -> "rgb(#{red}, #{green}, #{blue})"

  # ## Initialize and export module

  do () ->
    canvas = document.getElementById 'visible-canvas'
    canvas.height = cellSize * height
    canvas.width = cellSize * width
    context = canvas.getContext '2d'
    drawCells()

  {
    cells: cells
    height: height
    width: width
    clearCells: clearCells
    drawCells: drawCells
    getCell: getCell
    setCell: setCell
  }
