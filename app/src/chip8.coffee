# # Main

Chip8 = window.Chip8 = if window.Chip8? then window.Chip8 else {}

DEBUG = false
log = (string) ->
  if DEBUG then console.log string

loadProgram = (fetchDecodeExecute) ->
  xhr = new XMLHttpRequest()
  xhr.open('GET', 'roms/WIPEOFF', true)
  xhr.responseType = 'arraybuffer'
  xhr.onload = () ->
    readProgram(new Uint8Array(xhr.response), fetchDecodeExecute)
  xhr.send()

readProgram = (program, fetchDecodeExecute) ->
  PROGRAM_START = 512
  memory = fetchDecodeExecute.instructions.memory
  log(program)
  (memory[i + PROGRAM_START] = program[i]) for i in [0...program.length]
  log((memory.slice(PROGRAM_START, PROGRAM_START + program.length)).map (x) ->
    x.toString(16).toUpperCase())
  fetchDecodeExecute.instructions.I = 0
  fetchDecodeExecute.instructions.PC = PROGRAM_START
  fetchDecodeExecute.tick()

main = () ->
  display = Chip8.Display
  display.initialize()
  keyboard = Chip8.Keyboard
  keyboard.initialize()
  instructions = new Chip8.InstructionSet(display, keyboard)
  fetchDecodeExecute = Chip8.FDX
  fetchDecodeExecute.initialize(instructions)
  loadProgram(fetchDecodeExecute)

window.Chip8.main = main
window.Chip8.log = log
