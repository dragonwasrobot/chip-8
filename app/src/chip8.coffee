# # Chip8

# author: Peter Urbak <peter@dragonwasrobot.com>
# version: 2015-01-03

# Reference material for the Chip-8 specification:
# [Chip-8 Technical Reference](http://devernay.free.fr/hacks/chip8/C8TECH10.HTM)

# ## Properties

debug = false

# ## Functions

log = (string) -> if debug then console.log string

loadProgram = (fetchDecodeExecute) ->
  xhr = new XMLHttpRequest()
  xhr.open('GET', 'roms/WIPEOFF', true)
  xhr.responseType = 'arraybuffer'
  xhr.onload = () ->
    readProgram(new Uint8Array(xhr.response), fetchDecodeExecute)
  xhr.send()

readProgram = (program, fetchDecodeExecute) ->
  programStart = 512
  memory = fetchDecodeExecute.instructions.memory
  log(program)
  (memory[i + programStart] = program[i]) for i in [0...program.length]
  log((memory.slice(programStart, programStart + program.length)).map (x) ->
    x.toString(16).toUpperCase())
  fetchDecodeExecute.instructions.I = 0
  fetchDecodeExecute.instructions.PC = programStart
  fetchDecodeExecute.tick()

main = () ->

  display = Chip8.Display
  display.initialize()

  keyboard = Chip8.Keyboard
  keyboard.initialize()

  instructions = Chip8.Instructions
  instructions.initialize(display, keyboard)

  fetchDecodeExecute = Chip8.FDX
  fetchDecodeExecute.initialize(instructions)

  loadProgram(fetchDecodeExecute)

# ## Export and initialize module

Chip8 = window.Chip8 = if window.Chip8? then window.Chip8 else {}
window.Chip8.main = main
window.Chip8.log = log
