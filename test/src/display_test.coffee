describe 'display', () ->

  display = null

  beforeEach () ->
    display = new Display()

  it 'display and its fields should be properly defined', () ->
    expect(display).toBeDefined()
    expect(display.canvas).toBeDefined()
    expect(display.drawingContext).toBeDefined()
    expect(display.displayWidth).toBe 64
    expect(display.displayHeight).toBe 32

  it 'display should have proper dimensions', () ->
    pixelDisplay = display.display
    expect(pixelDisplay).toBeDefined()
    expect(pixelDisplay.length).toBe 64
    expect(pixelDisplay[1].length).toBe 32
    expect(pixelDisplay[13].length).toBe 32
    expect(pixelDisplay[27].length).toBe 32

  it 'should get and set cells correctly', () ->
    cell1 = { column: 3, row: 7, value: 1 }
    preCell = display.getCell(cell1.column, cell1.row)
    expect(preCell.column).toEqual(3)
    expect(preCell.row).toEqual(7)
    expect(preCell.value).toEqual(0)
    display.setCell cell1
    postCell = display.getCell(cell1.column, cell1.row)
    expect(postCell.column).toEqual(3)
    expect(postCell.row).toEqual(7)
    expect(postCell.value).toEqual(1)

  it 'should throw error when given invalid cells', () ->
    badColumnCell1 = { column: -1, row: 5, value: 1 }
    expect(() -> display.setCell badColumnCell1).toThrow()

    badColumnCell2 = { column: 64, row: 5, value: 1 }
    expect(() -> display.setCell(badColumnCell2)).toThrow()

    badRowCell1 = { column: 4, row: -1, value: 1 }
    expect(() -> display.setCell(badRowCell1)).toThrow()

    badRowCell2 = { column: 7, row: 32, value: 1 }
    expect(() -> display.setCell(badRowCell2)).toThrow()

  it 'should somehow test the drawing context stuff', () ->
    expect(true).toBe(true)

  it 'should generate correct rgb strings', () ->
    expect(display.getRGB(261, 157, 31)).toEqual('rgb(261, 157, 31)')

  it 'should generate correct rgb gray scale strings', () ->
    expect(display.getGrayscale(55)).toEqual('rgb(55, 55, 55)')
