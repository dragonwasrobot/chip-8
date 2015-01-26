# # Chip8

# author: Peter Urbak <peter@dragonwasrobot.com> <br/>
# version: 2015-01-25

# ## Properties

debug = false

games = { # title: keyMapping
  'BLINKY': {
    37: 7 # left
    38: 3 # up
    39: 8 # right
    40: 6 # down
  }
  'BRIX': {
    37: 4 # left
    39: 6 # right
  }
  'CONNECT4': {
    37: 4 # left
    32: 5 # place piece
    39: 6 # right
  }
  'HIDDEN': {
    37: 4 # left
    32: 5 # choose card
    39: 6 # right
    40: 8 # down
    38: 2 # up
  }
  'INVADERS': {
    37: 4 # left
    32: 5 # place piece
    39: 6 # right
  }
  'PONG': {
    87: 1 # W = left player up
    83: 4 # S = left player down
    73: 12 # I = right player up
    75: 13 # K = right player down
  }
  'TETRIS': {
    37: 5 # left
    39: 6 # right
    32: 4 # rotate
    40: 7 # down
  }
  'TICTAC': {
    # top row
    53:  1
    54:  2
    55:  3
    # middle row
    82:  4
    84:  5
    89:  6
    # bottom row
    70:  7
    71:  8
    72:  9
  }

  #'15PUZZLE' # Each of the 16 buttons map to a block in the game. boring.
  #'BLITZ' # Basically unplayable.
  #'GUESS' # I don't get it.
  #'IBM' # Just an IBM logo, nothing to see here.
  #'KALEID' # Kaleidescope demo, pretty cool.
  #'MAZE' # Random maze generator, also cool.
  #'MERLIN' # R = upper left, T = upper right, F = lower left, G = lower right.
  #'MISSILE' # G = fire.
  #'PONG2' # R = down left, 5 = up left, U = down right, 8 = up right.
  #'PUZZLE' # Can't be bothered.
  #'SYZYGY' # F = left, G = right, Y = down 7 = up, J = start. Broken snake.
  #'TANK' # Shit.
  #'UFO' # Meh.
  #'VBRIX' # Meh.
  #'VERS' # Meh.
  #'WIPEOFF' # Meh.
}

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
  keyMapping = games[game]
  state = Chip8.State()
  display = Chip8.Display()
  keyboard = Chip8.Keyboard(keyMapping)
  timers = Chip8.Timers(state)
  instructions = Chip8.Instructions(display, keyboard, state, timers)
  fetchDecodeExecute = Chip8.FDX(instructions, state)

  loadProgram(fetchDecodeExecute, game)

# ## Export module

Chip8 = window.Chip8 = if window.Chip8? then window.Chip8 else {}
window.Chip8.run = run
window.Chip8.log = log
window.Chip8.games = games
