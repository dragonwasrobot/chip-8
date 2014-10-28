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
    expect(instructionSet.DT).toBe 0
    expect(instructionSet.ST).toBe 0
    expect(instructionSet.PC).toBe 0
    expect(instructionSet.SP).toBe 0
    expect(instructionSet.stackSize).toBe 16
    expect(instructionSet.display).toBeDefined()
    expect(instructionSet.keyboard).toBeDefined()
