# # Main

loadProgram = (fetchDecodeExecute) ->
  xhr = new XMLHttpRequest()
  xhr.open('GET', 'roms/TETRIS', true)
  xhr.responseType = 'arraybuffer'
  xhr.onload = () ->
    readProgram(new Uint8Array(xhr.response), fetchDecodeExecute)
  xhr.send()

readProgram = (program, fetchDecodeExecute) ->
  PROGRAM_START = 512
  memory = fetchDecodeExecute.instructionSet.memory
  (memory[i + PROGRAM_START] = program[i]) for i in [0...program.length]
  log((memory.slice(PROGRAM_START, program.length)).map (x) -> toHex(x))
  startProgram(fetchDecodeExecute)

startProgram = (fetchDecodeExecute) ->
  fetchDecodeExecute.instructionSet.I = 0
  fetchDecodeExecute.instructionSet.PC = 512
  fetchDecodeExecute.instructionSet.display.createCanvas()
  fetchDecodeExecute.tick()

DEBUG = true

log = (string) ->
  if DEBUG then console.log(string)

main = () ->
  display = new Display()
  keyboard = new Keyboard()
  instructionSet = new InstructionSet(display, keyboard)
  fetchDecodeExecute = new FetchDecodeExecuteLoop(instructionSet)
  loadProgram(fetchDecodeExecute)

  # display.setCell {column: 5, row: 4, value: 1}
  # display.setCell {column: 5, row: 7, value: 1}
  # display.setCell {column: 3, row: 2, value: 1}
  # display.setCell {column: 8, row: 6, value: 1}
  # display.setCell {column: 7, row: 14, value: 1}
  # display.drawGrid()
  # display.drawCell {column: 0, row: 0, value: 1}

window.main = main
