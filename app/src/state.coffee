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

# ## Export module

  {
    memory: memory
    registers: registers
    I: I
    DT: DT
    ST: ST
    PC: PC
    SP: SP
    stack: stack
  }
