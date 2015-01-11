# # Chip8

# author: Peter Urbak <peter@dragonwasrobot.com>
# version: 2015-01-03

# Reference material for the Chip-8 specification:
# [Chip-8 Technical Reference](http://devernay.free.fr/hacks/chip8/C8TECH10.HTM)

# ## Properties

debug = false
games = [
  '15PUZZLE', 'BLINKY', 'BLITZ', 'BRIX', 'CONNECT4', 'GUESS', 'HIDDEN', 'IBM',
  'INVADERS', 'KALEID', 'MAZE', 'MERLIN', 'MISSILE', 'PONG', 'PONG2', 'PUZZLE',
  'SYZYGY', 'TANK', 'TETRIS', 'TICTAC', 'UFO', 'VBRIX', 'VERS', 'WIPEOFF'
]
game = 'INVADERS'

# ## Functions

log = (string) -> if debug then console.log string

loadProgram = (fetchDecodeExecute) ->
  xhr = new XMLHttpRequest()
  xhr.open('GET', 'roms/' + game, true)
  xhr.responseType = 'arraybuffer'
  xhr.onload = () ->
    readProgram(new Uint8Array(xhr.response), fetchDecodeExecute)
  xhr.send()

readProgram = (program, fetchDecodeExecute) ->
  programStart = 512
  state = fetchDecodeExecute.state
  memory = state.memory
  (memory[i + programStart] = program[i]) for i in [0...program.length]
  state.I = 0
  state.PC = programStart
  fetchDecodeExecute.tick()

main = () ->

  display = Chip8.Display()
  keyboard = Chip8.Keyboard()
  state = Chip8.State()
  instructions = Chip8.Instructions(display, keyboard, state)
  fetchDecodeExecute = Chip8.FDX(instructions, state)

  loadProgram(fetchDecodeExecute)

# ## Export module

Chip8 = window.Chip8 = if window.Chip8? then window.Chip8 else {}
window.Chip8.main = main
window.Chip8.log = log
