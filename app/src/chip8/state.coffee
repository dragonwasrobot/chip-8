# # State

# author: Peter Urbak <peter@dragonwasrobot.com>
# version: 2015-01-10

window.Chip8 = if window.Chip8? then window.Chip8 else {}
window.Chip8.State = () ->

  log = window.Chip8.log

  # ## Memory

  # Memory address range from 200h to FFFh (3,584 bytes) since the first 512
  # bytes (0x200) are reserved for the CHIP-8 interpreter:

  # - FFF = 4096 bytes.
  # - 200 = 512 bytes.
  # - FFF - 200 = 3584 bytes.

  memorySize = 4096
  memory = (0 for i in [0...memorySize])

  # ## Registers

  # The 16 8-bit data registers.

  registerCount = 16
  registers = (0 for i in [0...registerCount])

  # V0, V1, V2, V3, V4, V5, V6, V7, V8, V9, VA, VB, VC, VD, BE, and VF, where VF
  # doubles as a carry flag and thus shouldn't be used by any program.

  # The 16-bit address register, called I.

  I = 0

  # The two special purpose registers for delay and sound timers.

  # When the registers are non-zero, they are automatically decremented at a
  # rate of 60Hz.

  DT = 0
  ST = 0

  # The program counter (PC, 16-bit) and stack pointer (SP, 8-bit).

  PC = 0
  SP = 0

  # The stack.

  # It is a 16-bit valued array of length 16 used for storing the address that
  # the interpreter should return to when finished with a subroutine. Chip-8
  # allows for up to 16 levels of nested subroutines.

  stackSize = 16
  stack = (0 for i in [0...stackSize])

  # ## Display

  # Chip-8 draws graphics on screen through the use of sprites. A sprite is a
  # group of bytes which are a binary representation of the desired
  # picture. Chip-8 sprites may be up to 15 bytes, for a possible sprite size of
  # 8x15.

  # Programs may also refer to a group of sprites representing the hexadecimal
  # digits 0 through F. These sprites are 5 bytes long, or 8x5 pixels. The data
  # should be stored in the interpreter area of Chip-8 memory (0x000 to
  # 0x1FF). Below is a listing of each character's bytes, in binary and
  # hexadecimal:

  # Declare the built-in sprites and put them into Chip-8 memory

  addSpritesToMemory = () ->

    sprites = [
      0xF0, 0x90, 0x90, 0x90, 0xF0, # 0: 0-4
      0x20, 0x60, 0x20, 0x20, 0x70, # 1: 5-9
      0xF0, 0x10, 0xF0, 0x80, 0xF0, # 2: 10-14
      0xF0, 0x10, 0xF0, 0x10, 0xF0, # 3: 15-19
      0x90, 0x90, 0xF0, 0x10, 0x10, # 4: 20-24
      0xF0, 0x80, 0xF0, 0x10, 0xF0, # 5: 25-29
      0xF0, 0x80, 0xF0, 0x90, 0xF0, # 6: 30-34
      0xF0, 0x10, 0x20, 0x40, 0x40, # 7: 35-39
      0xF0, 0x90, 0xF0, 0x90, 0xF0, # 8: 40-44
      0xF0, 0x90, 0xF0, 0x10, 0xF0, # 9: 45-49
      0xF0, 0x90, 0xF0, 0x90, 0x90, # A: 50-54
      0xE0, 0x90, 0xE0, 0x90, 0xE0, # B: 55-59
      0xF0, 0x80, 0x80, 0x80, 0xF0, # C: 60-64
      0xE0, 0x90, 0x90, 0x90, 0xE0, # D: 65-69
      0xF0, 0x80, 0xF0, 0x80, 0xF0, # E: 70-74
      0xF0, 0x80, 0xF0, 0x80, 0x80  # F: 75-79
    ]

    (memory[i] = sprites[i]) for i in [0...sprites.length]

  # Flags
  waitingForInput = false
  running = false

  clear = () ->
    waitingForInput = false
    window.Chip8.runtime.state.running = false
    I = 0
    window.Chip8.runtime.state.DT = 0
    ST = 0
    PC = 0
    SP = 0
    memory = (0 for i in [0...memorySize])
    registers = (0 for i in [0...registerCount])
    stack = (0 for i in [0...stackSize])
    addSpritesToMemory()

  # ## Initialize and export module

  do () ->
    addSpritesToMemory()

  {
    memory: memory
    registers: registers
    I: I
    DT: DT
    ST: ST
    PC: PC
    SP: SP
    stack: stack
    waitingForInput: waitingForInput
    running: running
    clear: clear
  }
