# # Timers and sounds

# *author:* Peter Urbak <peter@dragonwasrobot.com> <br/>
# *version:* 2015-01-12

window.Chip8 = if window.Chip8? then window.Chip8 else {}
window.Chip8.Timers = (state) ->

  log = window.Chip8.log

  # ## Timers and Sounds

  # Chip-8 provides 2 timers, a delay timer and a sound timer.

  # The delay timer is active whenever the delay timer register (DT) is
  # non-zero. This timer does nothing more than subtract 1 from the value of DT
  # at a rate of 60Hz. When DT reaches 0, it deactivates.

  delay = {}
  delay.running = false
  delay.tickLength = (1 / 60) * 1000 # 60 Hz

  delay.start = () ->
    if not delay.running
      delay.running = true
      delay.tick()

  delay.tick = () ->
    if delay.running and state.DT > 0
      state.DT -= 1
      setTimeout(delay.tick, delay.tickLength)
    else
      delay.running = false

  # The sound timer is active whenever the sound timer register (ST) is
  # non-zero. This timer also decrements at a rate of 60Hz, however, as long as
  # ST's value is greater than zero, the Chip-8 buzzer will sound. When ST
  # reaches zero, the sound timer deactivates.

  # The sound produced by the Chip-8 interpreter has only one tone. The
  # frequency of this tone is decided by the author of the interpreter.

  sound = {}
  sound.audioContext = undefined
  sound.tickLength = (1 / 60) * 1000 # 60 Hz

  sound.start = () ->
    if sound.audioContext?
      oscillator = sound.audioContext.createOscillator()
      oscillator.connect(sound.audioContext.destination)
      oscillator.type = oscillator.SQUARE
      oscillator.noteOn(0)
      setTimeout( (() ->
        oscillator.noteOff(0)
        state.ST = 0),
        sound.tickLength * state.ST)
    else
      console.log 'Beep!'

  # ## Initialize and export module

  do () ->
    if window.AudioContext? then sound.audioContext = new AudioContext()

  {
    delay: delay
    sound: sound
  }
