# Chip-8

This is an implementation of a CHIP-8 emulator written in Elm.

![Screenshot](/images/screenshot.png)

A range of ROMS are already included - all of which are in public domain.

Credit to Thomas P. Greene. for providing proper documentation of the [Chip-8
specification](http://devernay.free.fr/hacks/chip8/C8TECH10.HTM).

You can try a running version of the emulator
[here](http://dragonwasrobot.github.io/chip-8/).

## Installation

Ensure you have Elm 0.19 installed. I personally recommend using asdf,
https://github.com/asdf-vm/asdf, to handle version management of compilers.

With Elm installed, perform the following steps:

- Run the command `elm make src/Main.elm --output docs/elm.js` (or `./build.sh`)
  to compile the source,
- run the command `python -m SimpleHTTPServer` in the folder `docs` to start a
  server that can serve both the `docs/index.html` file and the CHIP-8 roms
  stored in `docs/roms`.

## Testing

The tests are written using [elm-test](https://github.com/elm-explorations/test)
and [elm-verify-examples](https://github.com/stoeffel/elm-verify-examples/). To
run the tests, perform the steps:

- Run the command `npm install` to install elm-test and elm-verify-examples,
- run the command `npm run doc-tests` to generate the documentation tests found
  in the Elm code,
- run the command `npm test` to run all tests in the `tests` folder.
