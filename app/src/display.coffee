# # Display

# author: Peter Urbak <peter@dragonwasrobot.com>
# version: 2015-01-02

# ## Properties

log = window.Chip8.log

Display = {}

# The original implementation of the Chip-8 language used a 64x32-pixel
# monochrome display with the format:

#     |------------------|
#     |( 0, 0)    (63, 0)|
#     |                  |
#     |( 0,31)    (63,31)|
#     |------------------|

Display.width = 64
Display.height = 32
Display.cells = ((0 for j in [0...Display.height]) for i in [0...Display.width])

# The display is rendered with 10x10 pixel cells and we use a bright retro green
# for coloring the pixels.

cellSize = 10
cellColor = { red: 0, green: 255, blue: 0, gray: 33 }

# Canvases and drawing contexts
context = {}
canvas = {}

# ## Functions

Display.initialize = () ->
  canvas = document.getElementById 'visible-canvas'
  canvas.height = cellSize * Display.height
  canvas.width = cellSize * Display.width
  context = canvas.getContext '2d'
  Display.drawCells()

Display.clearCells = () ->
  Display.cells = ((0 for j in [0...Display.height]) for i in [0...Display.width])
  Display.drawCells()

Display.drawCells = (cells...) ->
  log "drawCells"
  buffer = document.createElement 'canvas'
  buffer.height = cellSize * Display.height
  buffer.width = cellSize * Display.width
  bufferContext = buffer.getContext '2d'

  drawCell = (cell) ->
    x = cell.column * cellSize
    y = cell.row * cellSize

    switch cell.value
      when 1 then bufferContext.fillStyle = getRGB(cellColor.red,
      cellColor.green, cellColor.blue)
      when 0 then bufferContext.fillStyle = getGrayscale(cellColor.gray)
      else throw new Error("Unknown cell value: #{cell.value}")

    bufferContext.fillRect(x, y, cellSize, cellSize)

  columnStart = 0
  columnEnd = Display.width
  rowStart = 0
  rowEnd = Display.height

  if cells.length is 2
    cellStart = cells[0]
    cellEnd = cells[1]
    columnStart = cellStart.column
    rowStart = cellStart.row
    columnEnd = cellEnd.column
    rowEnd = cellEnd.row

  for column in [columnStart...columnEnd]
    for row in [rowStart...rowEnd]
      value = Display.cells[column][row]
      drawCell {
        column: column
        row: row
        value: value
      }

  bufferContext.strokeStyle = getRGB(cellColor.red, cellColor.green,
    cellColor.blue)
  bufferContext.strokeRect(0, 0, cellSize * Display.width,
    cellSize * Display.height)

  context.drawImage(buffer, 0, 0)

Display.getCell = (column, row) -> {
  column: column,
  row: row,
  value: Display.cells[column][row]
}

Display.setCell = (cell) -> Display.cells[cell.column][cell.row] = cell.value

getGrayscale = (gray) -> "rgb(#{gray}, #{gray}, #{gray})"

getRGB = (red, green, blue) -> "rgb(#{red}, #{green}, #{blue})"

# ## Export and initialize module

window.Chip8 = if window.Chip8? then window.Chip8 else {}
window.Chip8.Display = Display
