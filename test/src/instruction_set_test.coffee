describe 'instruction_set', () ->

  instructionSet = null

  beforeEach () ->
    # mock display and keyboard
    display = new Display()
    keyboard = new Keyboard()
    instructionSet = new InstructionSet(display, keyboard)

  it 'instructionSet should be initialized as expected', () ->
    expect(instructionSet).toBeDefined()
    expect(instructionSet.memorySize).toBe 4096
    expect(instructionSet.registerCount).toBe 16
    expect(instructionSet.I).toBe 0
    expect(instructionSet.delayTimer.get()).toBe 0
    expect(instructionSet.soundTimer.get()).toBe 0
    expect(instructionSet.PC).toBe 0
    expect(instructionSet.SP).toBe 0
    expect(instructionSet.stackSize).toBe 16
    expect(instructionSet.display).toBeDefined()
    expect(instructionSet.keyboard).toBeDefined()

  # it 'addSpritesToMemory should add sprites to memory', () ->

  # it 'inst_00E0_CLS should clear screen', () ->

  it 'inst_0nnn_SYS should be undefined', () ->
    expect(instructionSet.inst_0nnn_SYS 123).toBe undefined

  it 'inst_00EE_RET should change PC and SP', () ->
    instructionSet.SP = 1
    instructionSet.stack[instructionSet.SP] = 42
    instructionSet.inst_00EE_RET()
    expect(instructionSet.PC).toBe 42
    expect(instructionSet.SP).toBe 0
    expect(instructionSet.stack[instructionSet.SP]).toBe 0

  it 'inst_1nnn_JP should jump to location argument', () ->
    instructionSet.inst_1nnn_JP 13
    expect(instructionSet.PC).toBe 13

  it 'inst_2nnn_CALL should call subroutine at argument', () ->
    instructionSet.SP = 3
    instructionSet.PC = 57
    instructionSet.inst_2nnn_CALL(66)
    expect(instructionSet.SP).toBe 4
    expect(instructionSet.stack[instructionSet.SP]).toBe 57
    expect(instructionSet.PC).toBe 66

  it 'inst_3xkk_SE should skip next instruction when V5 == 32', () ->
    instructionSet.PC = 60
    instructionSet.registers[5] = 32
    instructionSet.inst_3xkk_SE(5, 32)
    expect(instructionSet.PC).toBe 62

  it 'inst_4xkk_SNE should skip next instruction when V5 !== 32', () ->
    instructionSet.PC = 60
    instructionSet.registers[5] = 74
    instructionSet.inst_4xkk_SNE(5, 32)
    expect(instructionSet.PC).toBe 62

  it 'inst_5xy0_SE should skip next instruction when V11 == V5', () ->
    instructionSet.PC = 60
    instructionSet.registers[0xB] = 23
    instructionSet.registers[5] = 23
    instructionSet.inst_5xy0_SE(11, 5)
    expect(instructionSet.PC).toBe 62

  it 'inst_6xkk_LD should set V4 = 14', () ->
    instructionSet.inst_6xkk_LD(4, 19)
    expect(instructionSet.registers[4]).toBe 19

  it 'inst_7xkk_ADD should set V5 = V5 + 42', () ->
    instructionSet.registers[5] = 7
    instructionSet.inst_7xkk_ADD(5, 42)
    expect(instructionSet.registers[5]).toBe 49

  it 'inst_8xy0_LD should set V6 = VA', () ->
    instructionSet.registers[10] = 43
    instructionSet.inst_8xy0_LD(6, 10)
    expect(instructionSet.registers[6]).toBe 43

  it 'inst_8xy1_OR should set V4 = V4 | V7', () ->
    instructionSet.registers[4] = 19
    instructionSet.registers[7] = 37
    instructionSet.inst_8xy1_OR(4,7)
    expect(instructionSet.registers[4]).toBe 55

  it 'inst_8xy2_AND should set VA = VA & V3', () ->
    instructionSet.registers[10] = 19
    instructionSet.registers[3] = 37
    instructionSet.inst_8xy2_AND(10, 3)
    expect(instructionSet.registers[10]).toBe 1

  it 'inst_8xy3_XOR should set V7 = V7 ^ V2', () ->
    instructionSet.registers[7] = 19
    instructionSet.registers[2] = 37
    instructionSet.inst_8xy3_XOR(7, 2)
    expect(instructionSet.registers[7]).toBe 54

  it 'inst_8xy4_ADD should set V9 = V9 + V1', () ->
    instructionSet.registers[9] = 19
    instructionSet.registers[1] = 37
    instructionSet.inst_8xy4_ADD(9, 1)
    expect(instructionSet.registers[9]).toBe 56

  it 'inst_8xy5_SUB should set V5 = V5 - VC', () ->
    instructionSet.registers[5] = 85
    instructionSet.registers[12] = 37
    instructionSet.inst_8xy5_SUB(5, 12)
    expect(instructionSet.registers[5]).toBe 48

  it 'inst_8xy5_SUB should set VE = VE - V0 with modulo', () ->
    instructionSet.registers[14] = 19
    instructionSet.registers[0] = 37
    instructionSet.inst_8xy5_SUB(14, 0)
    expect(instructionSet.registers[14]).toBe 238

  it 'inst_8xy6_SHR should set V2 = V2 SHR 1 (LSB set)', () ->
    instructionSet.registers[2] = 32
    instructionSet.registers[15] = 1
    instructionSet.inst_8xy6_SHR 2
    expect(instructionSet.registers[15]).toBe 0
    expect(instructionSet.registers[2]).toBe 16

  it 'inst_8xy6_SHR should set V2 = V2 SHR 1 (LSB not set)', () ->
    instructionSet.registers[2] = 31
    instructionSet.registers[15] = 0
    instructionSet.inst_8xy6_SHR 2
    expect(instructionSet.registers[15]).toBe 1
    expect(instructionSet.registers[2]).toBe 15

  it 'inst_8xy7_SUBN should set V5 = V5 - V12, V5 > V12', () ->
    instructionSet.registers[12] = 9
    instructionSet.registers[5] = 42
    instructionSet.inst_8xy7_SUBN(12, 5)
    expect(instructionSet.registers[12]).toBe 33
    expect(instructionSet.registers[15]).toBe 1

  it 'inst_8xy7_SUBN should set V5 = V5 - V12, !(V5 < V12)', () ->
    instructionSet.registers[12] = 35
    instructionSet.registers[5] = 13
    instructionSet.inst_8xy7_SUBN(12, 5)
    expect(instructionSet.registers[12]).toBe 234
    expect(instructionSet.registers[15]).toBe 0

  it 'inst_8xyE_SHL should set V3 = V3 SHL 1, (MSB set)', () ->
    instructionSet.registers[3] = 137
    instructionSet.inst_8xyE_SHL 3
    expect(instructionSet.registers[3]).toBe 18
    expect(instructionSet.registers[15]).toBe 1

  it 'inst_8xyE_SHL should set V7 = V7 SHL 1, (MSB not set)', () ->
    instructionSet.registers[7] = 63
    instructionSet.inst_8xyE_SHL 7
    expect(instructionSet.registers[7]).toBe 126
    expect(instructionSet.registers[15]).toBe 0

  it 'inst_9xy0_SNE should skip next instruction if V7 != V4 (true)', () ->
    instructionSet.PC = 42
    instructionSet.registers[7] = 63
    instructionSet.registers[4] = 24
    instructionSet.inst_9xy0_SNE(7, 4)
    expect(instructionSet.PC).toBe 44

  it 'inst_9xy0_SNE should skip next instruction if V5 != V9 (false)', () ->
    instructionSet.PC = 42
    instructionSet.registers[5] = 31
    instructionSet.registers[9] = 31
    instructionSet.inst_9xy0_SNE(5, 9)
    expect(instructionSet.PC).toBe 42

  it 'inst_Annn_LD should set I = 247', () ->
    instructionSet.inst_Annn_LD 247
    expect(instructionSet.I).toBe 247

  it 'inst_Bnnn_JP should set PC to nnn plus V0', () ->
    instructionSet.registers[0] = 17
    instructionSet.inst_Bnnn_JP 643
    expect(instructionSet.PC).toBe 660

  it 'inst_Cxkk_RND should set V5 = random() & 67', () ->
    Math.random = () -> 0.37
    instructionSet.inst_Cxkk_RND(5, 67)
    expect(instructionSet.registers[5]).toBe 66

  # it 'inst_Dxyn_DRW should display sprites as expect', () ->

  it 'inst_Ex9E_SKP should skip next instruction', () ->
    instructionSet.PC = 42
    instructionSet.registers[5] = 7
    instructionSet.keyboard.getKeysPressed = () -> [3, 7, 14]
    instructionSet.inst_Ex9E_SKP 5
    expect(instructionSet.PC).toBe 44

  it 'inst_Ex9E_SKP should not skip next instruction', () ->
    instructionSet.PC = 42
    instructionSet.registers[5] = 8
    instructionSet.keyboard.getKeysPressed = () -> [3, 7, 14]
    instructionSet.inst_Ex9E_SKP 5
    expect(instructionSet.PC).toBe 42

  it 'inst_ExA1_SKNP should skip next instruction', () ->
    instructionSet.PC = 42
    instructionSet.registers[5] = 8
    instructionSet.keyboard.getKeysPressed = () -> [3, 7, 14]
    instructionSet.inst_ExA1_SKNP 5
    expect(instructionSet.PC).toBe 44

  it 'inst_ExA1_SKNP should not skip next instruction', () ->
    instructionSet.PC = 42
    instructionSet.registers[5] = 7
    instructionSet.keyboard.getKeysPressed = () -> [3, 7, 14]
    instructionSet.inst_ExA1_SKNP 5
    expect(instructionSet.PC).toBe 42

  it 'inst_Fx07_LD should set V3 to 57', () ->
    instructionSet.delayTimer.set = (delay) ->
      instructionSet.delayTimer._DT = delay
    instructionSet.delayTimer.set(57)
    instructionSet.inst_Fx07_LD 3
    expect(instructionSet.registers[3]).toBe 57

  it 'inst_Fx0A_LD should store 15 in register 4', () ->
    instructionSet.keyboard.waitForKeyPress = () -> 15
    instructionSet.inst_Fx0A_LD 4
    expect(instructionSet.registers[4]).toBe 15

  it 'inst_Fx15_LD should set delay timer to the value of register 7', () ->
    instructionSet.delayTimer.set = (delay) ->
      instructionSet.delayTimer._DT = delay
    instructionSet.registers[7] = 42
    instructionSet.inst_Fx15_LD 7
    expect(instructionSet.delayTimer.get()).toBe 42

  it 'inst_Fx18_LD should set sound timer to the value of register 2', () ->
    instructionSet.soundTimer.set = (delay) ->
      instructionSet.soundTimer._ST = delay
    instructionSet.registers[2] = 37
    instructionSet.inst_Fx18_LD 2
    expect(instructionSet.soundTimer.get()).toBe 37

  it 'inst_Fx1E_ADD should add the value of register 14 to I', () ->
    instructionSet.registers[14] = 64
    instructionSet.I = 27
    instructionSet.inst_Fx1E_ADD 14
    expect(instructionSet.I).toBe 91

  # it 'inst_Fx29_LD should set I to location of sprite for digit V5', () ->

  it 'inst_Fx33_LD should save representation of V9 in I, I+1, and I+2', () ->
    instructionSet.registers[9] = 738
    instructionSet.I = 54
    instructionSet.inst_Fx33_LD 9
    expect(instructionSet.memory[instructionSet.I]).toBe 7
    expect(instructionSet.memory[instructionSet.I+1]).toBe 3
    expect(instructionSet.memory[instructionSet.I+2]).toBe 8

  it 'inst_Fx55_LD should store registers V0 through V2 in memory at I..', () ->
    instructionSet.registers[0] = 42
    instructionSet.registers[1] = 16
    instructionSet.registers[2] = 89
    instructionSet.I = 57
    instructionSet.inst_Fx55_LD 2
    expect(instructionSet.memory[57]).toBe 42
    expect(instructionSet.memory[58]).toBe 16
    expect(instructionSet.memory[59]).toBe 89

  it 'inst_Fx65_LD should read registers V0 through V3 from memory', () ->
    instructionSet.I = 255
    instructionSet.memory[255] = 104
    instructionSet.memory[256] = 23
    instructionSet.memory[257] = 543
    instructionSet.memory[258] = 9
    instructionSet.inst_Fx65_LD 3
    expect(instructionSet.registers[0]).toBe 104
    expect(instructionSet.registers[1]).toBe 23
    expect(instructionSet.registers[2]).toBe 543
    expect(instructionSet.registers[3]).toBe 9
