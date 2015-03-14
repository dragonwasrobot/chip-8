# # Keyboard

# author: Peter Urbak <peter@dragonwasrobot.com>
# version: 2015-01-08

window.Chip8 = if window.Chip8? then window.Chip8 else {}
window.Chip8.Keyboard = (state, keyMapping) ->

  log = window.Chip8.log

  # ## Properties

  # Computers using the Chip-8 language had a 16-key hexadecimal keypad with the
  # following layout:

  #     |---|---|---|---|
  #     | 1 | 2 | 3 | C |
  #     |---|---|---|---|
  #     | 4 | 5 | 6 | D |
  #     |---|---|---|---|
  #     | 7 | 8 | 9 | E |
  #     |---|---|---|---|
  #     | A | 0 | B | F |
  #     |---|---|---|---|

  # We create a specific mapping per game, since the 16-key keypad is unusual.

  keysPressed = {
    0: false
    1: false
    2: false
    3: false
    4: false
    5: false
    6: false
    7: false
    8: false
    9: false
    10: false
    11: false
    12: false
    13: false
    14: false
    15: false
  }

  # ## Functions

  addKeyPress = (keyCode) ->
    if keyCode of keyMapping then keysPressed[keyMapping[keyCode]] = true

  removeKeyPress = (keyCode) ->
    if keyCode of keyMapping then keysPressed[keyMapping[keyCode]] = false

  getKeysPressed = () ->
    filteredKeys = Object.keys(keysPressed).
      filter( (keyCode) -> keysPressed[keyCode] is true ).
      map( (keyCode) -> parseInt(keyCode) )

  waitForKeyPress = (callback) ->
    state.waitingForInput = true
    keysPressed = getKeysPressed()

    if state.waitingForInput and keysPressed.length > 0
      state.waitingForInput = false
      callback keysPressed[0]
    else
      waitLength = 100
      setTimeout((-> waitForKeyPress(callback)), waitLength)

  # ## Initialize and export module

  do () ->
    window.onkeydown = (e) ->
      addKeyPress(if e.keyCode then e.keyCode else e.which)

    window.onkeyup = (e) ->
      removeKeyPress(if e.keyCode then e.keyCode else e.which)

  {
    getKeysPressed: getKeysPressed
    waitForKeyPress: waitForKeyPress
  }
