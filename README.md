# Chip-8

This is an implementation of a CHIP-8 emulator written in Elm.

**Online demo can be found here:** http://dragonwasrobot.github.io/chip-8/

![Screenshot](/docs/screenshot.png)

A range of ROMS are already included - all of which are in public domain.

The ROMS `cavern`, `chipquarium`, `delaytimer`, `heartmonitor`, `morsecode`, and
`randomnumber` were included from https://github.com/mattmikolay/chip-8

Credit to [Thomas P. Greene.](http://devernay.free.fr/hacks/chip8/C8TECH10.HTM)
and [Matthew Mikolay](https://github.com/mattmikolay/chip-8) for providing
proper documentation on the CHIP-8 language and its extensions.

## Setup

Ensure you have node.js 24 and Elm 0.19.1 installed. The project uses
[mise-en-place](https://mise.jdx.dev/) for managing compiler/runtime versions
and task management.

### Local development loop

With Elm installed, perform the following steps:

    $ mise watch dev
    $ mise run serve

in two different terminal windows/tabs. These commands together do the following:

- Checks formatting with `elm-format`.
- Checks linting rules with `elm-review`.
- Recompiles Elm to JavaScript.
- Reruns tests.
- Setup a tiny local HTTP server to serve CHIP-8 source files.

If you don't want to use `mise` you can consult the different `scripts` found in
`package.json` and run a way you prefer.

### Production build

- Run the command `./build.sh` to compile the source, then
- open `docs/index.html` in your favorite browser.

## Testing

The tests are written using [elm-test](https://github.com/elm-explorations/test)
and [elm-verify-examples](https://github.com/stoeffel/elm-verify-examples/). To
run the tests, perform the steps:

- Run the command `pnpm install` to install `elm-test` and `elm-verify-examples`,
- run the command `mise run test` to generate the documentation tests found in
  the Elm code, and run all tests in the `tests` folder.
