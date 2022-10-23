# Chip-8

**Online demo can be found here:** http://dragonwasrobot.github.io/chip-8/

This is an implementation of a CHIP-8 emulator written in Elm.

![Screenshot](/docs/screenshot.png)

A range of ROMS are already included - all of which are in public domain.

The ROMS `cavern`, `chipquarium`, `delaytimer`, `heartmonitor`, `morsecode`, and
`randomnumber` were included from https://github.com/mattmikolay/chip-8

Credit to [Thomas P. Greene.](http://devernay.free.fr/hacks/chip8/C8TECH10.HTM)
and [Matthew Mikolay](https://github.com/mattmikolay/chip-8) for providing
proper documentation on the CHIP-8 language and its extensions.

## Installation

Ensure you have Elm 0.19.1 installed. I personally recommend using asdf,
https://github.com/asdf-vm/asdf, to handle version management of compilers.

With Elm installed, perform the following steps:

- Change the `romsUrlPrefix` in `src/Request.elm` to `/roms/`,
- run the command `./build.sh` to compile the source, and
- run the command `python3 -m http.server` in the root of the `docs/` folder
  to start a server that can serve both the `docs/index.html` file and the
  CHIP-8 roms stored in `docs/roms`, then
- go to `http://localhost:8000` in your favorite browser.

## Testing

The tests are written using [elm-test](https://github.com/elm-explorations/test)
and [elm-verify-examples](https://github.com/stoeffel/elm-verify-examples/). To
run the tests, perform the steps:

- Run the command `npm install` to install elm-test and elm-verify-examples,
- run the command `npm run doc-tests` to generate the documentation tests found
  in the Elm code,
- run the command `npm test` to run all tests in the `tests` folder.
