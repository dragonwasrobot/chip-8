# # Instructions

# author: Peter Urbak <peter@dragonwasrobot.com>
# version: 2015-01-10

window.Chip8 = if window.Chip8? then window.Chip8 else {}
window.Chip8.Instructions = (display, keyboard, state) ->

  log = window.Chip8.log

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
  inst_0nnn_SYS = (addr) -> undefined

  # #### 00E0 - CLS

  # Clear the display.
  inst_00E0_CLS = () ->
    log 'inside inst_00E0_CLS'
    display.clearCells()

  # #### 00EE - RET

  # Return from a subroutine.
  #
  # The interpreter sets the program counter to the address at the top of the
  # stack, then subtracts 1 from the stack pointer.
  inst_00EE_RET = () ->
    log 'inside inst_00EE_RET'
    state.PC = state.stack[state.SP]
    state.SP -= 1

  # #### 1nnn - JP addr

  # Jump to location nnn.
  #
  # The interpreter sets the program counter to nnn.
  inst_1nnn_JP = (nnn) ->
    log "Instructions->inst_1nnn_JP: Setting PC = #{nnn}"
    state.PC = nnn
    state.PC -= 2

  # #### 2nnn - CALL addr

  # Call subroutine at nnn.
  #
  # The interpreter increments the stack pointer, then puts the current PC on
  # the top of the stack. The PC is then set to nnn.
  inst_2nnn_CALL = (nnn) ->
    log "Instructions->inst_2nnn_CALL: SP=#{state.SP+1},
      stack[#{state.SP + 1}]=#{state.PC} and PC=#{nnn}"
    state.SP += 1
    state.stack[state.SP] = state.PC
    state.PC = nnn
    state.PC -= 2

  # #### 3xkk - SE Vx, byte

  # Skip next instruction if Vx = kk.
  #
  # The interpreter compares register Vx to kk, and if they are equal,
  # increments the program counter by 2.
  inst_3xkk_SE = (x, kk) ->
    log "Instructions->inst_3xkk_SE: Skips next instruction if V#{x}
      (#{state.registers[x]}) is #{kk}"
    (state.PC += 2) if state.registers[x] is kk

  # #### 4xkk - SNE Vx, byte

  # Skip next instruction if Vx != kk.
  #
  # The interpreter compares register Vx to kk, and if they are not equal,
  # increments the program counter by 2.
  inst_4xkk_SNE = (x, kk) ->
    log 'Instructions->inst_4xkk_SNE'
    (state.PC += 2) if state.registers[x] isnt kk

  # #### 5xy0 - SE Vx, Vy

  # Skip next instruction if Vx = Vy.
  #
  # The interpreter compares register Vx to register Vy, and if they are equal,
  # increments the program counter by 2.
  inst_5xy0_SE = (x, y) ->
    log 'Instructions->inst_5xy0_SE'
    (state.PC += 2) if state.registers[x] is state.registers[y]

  # #### 6xkk - LD Vx, byte

  # Set Vx = kk.
  #
  # The interpreter puts the value kk into register Vx.
  inst_6xkk_LD = (x, kk) ->
    log "Instructions->inst_6xkk_LD: Setting V#{x} = #{kk}"
    state.registers[x] = kk

  # #### 7xkk - ADD Vx, byte

  # Set Vx = Vx + kk.
  #
  # Adds the value kk to the value of register Vx, then stores the result in Vx.
  inst_7xkk_ADD = (x, kk) ->
    log "Instructions->inst_7xkk_ADD:
      Setting V#{x} = #{(state.registers[x] + kk) % 256}"
    state.registers[x] = (state.registers[x] + kk) % 256

  # #### 8xy0 - LD Vx, Vy

  # Set Vx = Vy.
  #
  # Stores the value of register Vy in register Vx.
  inst_8xy0_LD = (x, y) ->
    log 'Instructions->inst_8xy0_LD'
    state.registers[x] = state.registers[y]

  # #### 8xy1 - OR Vx, Vy

  # Set Vx = Vx OR Vy.
  #
  # Performs a bitwise OR on the values of Vx and Vy, then stores the result in
  # Vx.
  inst_8xy1_OR = (x, y) ->
    log 'Instructions->inst_8xy1_OR'
    state.registers[x] |= state.registers[y]

  # #### 8xy2 - AND Vx, Vy

  # Set Vx = Vx AND Vy.
  #
  # Performs a bitwise AND on the values of Vx and Vy, then stores the result in
  # Vx.
  inst_8xy2_AND = (x, y) ->
    log 'Instructions->inst_8xy2_AND'
    state.registers[x] &= state.registers[y]

  # #### 8xy3 - XOR Vx, Vy

  # Set Vx = Vx XOR Vy.
  #
  # Performs a bitwise exclusive OR on the values of Vx and Vy, then stores the
  # result in Vx.
  inst_8xy3_XOR = (x, y) ->
    log 'Instructions->inst_8xy3_XOR'
    state.registers[x] ^= state.registers[y]

  # #### 8xy4 - ADD Vx, Vy

  # Set Vx = Vx + Vy, set VF = carry.
  #
  # The values of Vx and Vy are added together. If the result is greater than 8
  # bits (i.e., > 255,) VF is set to 1, otherwise 0. Only the lowest 8 bits of
  # the result are kept, and stored in Vx.
  inst_8xy4_ADD = (x, y) ->
    log 'Instructions->inst_8xy4_ADD'
    if (state.registers[x] + state.registers[y]) > 255
      state.registers[15] = 1
    else
      state.registers[15] = 0
    state.registers[x] = (state.registers[x] + state.registers[y]) % 256

  # #### 8xy5 - SUB Vx, Vy

  # Set Vx = Vx - Vy, set VF = NOT borrow.
  #
  # If Vx > Vy, then VF is set to 1, otherwise 0. Then Vy is subtracted from Vx,
  # and the results stored in Vx.
  inst_8xy5_SUB = (x, y) ->
    log 'Instructions->inst_8xy5_SUB'
    if state.registers[x] > state.registers[y]
      state.registers[15] = 1
    else
      state.registers[15] = 0
    state.registers[x] = state.registers[x] - state.registers[y]
    if state.registers[x] < 0 then state.registers[x] += 256

  # #### 8xy6 - SHR Vx

  # Set Vx = Vx SHR 1.
  #
  # If the least-significant bit of Vx is 1, then VF is set to 1, otherwise 0.
  # Then Vx is divided by 2.
  inst_8xy6_SHR = (x) ->
    log 'Instructions->inst_8xy6_SHR'
    LSB = state.registers[x] % 2
    state.registers[15] = if LSB is 1 then 1 else 0
    state.registers[x] = Math.floor(state.registers[x] / 2)

  # #### 8xy7 - SUBN Vx, Vy

  # Set Vx = Vy - Vx, set VF = NOT borrow.
  #
  # If Vy > Vx, then VF is set to 1, otherwise 0. Then Vx is subtracted from Vy,
  # and the results stored in Vx.
  inst_8xy7_SUBN = (x, y) ->
    log 'Instructions->inst_8xy7_SUBN'
    if state.registers[y] > state.registers[x]
      state.registers[15] = 1
    else
      state.registers[15] = 0
    state.registers[x] = state.registers[y] - state.registers[x]
    if state.registers[x] < 0 then state.registers[x] += 256

  # #### 8xyE - SHL Vx

  # Set Vx = Vx SHL 1.
  #
  # If the most-significant bit of Vx is 1, then VF is set to 1, otherwise to 0.
  # Then Vx is multiplied by 2.
  inst_8xyE_SHL = (x) ->
    log 'Instructions->inst_8xyE_SHL'
    MSB = (state.registers[x] >> 7)
    state.registers[15] = if MSB is 1 then 1 else 0
    state.registers[x] = (state.registers[x] * 2) % 256

  # #### 9xy0 - SNE Vx, Vy

  # Skip next instruction if Vx != Vy.
  #
  # The values of Vx and Vy are compared, and if they are not equal, the program
  # counter is increased by 2.
  inst_9xy0_SNE = (x, y) ->
    log 'Instructions->inst_9xy0_SNE'
    (state.PC += 2) if (state.registers[x] isnt state.registers[y])

  # #### Annn - LD I, addr

  # Set I = nnn.
  #
  # The value of register I is set to nnn.
  inst_Annn_LD = (nnn) ->
    log "Instructions->inst_Annn_LD: Sets I = #{state.nnn}"
    state.I = nnn

  # #### Bnnn - JP V0, addr

  # Jump to location nnn + V0.
  #
  # The program counter is set to nnn plus the value of V0.
  inst_Bnnn_JP = (nnn) ->
    log 'Instructions->inst_Bnnn_JP'
    inst_1nnn_JP(nnn + state.registers[0])

  # #### Cxkk - RND Vx, byte

  # Set Vx = random byte AND kk.
  #
  # The interpreter generates a random number from 0 to 255, which is then ANDed
  # with the value kk. The results are stored in Vx. See instruction 8xy2 for
  # more information on AND.
  inst_Cxkk_RND = (x, kk) ->
    log 'Instructions->inst_Cxkk_RND'
    random = Math.floor(Math.random() * 256)
    log "Random: #{random}, KK: #{kk}, result: #{random & kk}"
    state.registers[x] = random & kk

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
  inst_Dxyn_DRW = (x, y, n) ->
    log 'Instructions->inst_Dxyn_DRW'
    log "x: #{x}, y: #{y}, n: #{n}"
    state.registers[15] = 0

    hexToBitPattern = (num) ->
      paddingByte = '00000000'
      (paddingByte + num.toString(2)) # convert num to binary and pad zeroes
        .slice(-8) # reduce to one byte
        .split('') # turn into char array
        .map (char) -> parseInt(char) # parse chars into bits

    setBit = (x, y, newValue) ->
      oldValue = display.getCell(x, y).value
      if state.registers[15] is 0 and oldValue is 1 and newValue is 1
        state.registers[15] = 1
      x = if x > display.width - 1 then x - display.width else x
      y = if y > display.height - 1 then y - display.height else y
      display.setCell { column: x, row: y, value: oldValue ^ newValue }

    sprites = []
    (sprites[i] = state.memory[state.I + i]) for i in [0...n]
    for sprite, row in sprites
      bits = hexToBitPattern(sprite)
      for bit, column in bits
        setBit((state.registers[x] + column) % display.width,
          (state.registers[y] + row) % display.height, bit)

    display.drawCells()

  # #### Ex9E - SKP Vx

  # Skip next instruction if key with the value of Vx is pressed.
  #
  # Checks the keyboard, and if the key corresponding to the value of Vx is
  # currently in the down position, PC is increased by 2.
  inst_Ex9E_SKP = (x) ->
    log 'Instructions->inst_Ex9E_SKP'
    log "x: #{x} -> #{state.registers[x]}"
    log "keys pressed: #{keyboard.getKeysPressed()}"
    if state.registers[x] in keyboard.getKeysPressed() then state.PC += 2

  # #### ExA1 - SKNP Vx

  # Skip next instruction if key with the value of Vx is not pressed.
  #
  # Checks the keyboard, and if the key corresponding to the value of Vx is
  # currently in the up position, PC is increased by 2.
  #
  inst_ExA1_SKNP = (x) ->
    log 'Instructions->inst_ExA1_SKNP'
    log "x: #{x} -> #{state.registers[x]}"
    log "keys pressed: #{keyboard.getKeysPressed()}"
    if state.registers[x] not in keyboard.getKeysPressed() then state.PC += 2

  # #### Fx07 - LD Vx, DT

  # Set Vx = delay timer value.
  #
  # The value of DT is placed into Vx.
  inst_Fx07_LD = (x) ->
    log 'Instructions->inst_Fx07_LD'
    log "DT: #{state.DT}"
    state.registers[x] = state.DT

  # #### Fx0A - LD Vx, K

  # Wait for a key press, store the value of the key in Vx.
  #
  # All execution stops until a key is pressed, then the value of that key is
  # stored in Vx.
  inst_Fx0A_LD = (x) ->
    log 'Instructions->inst_Fx0A_LD'
    key = keyboard.waitForKeyPress()
    state.registers[x] = key

  # #### Fx15 - LD DT, Vx

  # Set delay timer = Vx.
  #
  # DT is set equal to the value of Vx.
  inst_Fx15_LD = (x) ->
    log 'Instructions->inst_Fx15_LD'
    state.DT = state.registers[x]
    delayTimer.start()

  # #### Fx18 - LD ST, Vx

  # Set sound timer = Vx.
  #
  # ST is set equal to the value of Vx.
  inst_Fx18_LD = (x) ->
    log 'Instructions->inst_Fx18_LD'
    state.ST = state.registers[x]
    soundTimer.start()

  # #### Fx1E - ADD I, Vx

  # Set I = I + Vx.
  #
  # The values of I and Vx are added, and the results are stored in I.
  inst_Fx1E_ADD = (x) ->
    log "Instructions->inst_Fx1E_ADD: Sets I = #{state.I + state.registers[x]}"
    state.I += state.registers[x]

  # #### Fx29 - LD F, Vx

  # Set I = location of sprite for digit Vx.
  #
  # The value of I is set to the location for the hexadecimal sprite
  # corresponding to the value of Vx. See section 2.4, Display, for more
  # information on the Chip-8 hexadecimal font.
  inst_Fx29_LD = (x) ->
    log 'Instructions->inst_Fx29_LD'
    state.I = x * 5 # as each sprite is 5 bytes and stored at address 0

  # #### Fx33 - LD B, Vx

  # Store BCD representation of Vx in memory locations I, I+1, and I+2.

  # The interpreter takes the decimal value of Vx, and places the hundreds digit
  # in memory at location in I, the tens digit at location I+1, and the ones
  # digit at location I+2.
  inst_Fx33_LD = (x) ->
    log "Instructions->inst_Fx33_LD: Stores BCD rep of V#{x} in memory[#{state.I}]"
    state.memory[state.I] = Math.floor(state.registers[x] / 100)
    state.memory[state.I + 1] = Math.floor((state.registers[x] % 100) / 10)
    state.memory[state.I + 2] = (state.registers[x] % 10)

  # #### Fx55 - LD [I], Vx

  # Store registers V0 through Vx in memory starting at location I.
  #
  # The interpreter copies the values of registers V0 through Vx into memory,
  # starting at the address in I.
  inst_Fx55_LD = (x) ->
    log 'Instructions->inst_Fx55_LD'
    (state.memory[state.I + i] = state.registers[i]) for i in [0..x]

  # #### Fx65 - LD Vx, [I]

  # Read registers V0 through Vx from memory starting at location I.
  #
  # The interpreter reads values from memory starting at location I into
  # registers V0 through Vx.
  inst_Fx65_LD = (x) ->
    log 'Instructions->inst_Fx65_LD'
    log "#{state.registers[i] for i in [0..x]}"
    log "#{state.memory[state.I + i] for i in [0..x]}"
    (state.registers[i] = state.memory[state.I + i]) for i in [0..x]
    log "#{state.registers[i] for i in [0..x]}"

  # ### Timers and Sounds

  # Chip-8 provides 2 timers, a delay timer and a sound timer.

  # The delay timer is active whenever the delay timer register (DT) is
  # non-zero. This timer does nothing more than subtract 1 from the value of DT
  # at a rate of 60Hz. When DT reaches 0, it deactivates.

  delayTimer = {}
  delayTimer.running = false
  delayTimer.tickLength = (1 / 60) * 1000 # 60 Hz

  delayTimer.start = () ->
    if delayTimer.running is false
      delayTimer.running = true
      delayTimer.tick()

  delayTimer.tick = () ->
    if delayTimer.running and state.DT > 0
      state.DT -= 1
      setTimeout(delayTimer.tick, delayTimer.tickLength)
    else
      delayTimer.running = false

  # The sound timer is active whenever the sound timer register (ST) is
  # non-zero. This timer also decrements at a rate of 60Hz, however, as long as
  # ST's value is greater than zero, the Chip-8 buzzer will sound. When ST
  # reaches zero, the sound timer deactivates.

  # The sound produced by the Chip-8 interpreter has only one tone. The
  # frequency of this tone is decided by the author of the interpreter.

  soundTimer = {}
  soundTimer.audioContext = undefined
  soundTimer.tickLength = (1 / 60) * 1000 # 60 Hz

  soundTimer.start = () ->
    if soundTimer.audioContext?
      oscillator = soundTimer.audioContext.createOscillator()
      oscillator.connect(soundTimer.audioContext.destination)
      oscillator.type = oscillator.SQUARE
      oscillator.noteOn(0)
      setTimeout( (() ->
        oscillator.noteOff(0)
        state.ST = 0),
        soundTimer.tickLength * state.ST)
    else
      console.log "Beep!"

  # ## Initialize and export module

  do () ->
    if window.AudioContext? then soundTimer.audioContext = new AudioContext()

  {
    inst_0nnn_SYS: inst_0nnn_SYS
    inst_00E0_CLS: inst_00E0_CLS
    inst_00EE_RET: inst_00EE_RET
    inst_1nnn_JP: inst_1nnn_JP
    inst_2nnn_CALL: inst_2nnn_CALL
    inst_3xkk_SE: inst_3xkk_SE
    inst_4xkk_SNE: inst_4xkk_SNE
    inst_5xy0_SE: inst_5xy0_SE
    inst_6xkk_LD: inst_6xkk_LD
    inst_7xkk_ADD: inst_7xkk_ADD
    inst_8xy0_LD: inst_8xy0_LD
    inst_8xy1_OR: inst_8xy1_OR
    inst_8xy2_AND: inst_8xy2_AND
    inst_8xy3_XOR: inst_8xy3_XOR
    inst_8xy4_ADD: inst_8xy4_ADD
    inst_8xy5_SUB: inst_8xy5_SUB
    inst_8xy6_SHR: inst_8xy6_SHR
    inst_8xy7_SUBN: inst_8xy7_SUBN
    inst_8xyE_SHL: inst_8xyE_SHL
    inst_9xy0_SNE: inst_9xy0_SNE
    inst_Annn_LD: inst_Annn_LD
    inst_Bnnn_JP: inst_Bnnn_JP
    inst_Cxkk_RND: inst_Cxkk_RND
    inst_Dxyn_DRW: inst_Dxyn_DRW
    inst_Ex9E_SKP: inst_Ex9E_SKP
    inst_ExA1_SKNP: inst_ExA1_SKNP
    inst_Fx07_LD: inst_Fx07_LD
    inst_Fx0A_LD: inst_Fx0A_LD
    inst_Fx15_LD: inst_Fx15_LD
    inst_Fx18_LD: inst_Fx18_LD
    inst_Fx1E_ADD: inst_Fx1E_ADD
    inst_Fx29_LD: inst_Fx29_LD
    inst_Fx33_LD: inst_Fx33_LD
    inst_Fx55_LD: inst_Fx55_LD
    inst_Fx65_LD: inst_Fx65_LD
  }
