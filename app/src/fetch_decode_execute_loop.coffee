# # Fetch-decode-execute loop

# author: Peter Urbak <peter@dragonwasrobot.com>
# version: 2015-01-03

# ## Properties

log = window.Chip8.log

FDX = {}

FDX.instructions = {}

# ## Functions

FDX.initialize = (instructions) ->
  FDX.instructions = instructions

FDX.tick = () ->
  fetchAndExecute()
  window.requestAnimationFrame FDX.tick

handle0 = (opcode) ->
  log 'FDX->handle0'
  if opcode is 0x00E0
    FDX.instructions.inst_00E0_CLS()
  else if opcode is 0x00EE
    FDX.instructions.inst_00EE_RET()
  else throw new Error "Unknown instruction given: #{toHex(opcode)}"

handle1 = (opcode) ->
  log 'FDX->handle1'
  nibbles = opcode ^ 0x1000
  FDX.instructions.inst_1nnn_JP(nibbles)

handle2 = (opcode) ->
  log 'FDX->handle2'
  nibbles = opcode ^ 0x2000
  FDX.instructions.inst_2nnn_CALL(nibbles)

handle3 = (opcode) ->
  log 'FDX->handle3'
  nibbles = opcode ^ 0x3000
  x = nibbles >> 8
  kk = nibbles ^ (x << 8)
  FDX.instructions.inst_3xkk_SE(x, kk)

handle4 = (opcode) ->
  log 'FDX->handle4'
  nibbles = opcode ^ 0x4000
  x = nibbles >> 8
  kk = nibbles ^ (x << 8)
  FDX.instructions.inst_4xkk_SNE(x, kk)

handle5 = (opcode) ->
  log 'FDX->handle5'
  if toHex(opcode)[3] isnt '0'
    throw new Error "Unknown instruction given: #{toHex(opcode)}"
  nibbles = opcode ^ 0x5000
  x = nibbles >> 8
  y = (nibbles ^ (x << 8)) >> 4
  FDX.instructions.inst_5xy0_SE(x, y)

handle6 = (opcode) ->
  log 'FDX->handle6'
  nibbles = opcode ^ 0x6000
  x = nibbles >> 8
  kk = nibbles ^ (x << 8)
  FDX.instructions.inst_6xkk_LD(x, kk)

handle7 = (opcode) ->
  log 'FDX->handle7'
  nibbles = opcode ^ 0x7000
  x = nibbles >> 8
  kk = nibbles ^ (x << 8)
  FDX.instructions.inst_7xkk_ADD(x, kk)

handle8 = (opcode) ->
  log 'FDX->handle8'
  nibbles = opcode ^ 0x8000
  x = nibbles >> 8
  y = (nibbles ^ (x << 8)) >> 4
  instDict = {
    0: FDX.instructions.inst_8xy0_LD
    1: FDX.instructions.inst_8xy1_OR
    2: FDX.instructions.inst_8xy2_AND
    3: FDX.instructions.inst_8xy3_XOR
    4: FDX.instructions.inst_8xy4_ADD
    5: FDX.instructions.inst_8xy5_SUB
    6: FDX.instructions.inst_8xy6_SHR
    7: FDX.instructions.inst_8xy7_SUBN
    E: FDX.instructions.inst_8xyE_SHL
  }
  nibble = toHex(opcode)[3]
  log "{x: #{x}, y: #{y}, nibble: #{nibble}}"
  if instDict[nibble]? then instDict[nibble](x, y)
  else throw new Error "Unknown instruction given: #{toHex(opcode)}"

handle9 = (opcode) ->
  log 'FDX->handle9'
  if toHex(opcode)[3] isnt '0'
    throw new Error "Unknown instruction given: #{toHex(opcode)}"
  nibbles = opcode ^ 0x9000
  x = nibbles >> 8
  y = (nibbles ^ (x << 8)) >> 4
  FDX.instructions.inst_9xy0_SNE(x, y)

handleA = (opcode) ->
  log 'FDX->handleA'
  nibbles = opcode ^ 0xA000
  FDX.instructions.inst_Annn_LD(nibbles)

handleB = (opcode) ->
  log 'FDX->handleB'
  nibbles = opcode ^ 0xB000
  FDX.instructions.inst_Bnnn_JP(nibbles)

handleC = (opcode) ->
  log 'FDX->handleC'
  nibbles = opcode ^ 0xC000
  x = nibbles >> 8
  kk = nibbles ^ (x << 8)
  FDX.instructions.inst_Cxkk_RND(x, kk)

handleD = (opcode) ->
  log 'FDX->handleD'
  nibbles = opcode ^ 0xD000
  x = nibbles >> 8
  y = (nibbles ^ (x << 8)) >> 4
  n = (nibbles ^ (x << 8)) ^ (y << 4)
  FDX.instructions.inst_Dxyn_DRW(x, y, n)

handleE = (opcode) ->
  log 'FDX->handleE'
  nibbles = opcode ^ 0xE000
  x = nibbles >> 8
  y = (nibbles ^ (x << 8)) >> 4
  n = (nibbles ^ (x << 8)) ^ (y << 4)
  log "x: #{x}, #{typeof x}"
  log "y: #{y}, #{typeof y}"
  log "n: #{n}, #{typeof n}"
  if y is 9 and n is 14 then FDX.instructions.inst_Ex9E_SKP x
  else if y is 10 and n is 1 then FDX.instructions.inst_ExA1_SKNP x
  else throw new Error "Unknown nibbles: #{toHex(nibbles)}"

handleF = (opcode) ->
  log 'FDX->handleF'
  nibbles = opcode ^ 0xF000
  x = nibbles >> 8
  y = (nibbles ^ (x << 8)) >> 4
  n = (nibbles ^ (x << 8)) ^ (y << 4)
  log "x: #{x}"
  log "y: #{y}"
  log "n: #{n}"
  if y is 0 and n is 7 then FDX.instructions.inst_Fx07_LD x
  else if y is 0 and n is 10 then FDX.instructions.inst_Fx0A_LD x
  else if y is 1 and n is 5 then FDX.instructions.inst_Fx15_LD x
  else if y is 1 and n is 8 then FDX.instructions.inst_Fx18_LD x
  else if y is 1 and n is 14 then FDX.instructions.inst_Fx1E_ADD x
  else if y is 2 and n is 9 then FDX.instructions.inst_Fx29_LD x
  else if y is 3 and n is 3 then FDX.instructions.inst_Fx33_LD x
  else if y is 5 and n is 5 then FDX.instructions.inst_Fx55_LD x
  else if y is 6 and n is 5 then FDX.instructions.inst_Fx65_LD x
  else throw new Error "Unknown nibbles: #{toHex(nibbles)}"

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

  log "PC: #{FDX.instructions.PC}"
  memory = FDX.instructions.memory
  PC = FDX.instructions.PC
  firstNibble = memory[PC]
  secondNibble = memory[PC + 1]

  opcode = memory[PC] << 8 | memory[PC + 1]
  log "opcode is: #{toHex(opcode)}"
  nibble = if toHex(opcode).length is 4 then toHex(opcode)[0] else 0
  if handleDict[nibble]?
    handleDict[nibble](opcode)
    FDX.instructions.incrementPC()
  else
    throw new Error "Unknown instruction given: #{toHex(opcode)}"

# ### Utility functions

toHex = (int) -> int.toString(16).toUpperCase()
toDecimal = (hex) -> parseInt(hex, 16)

getHexAtIndex = (int, i) ->
  if i < 0 or i > 3 then throw new Error "Bit index out of bounds: #{i}"
  else toHex(int)[i]

getHexRange = (int, from, to) ->
  if from not in [0...4] or to not in [0...4] or to < from
    throw new Error "Bit index out of bounds: from: #{from}, to: #{to}"
  else return [from...to].map (idx) -> toHex(idx)

# ## Export and initialize module

window.Chip8 = if window.Chip8? then window.Chip8 else {}
window.Chip8.FDX = FDX
