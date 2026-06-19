module Games exposing (Game, init)

{-| Games

Contains description of the different games / ROMS available for the CHIP-8
emulator.

-}

import Chip8.KeyCode exposing (KeyCode(..), KeyMapping)


type alias Game =
    { fileName : String
    , displayName : String
    , controls : List KeyMapping
    }


{-| ROMS Available

'15puzzle.ch8' - Each of the 16 buttons map to a block in the game. boring.
'blinky.ch8' - TODO
'blitz.ch8' - Basically unplayable.
'brix.ch8' - TODO
'connect4.ch8' - Connect 4 game.
'guess.ch8' - I don't get it.
'hidden.ch8' - Memory game.
'ibm.ch8' - Just an IBM logo, nothing to see here.
'invaders.ch8' - Space invaders
'kaleid.ch8' - Kaleidescope demo, pretty cool.
'maze.ch8' - Random maze generator, also cool.
'merlin.ch8' - R = upper left, T = upper right, F = lower left, G = lower right.
'missile.ch8' - G = fire.
'pong.ch8' - TODO
'pong2.ch8' - R = down left, 5 = up left, U = down right, 8 = up right.
'puzzle.ch8' - Can't be bothered.
'syzygy.ch8' - F = left, G = right, Y = down 7 = up, J = start. Broken snake.
'tank.ch8' - Meh.
'test\_opcode.ch8' - Meh.
'ufo.ch8' - Meh.
'vbrix.ch8' - Meh.
'vers.ch8' - Meh.
'wipeoff.ch8' - Meh.

-}
blinky : Game
blinky =
    let
        controls =
            [ { browserKeyCode = "ArrowLeft"
              , chip8KeyCode = KeyCode 7
              , description = Nothing
              }
            , { browserKeyCode = "ArrowRight"
              , chip8KeyCode = KeyCode 8
              , description = Nothing
              }
            , { browserKeyCode = "ArrowUp"
              , chip8KeyCode = KeyCode 3
              , description = Nothing
              }
            , { browserKeyCode = "ArrowDown"
              , chip8KeyCode = KeyCode 6
              , description = Nothing
              }
            ]
    in
    { fileName = "blinky.ch8"
    , displayName = "Blinky"
    , controls = controls
    }


brix : Game
brix =
    let
        controls =
            [ { browserKeyCode = "ArrowLeft"
              , chip8KeyCode = KeyCode 4
              , description = Nothing
              }
            , { browserKeyCode = "ArrowRight"
              , chip8KeyCode = KeyCode 6
              , description = Nothing
              }
            ]
    in
    { fileName = "brix.ch8"
    , displayName = "Brix"
    , controls = controls
    }


cavern : Game
cavern =
    let
        controls =
            [ { browserKeyCode = "ArrowLeft"
              , chip8KeyCode = KeyCode 4
              , description = Nothing
              }
            , { browserKeyCode = "ArrowRight"
              , chip8KeyCode = KeyCode 6
              , description = Nothing
              }
            , { browserKeyCode = " "
              , chip8KeyCode = KeyCode 5
              , description = Nothing
              }
            , { browserKeyCode = "ArrowUp"
              , chip8KeyCode = KeyCode 2
              , description = Nothing
              }
            , { browserKeyCode = "ArrowDown"
              , chip8KeyCode = KeyCode 8
              , description = Nothing
              }
            ]
    in
    { fileName = "cavern.ch8"
    , displayName = "Cavern"
    , controls = controls
    }


chipquarium : Game
chipquarium =
    -- Fish tank simulator
    let
        controls =
            [ { browserKeyCode = "f"
              , chip8KeyCode = KeyCode 15
              , description = Just "FEED FISH"
              }
            , { browserKeyCode = "c"
              , chip8KeyCode = KeyCode 12
              , description = Just "CLEAN TANK"
              }
            , { browserKeyCode = "d"
              , chip8KeyCode = KeyCode 13
              , description = Just "FISH SLEEP"
              }
            , { browserKeyCode = "b"
              , chip8KeyCode = KeyCode 11
              , description = Just "ROCK-PAPER-SCISSORS"
              }
            , { browserKeyCode = "e"
              , chip8KeyCode = KeyCode 14
              , description = Just "FISH STATS"
              }
            , { browserKeyCode = "ArrowUp"
              , chip8KeyCode = KeyCode 2
              , description = Nothing
              }
            , { browserKeyCode = "ArrowDown"
              , chip8KeyCode = KeyCode 8
              , description = Nothing
              }
            ]
    in
    { fileName = "chipquarium.ch8"
    , displayName = "Chipquarium"
    , controls = controls
    }


connect4 : Game
connect4 =
    let
        controls =
            [ { browserKeyCode = "ArrowLeft"
              , chip8KeyCode = KeyCode 4
              , description = Nothing
              }
            , { browserKeyCode = "ArrowRight"
              , chip8KeyCode = KeyCode 6
              , description = Nothing
              }
            , { browserKeyCode = " "
              , chip8KeyCode = KeyCode 5
              , description = Nothing
              }
            ]
    in
    { fileName = "connect4.ch8"
    , displayName = "Connect 4"
    , controls = controls
    }


heartMonitorDemo : Game
heartMonitorDemo =
    { fileName = "heart_monitor.ch8"
    , displayName = "Heart"
    , controls = []
    }


hidden : Game
hidden =
    let
        controls =
            [ { browserKeyCode = "ArrowLeft"
              , chip8KeyCode = KeyCode 4
              , description = Nothing
              }
            , { browserKeyCode = "ArrowRight"
              , chip8KeyCode = KeyCode 6
              , description = Nothing
              }
            , { browserKeyCode = " "
              , chip8KeyCode = KeyCode 5
              , description = Nothing
              }
            , { browserKeyCode = "ArrowUp"
              , chip8KeyCode = KeyCode 2
              , description = Nothing
              }
            , { browserKeyCode = "ArrowDown"
              , chip8KeyCode = KeyCode 8
              , description = Nothing
              }
            ]
    in
    { fileName = "hidden.ch8"
    , displayName = "Hidden"
    , controls = controls
    }


invaders : Game
invaders =
    let
        controls =
            [ { browserKeyCode = "ArrowLeft"
              , chip8KeyCode = KeyCode 4
              , description = Nothing
              }
            , { browserKeyCode = " "
              , chip8KeyCode = KeyCode 5
              , description = Just "SHOOT"
              }
            , { browserKeyCode = "ArrowRight"
              , chip8KeyCode = KeyCode 6
              , description = Nothing
              }
            ]
    in
    { fileName = "invaders.ch8"
    , displayName = "Invaders"
    , controls = controls
    }


morseDemo : Game
morseDemo =
    { fileName = "morse_demo.ch8"
    , displayName = "Morse"
    , controls = []
    }


pong : Game
pong =
    let
        controls =
            [ { browserKeyCode = "w"
              , chip8KeyCode = KeyCode 1
              , description = Nothing
              }
            , { browserKeyCode = "s"
              , chip8KeyCode = KeyCode 4
              , description = Nothing
              }
            , { browserKeyCode = "i"
              , chip8KeyCode = KeyCode 12
              , description = Nothing
              }
            , { browserKeyCode = "k"
              , chip8KeyCode = KeyCode 13
              , description = Nothing
              }
            ]
    in
    { fileName = "pong.ch8"
    , displayName = "Pong"
    , controls = controls
    }


tetris : Game
tetris =
    let
        controls =
            [ { browserKeyCode = "ArrowLeft"
              , chip8KeyCode = KeyCode 5
              , description = Nothing
              }
            , { browserKeyCode = "ArrowRight"
              , chip8KeyCode = KeyCode 6
              , description = Nothing
              }
            , { browserKeyCode = " "
              , chip8KeyCode = KeyCode 4
              , description = Nothing
              }
            , { browserKeyCode = "ArrowDown"
              , chip8KeyCode = KeyCode 7
              , description = Nothing
              }
            ]
    in
    { fileName = "tetris.ch8"
    , displayName = "Tetris"
    , controls = controls
    }


tictac : Game
tictac =
    let
        controls =
            [ { browserKeyCode = "5"
              , chip8KeyCode = KeyCode 1
              , description = Nothing
              }
            , { browserKeyCode = "6"
              , chip8KeyCode = KeyCode 2
              , description = Nothing
              }
            , { browserKeyCode = "7"
              , chip8KeyCode = KeyCode 3
              , description = Nothing
              }
            , { browserKeyCode = "r"
              , chip8KeyCode = KeyCode 4
              , description = Nothing
              }
            , { browserKeyCode = "t"
              , chip8KeyCode = KeyCode 5
              , description = Nothing
              }
            , { browserKeyCode = "y"
              , chip8KeyCode = KeyCode 6
              , description = Nothing
              }
            , { browserKeyCode = "f"
              , chip8KeyCode = KeyCode 7
              , description = Nothing
              }
            , { browserKeyCode = "g"
              , chip8KeyCode = KeyCode 8
              , description = Nothing
              }
            , { browserKeyCode = "h"
              , chip8KeyCode = KeyCode 9
              , description = Nothing
              }
            ]
    in
    { fileName = "tictac.ch8"
    , displayName = "Tic Tac Toe"
    , controls = controls
    }


init : List Game
init =
    [ blinky
    , brix
    , cavern
    , chipquarium
    , connect4
    , heartMonitorDemo
    , hidden
    , invaders
    , morseDemo
    , pong
    , tetris
    , tictac
    ]
