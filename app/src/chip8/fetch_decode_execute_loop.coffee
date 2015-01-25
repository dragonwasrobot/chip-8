# # Fetch-decode-execute loop

# author: Peter Urbak <peter@dragonwasrobot.com>
# version: 2015-01-08

window.Chip8 = if window.Chip8? then window.Chip8 else {}
window.Chip8.FDX = (instructions, state) ->

  log = window.Chip8.log

  # ## Functions

  tick = () ->
    fetchAndExecute()
    window.requestAnimationFrame tick

  handle0 = (opcode) ->
    log 'FDX->handle0'
    if opcode is 0x00E0
      instructions.inst_00E0_CLS()
    else if opcode is 0x00EE
      instructions.inst_00EE_RET()
    else throw new Error("Unknown instruction given: #{toHex(opcode)}")

  handle1 = (opcode) ->
    log 'FDX->handle1'
    nibbles = opcode ^ 0x1000
    instructions.inst_1nnn_JP(nibbles)

  handle2 = (opcode) ->
    log 'FDX->handle2'
    nibbles = opcode ^ 0x2000
    instructions.inst_2nnn_CALL(nibbles)

  handle3 = (opcode) ->
    log 'FDX->handle3'
    nibbles = opcode ^ 0x3000
    x = nibbles >> 8
    kk = nibbles ^ (x << 8)
    instructions.inst_3xkk_SE(x, kk)

  handle4 = (opcode) ->
    log 'FDX->handle4'
    nibbles = opcode ^ 0x4000
    x = nibbles >> 8
    kk = nibbles ^ (x << 8)
    instructions.inst_4xkk_SNE(x, kk)

  handle5 = (opcode) ->
    log 'FDX->handle5'
    if toHex(opcode)[3] isnt '0'
      throw new Error("Unknown instruction given: #{toHex(opcode)}")
    nibbles = opcode ^ 0x5000
    x = nibbles >> 8
    y = (nibbles ^ (x << 8)) >> 4
    instructions.inst_5xy0_SE(x, y)

  handle6 = (opcode) ->
    log 'FDX->handle6'
    nibbles = opcode ^ 0x6000
    x = nibbles >> 8
    kk = nibbles ^ (x << 8)
    instructions.inst_6xkk_LD(x, kk)

  handle7 = (opcode) ->
    log 'FDX->handle7'
    nibbles = opcode ^ 0x7000
    x = nibbles >> 8
    kk = nibbles ^ (x << 8)
    instructions.inst_7xkk_ADD(x, kk)

  handle8 = (opcode) ->
    log 'FDX->handle8'
    nibbles = opcode ^ 0x8000
    x = nibbles >> 8
    y = (nibbles ^ (x << 8)) >> 4
    instDict = {
      0: instructions.inst_8xy0_LD
      1: instructions.inst_8xy1_OR
      2: instructions.inst_8xy2_AND
      3: instructions.inst_8xy3_XOR
      4: instructions.inst_8xy4_ADD
      5: instructions.inst_8xy5_SUB
      6: instructions.inst_8xy6_SHR
      7: instructions.inst_8xy7_SUBN
      E: instructions.inst_8xyE_SHL
    }
    nibble = toHex(opcode)[3]
    log "{x: #{x}, y: #{y}, nibble: #{nibble}}"
    if instDict[nibble]? then instDict[nibble](x, y)
    else throw new Error("Unknown instruction given: #{toHex(opcode)}")

  handle9 = (opcode) ->
    log 'FDX->handle9'
    if toHex(opcode)[3] isnt '0'
      throw new Error("Unknown instruction given: #{toHex(opcode)}")
    nibbles = opcode ^ 0x9000
    x = nibbles >> 8
    y = (nibbles ^ (x << 8)) >> 4
    instructions.inst_9xy0_SNE(x, y)

  handleA = (opcode) ->
    log 'FDX->handleA'
    nibbles = opcode ^ 0xA000
    instructions.inst_Annn_LD(nibbles)

  handleB = (opcode) ->
    log 'FDX->handleB'
    nibbles = opcode ^ 0xB000
    instructions.inst_Bnnn_JP(nibbles)

  handleC = (opcode) ->
    log 'FDX->handleC'
    nibbles = opcode ^ 0xC000
    x = nibbles >> 8
    kk = nibbles ^ (x << 8)
    instructions.inst_Cxkk_RND(x, kk)

  handleD = (opcode) ->
    log 'FDX->handleD'
    nibbles = opcode ^ 0xD000
    x = nibbles >> 8
    y = (nibbles ^ (x << 8)) >> 4
    n = (nibbles ^ (x << 8)) ^ (y << 4)
    instructions.inst_Dxyn_DRW(x, y, n)

  handleE = (opcode) ->
    log 'FDX->handleE'
    nibbles = opcode ^ 0xE000
    x = nibbles >> 8
    y = (nibbles ^ (x << 8)) >> 4
    n = (nibbles ^ (x << 8)) ^ (y << 4)
    log "x: #{x}, #{typeof x}"
    log "y: #{y}, #{typeof y}"
    log "n: #{n}, #{typeof n}"
    if y is 9 and n is 14 then instructions.inst_Ex9E_SKP x
    else if y is 10 and n is 1 then instructions.inst_ExA1_SKNP x
    else throw new Error("Unknown nibbles: #{toHex(nibbles)}")

  handleF = (opcode) ->
    log 'FDX->handleF'
    nibbles = opcode ^ 0xF000
    x = nibbles >> 8
    y = (nibbles ^ (x << 8)) >> 4
    n = (nibbles ^ (x << 8)) ^ (y << 4)
    log "x: #{x}"
    log "y: #{y}"
    log "n: #{n}"
    instructionDict = {
      0: {
        7: instructions.inst_Fx07_LD
        10: instructions.inst_Fx0A_LD
      }
      1: {
        5: instructions.inst_Fx15_LD
        8: instructions.inst_Fx18_LD
        14: instructions.inst_Fx1E_ADD
      }
      2: {
        9: instructions.inst_Fx29_LD
      }
      3: {
        3: instructions.inst_Fx33_LD
      }
      5: {
        5: instructions.inst_Fx55_LD
      }
      6: {
        5: instructions.inst_Fx65_LD
      }
    }

    if instructionDict[y]? and instructionDict[y][n]?
      instructionDict[y][n](x)
    else
      throw new Error("Unknown nibbles: #{toHex(nibbles)}")

  fetchAndExecute = () ->

    handleDict = {
      0: handle0
      1: handle1
      2: handle2
      3: handle3
      4: handle4
      5: handle5
      6: handle6
      7: handle7
      8: handle8
      9: handle9
      A: handleA
      B: handleB
      C: handleC
      D: handleD
      E: handleE
      F: handleF
    }

    performCycle = () ->
      if state.waitingForInput then return

      log "PC: #{state.PC}"
      memory = state.memory
      PC = state.PC
      firstNibble = memory[PC]
      secondNibble = memory[PC + 1]

      opcode = memory[PC] << 8 | memory[PC + 1]
      log "opcode is: #{toHex(opcode)}"
      nibble = if toHex(opcode).length is 4 then toHex(opcode)[0] else 0
      if handleDict[nibble]?
        handleDict[nibble](opcode)
        state.PC += 2
      else
        throw new Error("Unknown instruction given: #{toHex(opcode)}")

    performCycle() for i in [0...10]

  # ### Utility functions

  toHex = (int) -> int.toString(16).toUpperCase()
  toDecimal = (hex) -> parseInt(hex, 16)

  getHexAtIndex = (int, i) ->
    if i < 0 or i > 3 then throw new Error("Bit index out of bounds: #{i}")
    else toHex(int)[i]

  getHexRange = (int, from, to) ->
    if from not in [0...4] or to not in [0...4] or to < from
      throw new Error("Bit index out of bounds: from: #{from}, to: #{to}")
    else return [from...to].map (idx) -> toHex(idx)

  # ## Export module

  {
    instructions: instructions
    state: state
    tick: tick
  }
