# # Main

loadProgram = (fetchDecodeExecute) ->
  xhr = new XMLHttpRequest()
  xhr.open('GET', 'roms/PONG', true)
  xhr.responseType = 'arraybuffer'
  xhr.onload = () ->
    readProgram(new Uint8Array(xhr.response), fetchDecodeExecute)
  xhr.send()

readProgram = (program, fetchDecodeExecute) ->
  PROGRAM_START = 512
  memory = fetchDecodeExecute.instructionSet.memory
  log(program)
  (memory[i + PROGRAM_START] = program[i]) for i in [0...program.length]
  log((memory.slice(PROGRAM_START, PROGRAM_START + program.length)).map (x) ->
    x.toString(16).toUpperCase())
  fetchDecodeExecute.instructionSet.I = 0
  fetchDecodeExecute.instructionSet.PC = PROGRAM_START
  fetchDecodeExecute.tick()

DEBUG = false

log = (string) ->
  if DEBUG then console.log string

main = () ->
  display = new Display()
  keyboard = new Keyboard()
  instructionSet = new InstructionSet(display, keyboard)
  fetchDecodeExecute = new FetchDecodeExecuteLoop(instructionSet)
  loadProgram(fetchDecodeExecute)

window.main = main
