# # Keyboard

# author: Peter Urbak <peter@dragonwasrobot.com>
# version: 2015-01-08

window.Chip8 = if window.Chip8? then window.Chip8 else {}
window.Chip8.Keyboard = () ->

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

  keyMapping = {
    53:  1 # 5 -> 1
    54:  2 # 6 -> 2
    55:  3 # 7 -> 3
    56: 12 # 8 -> C

    82:  4 # R -> 4
    84:  5 # T -> 5
    89:  6 # Y -> 6
    85: 13 # U -> D

    70:  7 # F -> 7
    71:  8 # G -> 8
    72:  9 # H -> 9
    74: 14 # J -> E

    67: 10 # C -> A
    86:  0 # V -> 0
    66: 11 # B -> B
    78: 15 # N -> F
  }

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

  waitForKeyPress = () -> # TODO: Implement with setTimeout and avoid busy wait

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
