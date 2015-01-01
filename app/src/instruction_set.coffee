# This is a Chip-8 emulator.

# Reference material for the Chip-8 specification:
# [Chip-8 Technical Reference](http://devernay.free.fr/hacks/chip8/C8TECH10.HTM)

# ## Chip-8 Instruction set and memory

class InstructionSet

  # ### Memory

  # Memory address range from 200h to FFFh (3,584 bytes) since the first 512
  # bytes (0x200) are reserved for the CHIP-8 interpreter:

  # - FFF = 4096 bytes.
  # - 200 = 512 bytes.
  # - FFF - 200 = 3584 bytes.

  memorySize: 4096
  memory: (0 for i in [0...@memorySize])

  # ## Registers

  # The 16 8-bit data registers.

  registerCount: 16
  registers: (0 for i in [0...@registerCount])

  # V0, V1, V2, V3, V4, V5, V6, V7, V8, V9, VA, VB, VC, VD, BE,
  # and VF, where VF doubles as a carry flag and thus shouldn't be used by any
  # program.

  # The 16-bit address register, called I.

  I: 0

  # The two special purpose registers for delay and sound timers.

  # When the registers are non-zero, they are automatically decremented at a
  # rate of 60Hz.

  # We've put the actual registers inside the delay and sound timers, which we
  # will cover later.
  delayTimer: undefined
  soundTimer: undefined

  # The program counter (PC, 16-bit) and stack pointer (SP, 8-bit).

  PC: 0
  SP: 0

  # The stack.

  # It is a 16-bit valued array of length 16 used for storing the address that
  # the interpreter should return to when finished with a subroutine. Chip-8
  # allows for up to 16 levels of nested subroutines.

  stackSize: 16
  stack: (0 for i in [0...@stackSize])

  # Initialize instruction set

  constructor: (@display, @keyboard) ->
    @reset()

  reset: () ->
    @I = 0  # 'I' register

    @PC = 0 # Program counter
    @SP = 0 # Stack pointer

    @delayTimer = new DelayTimer()
    @soundTimer = new SoundTimer()

    @memory = (0 for i in [0...@memorySize])
    @registers = (0 for i in [0...@registerCount])
    @stack = (0 for i in [0...@stackSize])
    @inst_00E0_CLS()
    @addSpritesToMemory()

  incrementPC: () ->
    @PC += 2

  # ### Display

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

  addSpritesToMemory: () ->

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

    (@memory[i] = sprites[i]) for i in [0...sprites.length]

  # ### Instructions

  # All instructions are 2 bytes long and are stored most-significant-byte
  # first.

  # In memory, the first byte of each instruction should be located at an even
  # address.

  # If a program includes sprite data, it should be padded so any instructions
  # following it will be properly situated in RAM.

  # Variables used in the following instructions:

  # - nnn or addr - A 12-bit value, the lowest 12 bits of the instruction
  # - n or nibble - A 4-bit value, the lowest 4 bits of the instruction
  # - x - A 4-bit value, the lower 4 bits of the high byte of the instruction
  # - y - A 4-bit value, the upper 4 bits of the low byte of the instruction
  # - kk or byte - An 8-bit value, the lowest 8 bits of the instruction

  # Below, all instructions are listed along with their informal descriptions
  # and their implementations.

  # #### 0nnn - SYS addr

  # Jump to a machine code routine at nnn.
  #
  # This instruction is only used on the old computers on which Chip-8 was
  # originally implemented. It is ignored by modern interpreters.
  inst_0nnn_SYS: (addr) -> undefined

  # #### 00E0 - CLS

  # Clear the display.
  inst_00E0_CLS: () ->
    # log('inside inst_00E0_CLS')
    @display.clear()

  # #### 00EE - RET

  # Return from a subroutine.
  #
  # The interpreter sets the program counter to the address at the top of the
  # stack, then subtracts 1 from the stack pointer.
  inst_00EE_RET: () ->
    log('inside inst_00EE_RET')
    @PC = @stack[@SP]
    @SP -= 1

  # #### 1nnn - JP addr

  # Jump to location nnn.
  #
  # The interpreter sets the program counter to nnn.
  inst_1nnn_JP: (nnn) ->
    log("inside inst_1nnn_JP: Setting PC = #{nnn}")
    @PC = nnn - 2

  # #### 2nnn - CALL addr

  # Call subroutine at nnn.
  #
  # The interpreter increments the stack pointer, then puts the current PC on
  # the top of the stack. The PC is then set to nnn.
  inst_2nnn_CALL: (nnn) ->
    log("inside inst_2nnn_CALL: SP=#{@SP+1}, stack[#{@SP + 1}]=#{@PC} and PC=#{nnn}")
    @SP += 1
    @stack[@SP] = @PC
    @PC = nnn - 2

  # #### 3xkk - SE Vx, byte

  # Skip next instruction if Vx = kk.
  #
  # The interpreter compares register Vx to kk, and if they are equal,
  # increments the program counter by 2.
  inst_3xkk_SE: (x, kk) ->
    log("inside inst_3xkk_SE: Skips next instruction if V#{x} (#{@registers[x]}) is #{kk}")
    (@PC += 2) if @registers[x] is kk

  # #### 4xkk - SNE Vx, byte

  # Skip next instruction if Vx != kk.
  #
  # The interpreter compares register Vx to kk, and if they are not equal,
  # increments the program counter by 2.
  inst_4xkk_SNE: (x, kk) ->
    log('inside inst_4xkk_SNE')
    (@PC += 2) if @registers[x] isnt kk

  # #### 5xy0 - SE Vx, Vy

  # Skip next instruction if Vx = Vy.
  #
  # The interpreter compares register Vx to register Vy, and if they are equal,
  # increments the program counter by 2.
  inst_5xy0_SE: (x, y) ->
    log('inside inst_5xy0_SE')
    (@PC += 2) if @registers[x] is @registers[y]

  # #### 6xkk - LD Vx, byte

  # Set Vx = kk.
  #
  # The interpreter puts the value kk into register Vx.
  inst_6xkk_LD: (x, kk) ->
    log("inside inst_6xkk_LD: Setting V#{x} = #{kk}")
    @registers[x] = kk

  # #### 7xkk - ADD Vx, byte

  # Set Vx = Vx + kk.
  #
  # Adds the value kk to the value of register Vx, then stores the result in Vx.
  inst_7xkk_ADD: (x, kk) ->
    log("inside inst_7xkk_ADD: Setting V#{x} = #{(@registers[x] + kk) % 256}")
    @registers[x] = (@registers[x] + kk) % 256

  # #### 8xy0 - LD Vx, Vy

  # Set Vx = Vy.
  #
  # Stores the value of register Vy in register Vx.
  inst_8xy0_LD: (x, y) =>
    log('inside inst_8xy0_LD')
    @registers[x] = @registers[y]

  # #### 8xy1 - OR Vx, Vy

  # Set Vx = Vx OR Vy.
  #
  # Performs a bitwise OR on the values of Vx and Vy, then stores the result in
  # Vx.
  inst_8xy1_OR: (x, y) =>
    log('inside inst_8xy1_OR')
    @registers[x] |= @registers[y]

  # #### 8xy2 - AND Vx, Vy

  # Set Vx = Vx AND Vy.
  #
  # Performs a bitwise AND on the values of Vx and Vy, then stores the result in
  # Vx.
  inst_8xy2_AND: (x, y) =>
    log('inside inst_8xy2_AND')
    @registers[x] &= @registers[y]

  # #### 8xy3 - XOR Vx, Vy

  # Set Vx = Vx XOR Vy.
  #
  # Performs a bitwise exclusive OR on the values of Vx and Vy, then stores the
  # result in Vx.
  inst_8xy3_XOR: (x, y) =>
    log('inside inst_8xy3_XOR')
    @registers[x] ^= @registers[y]

  # #### 8xy4 - ADD Vx, Vy

  # Set Vx = Vx + Vy, set VF = carry.
  #
  # The values of Vx and Vy are added together. If the result is greater than 8
  # bits (i.e., > 255,) VF is set to 1, otherwise 0. Only the lowest 8 bits of
  # the result are kept, and stored in Vx.
  inst_8xy4_ADD: (x, y) =>
    log('inside inst_8xy4_ADD')
    @registers[15] = if (@registers[x] + @registers[y]) > 255 then 1 else 0
    @registers[x] = (@registers[x] + @registers[y]) % 256

  # #### 8xy5 - SUB Vx, Vy

  # Set Vx = Vx - Vy, set VF = NOT borrow.
  #
  # If Vx > Vy, then VF is set to 1, otherwise 0. Then Vy is subtracted from Vx,
  # and the results stored in Vx.
  inst_8xy5_SUB: (x, y) =>
    log('inside inst_8xy5_SUB')
    @registers[15] = if @registers[x] > @registers[y] then 1 else 0
    @registers[x] = @registers[x] - @registers[y]
    if @registers[x] < 0 then @registers[x] += 256

  # #### 8xy6 - SHR Vx

  # Set Vx = Vx SHR 1.
  #
  # If the least-significant bit of Vx is 1, then VF is set to 1, otherwise 0.
  # Then Vx is divided by 2.
  inst_8xy6_SHR: (x) =>
    log('inside inst_8xy6_SHR')
    LSB = @registers[x] % 2
    @registers[15] = if LSB is 1 then 1 else 0
    @registers[x] = Math.floor(@registers[x] / 2)

  # #### 8xy7 - SUBN Vx, Vy

  # Set Vx = Vy - Vx, set VF = NOT borrow.
  #
  # If Vy > Vx, then VF is set to 1, otherwise 0. Then Vx is subtracted from Vy,
  # and the results stored in Vx.
  inst_8xy7_SUBN: (x, y) =>
    log('inside inst_8xy7_SUBN')
    @registers[15] = if @registers[y] > @registers[x] then 1 else 0
    @registers[x] = @registers[y] - @registers[x]
    if @registers[x] < 0 then @registers[x] += 256

  # #### 8xyE - SHL Vx

  # Set Vx = Vx SHL 1.
  #
  # If the most-significant bit of Vx is 1, then VF is set to 1, otherwise to 0.
  # Then Vx is multiplied by 2.
  inst_8xyE_SHL: (x) =>
    log('inside inst_8xyE_SHL')
    MSB = (@registers[x] >> 7)
    @registers[15] = if MSB is 1 then 1 else 0
    @registers[x] = (@registers[x] * 2) % 256

  # #### 9xy0 - SNE Vx, Vy

  # Skip next instruction if Vx != Vy.
  #
  # The values of Vx and Vy are compared, and if they are not equal, the program
  # counter is increased by 2.
  inst_9xy0_SNE: (x, y) ->
    log('inside inst_9xy0_SNE')
    (@PC += 2) if (@registers[x] isnt @registers[y])

  # #### Annn - LD I, addr

  # Set I = nnn.
  #
  # The value of register I is set to nnn.
  inst_Annn_LD: (nnn) ->
    log("inside inst_Annn_LD: Sets I = #{nnn}")
    @I = nnn

  # #### Bnnn - JP V0, addr

  # Jump to location nnn + V0.
  #
  # The program counter is set to nnn plus the value of V0.
  inst_Bnnn_JP: (nnn) ->
    log('inside inst_Bnnn_JP')
    @inst_1nnn_JP(nnn + @registers[0])

  # #### Cxkk - RND Vx, byte

  # Set Vx = random byte AND kk.
  #
  # The interpreter generates a random number from 0 to 255, which is then ANDed
  # with the value kk. The results are stored in Vx. See instruction 8xy2 for
  # more information on AND.
  inst_Cxkk_RND: (x, kk) ->
    log('inside inst_Cxkk_RND')
    random = Math.floor(Math.random() * 256)
    log("Random: #{random}, KK: #{kk}, result: #{random & kk}")
    @registers[x] = random & kk

  # #### Dxyn - DRW Vx, Vy, nibble

  # Display n-byte sprite starting at memory location I at (Vx, Vy),
  # set VF = collision.
  #
  # The interpreter reads n bytes from memory, starting at the address stored in
  # I. These bytes are then displayed as sprites on screen at coordinates (Vx,
  # Vy). Sprites are XORed onto the existing screen. If this causes any pixels
  # to be erased, VF is set to 1, otherwise it is set to 0. If the sprite is
  # positioned so part of it is outside the coordinates of the display, it wraps
  # around to the opposite side of the screen. See instruction 8xy3 for more
  # information on XOR, and section 2.4, Display, for more information on the
  # Chip-8 screen and sprites.
  inst_Dxyn_DRW: (x, y, n) ->
    log('inside inst_Dxyn_DRW')
    log("x: #{x}, y: #{y}, n: #{n}")
    @registers[15] = 0

    hexToBitPattern = (num) ->
      paddingByte = '00000000'
      (paddingByte + num.toString(2)) # convert num to binary and pad zeroes
        .slice(-8) # reduce to one byte
        .split('') # turn into char array
        .map (char) -> parseInt(char) # parse chars into bits

    setBit = (x, y, newValue) =>
      oldValue = @display.getCell(x, y).value
      if @registers[15] is 0 and oldValue is 1 and newValue is 1
        @registers[15] = 1
      x = if x > @display.displayWidth - 1 then x - @display.displayWidth else x
      y = if y > @display.displayHeight - 1 then y - @display.displayHeight else y
      @display.setCell { column: x, row: y, value: oldValue ^ newValue }

    sprites = []
    (sprites[i] = @memory[@I + i]) for i in [0...n]
    for sprite, row in sprites
      bits = hexToBitPattern(sprite)
      for bit, column in bits
        regValueX = @registers[x]
        regValueY = @registers[y]
        setBit((regValueX + column) % 64, (regValueY + row) % 32, bit)

  # #### Ex9E - SKP Vx

  # Skip next instruction if key with the value of Vx is pressed.
  #
  # Checks the keyboard, and if the key corresponding to the value of Vx is
  # currently in the down position, PC is increased by 2.
  inst_Ex9E_SKP: (x) ->
    log('inside inst_Ex9E_SKP')
    log("x: #{x} -> #{@registers[x]}")
    log("keys pressed: #{@keyboard.getKeysPressed()}")
    if @registers[x] in @keyboard.getKeysPressed() then @PC += 2

  # #### ExA1 - SKNP Vx

  # Skip next instruction if key with the value of Vx is not pressed.
  #
  # Checks the keyboard, and if the key corresponding to the value of Vx is
  # currently in the up position, PC is increased by 2.
  #
  inst_ExA1_SKNP: (x) ->
    log('inside inst_ExA1_SKNP')
    log("x: #{x} -> #{@registers[x]}")
    log("keys pressed: #{@keyboard.getKeysPressed()}")
    if @registers[x] not in @keyboard.getKeysPressed() then @PC += 2

  # #### Fx07 - LD Vx, DT

  # Set Vx = delay timer value.
  #
  # The value of DT is placed into Vx.
  inst_Fx07_LD: (x) ->
    log('inside inst_Fx07_LD')
    log("DT: #{@delayTimer.get()}")
    @registers[x] = @delayTimer.get()

  # #### Fx0A - LD Vx, K

  # Wait for a key press, store the value of the key in Vx.
  #
  # All execution stops until a key is pressed, then the value of that key is
  # stored in Vx.
  inst_Fx0A_LD: (x) ->
    console.log('inside inst_Fx0A_LD')
    key = @keyboard.waitForKeyPress()
    @registers[x] = key

  # #### Fx15 - LD DT, Vx

  # Set delay timer = Vx.
  #
  # DT is set equal to the value of Vx.
  inst_Fx15_LD: (x) ->
    log('inside inst_Fx15_LD')
    @delayTimer.set(@registers[x])

  # #### Fx18 - LD ST, Vx

  # Set sound timer = Vx.
  #
  # ST is set equal to the value of Vx.
  inst_Fx18_LD: (x) ->
    log('inside inst_Fx18_LD')
    @soundTimer.set(@registers[x])

  # #### Fx1E - ADD I, Vx

  # Set I = I + Vx.
  #
  # The values of I and Vx are added, and the results are stored in I.
  inst_Fx1E_ADD: (x) ->
    log("inside inst_Fx1E_ADD: Sets I = #{@I + @registers[x]}")
    @I += @registers[x]

  # #### Fx29 - LD F, Vx

  # Set I = location of sprite for digit Vx.
  #
  # The value of I is set to the location for the hexadecimal sprite
  # corresponding to the value of Vx. See section 2.4, Display, for more
  # information on the Chip-8 hexadecimal font.
  inst_Fx29_LD: (x) ->
    log('inside inst_Fx29_LD')
    @I = x * 5 # as each sprite is 5 bytes and stored at address 0

  # #### Fx33 - LD B, Vx

  # Store BCD representation of Vx in memory locations I, I+1, and I+2.

  # The interpreter takes the decimal value of Vx, and places the hundreds digit
  # in memory at location in I, the tens digit at location I+1, and the ones
  # digit at location I+2.
  inst_Fx33_LD: (x) ->
    log("inside inst_Fx33_LD: Stores BCD rep of V#{x} in memory[#{@I}]")
    @memory[@I] = Math.floor(@registers[x] / 100)
    @memory[@I + 1] = Math.floor((@registers[x] % 100) / 10)
    @memory[@I + 2] = (@registers[x] % 10)
    log("memory[#{@I}] = #{@memory[@I]}")
    log("memory[#{@I+1}] = #{@memory[@I+1]}")
    log("memory[#{@I+2}] = #{@memory[@I+2]}")

  # #### Fx55 - LD [I], Vx

  # Store registers V0 through Vx in memory starting at location I.
  #
  # The interpreter copies the values of registers V0 through Vx into memory,
  # starting at the address in I.
  inst_Fx55_LD: (x) ->
    log('inside inst_Fx55_LD')
    (@memory[@I + i] = @registers[i]) for i in [0..x]

  # #### Fx65 - LD Vx, [I]

  # Read registers V0 through Vx from memory starting at location I.
  #
  # The interpreter reads values from memory starting at location I into
  # registers V0 through Vx.
  inst_Fx65_LD: (x) ->
    log('inside inst_Fx65_LD')
    log("#{@registers[i] for i in [0..x]}")
    log("#{@memory[@I + i] for i in [0..x]}")
    (@registers[i] = @memory[@I + i]) for i in [0..x]
    log("#{@registers[i] for i in [0..x]}")

# ### Timers and Sounds

  # Chip-8 provides 2 timers, a delay timer and a sound timer.

class DelayTimer

  # The delay timer is active whenever the delay timer register (DT) is
  # non-zero. This timer does nothing more than subtract 1 from the value of DT
  # at a rate of 60Hz. When DT reaches 0, it deactivates.

  _DT: 0
  _running: false
  _tickLength: 1 / 60 # 60 Hz

  constructor: () ->

  _tick: () =>
    log "Delaytimer tick: #{@_DT}"
    if @_running and @_DT > 0
      @_DT -= 1
      setTimeout(@_tick, @_tickLength)
    else
      @_running = false

  set: (delay) ->
    @_DT = delay
    if @_running is false
      @_running = true
      @_tick()

  get: () -> @_DT

class SoundTimer

  # The sound timer is active whenever the sound timer register (ST) is
  # non-zero. This timer also decrements at a rate of 60Hz, however, as long as
  # ST's value is greater than zero, the Chip-8 buzzer will sound. When ST
  # reaches zero, the sound timer deactivates.

  # The sound produced by the Chip-8 interpreter has only one tone. The
  # frequency of this tone is decided by the author of the interpreter.

  # TODO

  _ST: 0
  _running: false
  _tickLength: 1 / 60 # 60 Hz

  constructor: () ->

  _tick: () ->
    if @_running and @_ST > 0
      @_ST -= 1
      setTimeout(@_tick, @_tickLength)
    else
      @_running = false

  set: (delay) ->
    @_ST = delay
    if @_running is false
      @_running = true
      @_tick()

  get: () -> @_ST
