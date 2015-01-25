# # Chip8

# author: Peter Urbak <peter@dragonwasrobot.com> <br/>
# version: 2015-01-25

# ## Properties

debug = false
games = [
  #'15PUZZLE' # Each of the 16 buttons map to a block in the game. boring.
  'BLINKY' # F = left, G = right, Y = down 7 = up.
  #'BLITZ' # Basically unplayable.
  'BRIX' # R = left, Y = right.
  'CONNECT4' # R = left, T = place button, Y = right.
  #'GUESS' # I don't get it.
  'HIDDEN' # R = left, T = choose card, Y = right, g = DOWN, 6 = up.
  #'IBM' # Just an IBM logo, nothing to see here.
  'INVADERS' # R = left, T = fire, Y = right.
  #'KALEID' # Kaleidescope demo, pretty cool.
  #'MAZE' # Random maze generator, also cool.
  #'MERLIN' # R = upper left, T = upper right, F = lower left, G = lower right.
  #'MISSILE' # G = fire.
  'PONG' # R = down left, 5 = up left, U = down right, 8 = up right.
  #'PONG2' # R = down left, 5 = up left, U = down right, 8 = up right.
  #'PUZZLE' # Can't be bothered.
  #'SYZYGY' # F = left, G = right, Y = down 7 = up, J = start. Broken snake.
  #'TANK' # Shit.
  'TETRIS' # T = left, Y = right, R = rotate, F = down.
  'TICTAC' # 567 = top row, RTY = middle row, FGH = bottom row.
  #'UFO' # Meh.
  #'VBRIX' # Meh.
  #'VERS' # Meh.
  #'WIPEOFF' # Meh.
]

# ## Functions

log = (string) -> if debug then console.log string

loadProgram = (fetchDecodeExecute, game) ->
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

run = (game) ->

  state = Chip8.State()
  display = Chip8.Display()
  keyboard = Chip8.Keyboard()
  timers = Chip8.Timers(state)
  instructions = Chip8.Instructions(display, keyboard, state, timers)
  fetchDecodeExecute = Chip8.FDX(instructions, state)

  loadProgram(fetchDecodeExecute, game)

# ## Export module

Chip8 = window.Chip8 = if window.Chip8? then window.Chip8 else {}
window.Chip8.run = run
window.Chip8.log = log
window.Chip8.games = games
