# # Keyboard

class Keyboard

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

  constructor: () ->

  # TODO: Figure out how to implement keyboard.
  getKeyPresses = () -> [3, 15]

  waitForKeyPress = () -> 5
