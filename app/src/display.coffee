# author: Peter Urbak <peter@dragonwasrobot.com>
# version: 2014-10-18

class Display

  # The original implementation of the Chip-8 language used a 64x32-pixel
  # monochrome display with the format:

  #     |------------------|
  #     |( 0, 0)    (63, 0)|
  #     |                  |
  #     |( 0,31)    (63,31)|
  #     |------------------|

  displayWidth: 64
  displayHeight: 32

  # The display is rendered with 10x10 pixel cells, and we use a nice bright
  # retro green for coloring the pixels.

  cellSize: 10
  cellColor: { red: 0, green: 255, blue: 0, trans: 0.1, gray: 38 }

  # ### Constructors

  constructor: () ->
    @display = ((0 for j in [0...@displayHeight]) for i in [0...@displayWidth])
    @createCanvas()

  # ### Methods

  clear: () ->
    @display = ((0 for j in [0...@displayHeight]) for i in [0...@displayWidth])
    @drawGrid()

  createCanvas: () ->
    @canvas = document.createElement 'canvas'
    document.body.appendChild @canvas
    @canvas.height = @cellSize * @displayHeight
    @canvas.width = @cellSize * @displayWidth
    @drawingContext = @canvas.getContext '2d'

  drawGrid: () ->
    for column in [0...@displayWidth]
      for row in [0...@displayHeight]
        @drawCell {
          'column' : column
          'row' : row
          'value' : @display[column][row]
        }

    @drawingContext.strokeStyle = @getRGB(@cellColor.red, @cellColor.green,
    @cellColor.blue)
    @drawingContext.strokeRect(0, 0, @cellSize * @displayWidth,
      @cellSize * @displayHeight)

  getCell: (x, y) -> { column: x, row: y, value: @display[x][y] }

  setCell: (cell) ->
    if cell.column < 0 or cell.column >= @displayWidth
      throw new Error("Cell column out of bounds: #{cell.column},
        should be 0 <= column < #{@displayWidth}.")
    if cell.row < 0 or cell.row >= @displayHeight
      throw new Error("Cell row out of bounds: #{cell.row},
        should be 0 <= row < #{@displayWidth}.")
    @display[cell.column][cell.row] = cell.value

  drawCell: (cell) ->
    x = cell.column * @cellSize
    y = cell.row * @cellSize

    switch cell.value
      when 1 then @drawingContext.fillStyle = @getRGB(@cellColor.red,
        @cellColor.green, @cellColor.blue)
      when 0 then @drawingContext.fillStyle = @getGrayscale(@cellColor.gray)
      else throw new Error("Unknown cell value: #{cell.value}")

    @drawingContext.strokeStyle = @getRGB(@cellColor.red, @cellColor.green,
      @cellColor.blue) #, @cellColor.trans)
    @drawingContext.strokeRect(x, y, @cellSize, @cellSize)

    @drawingContext.fillRect(x, y, @cellSize, @cellSize)

  getGrayscale: (gray) ->
    "rgb(#{gray}, #{gray}, #{gray})"

  getRGB: (red, green, blue) ->
    "rgb(#{red}, #{green}, #{blue})"
