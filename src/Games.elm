module Games exposing (Game, init)

{-| Games

Contains description of the different games / ROMS available for the CHIP-8
emulator.

-}

import KeyCode exposing (KeyCode(..), KeyMapping)


type alias Game =
    { name : String
    , controls : KeyMapping
    }


{-| ROMS Available

'15PUZZLE' - Each of the 16 buttons map to a block in the game. boring.
'BLITZ' - Basically unplayable.
'GUESS' - I don't get it.
'IBM' - Just an IBM logo, nothing to see here.
'KALEID' - Kaleidescope demo, pretty cool.
'MAZE' - Random maze generator, also cool.
'MERLIN' - R = upper left, T = upper right, F = lower left, G = lower right.
'MISSILE' - G = fire.
'PONG2' - R = down left, 5 = up left, U = down right, 8 = up right.
'PUZZLE' - Can't be bothered.
'SYZYGY' - F = left, G = right, Y = down 7 = up, J = start. Broken snake.
'TANK' - Shit.
'UFO' - Meh.
'VBRIX' - Meh.
'VERS' - Meh.
'WIPEOFF' - Meh.

-}
blinky : Game
blinky =
    let
        controls =
            [ ( "ArrowLeft", KeyCode 7 )
            , ( "ArrowRight", KeyCode 8 )
            , ( "ArrowUp", KeyCode 3 )
            , ( "ArrowDown", KeyCode 6 )
            ]
    in
    { name = "BLINKY"
    , controls = controls
    }


brix : Game
brix =
    let
        controls =
            [ ( "ArrowLeft", KeyCode 4 )
            , ( "ArrowRight", KeyCode 6 )
            ]
    in
    { name = "BRIX"
    , controls = controls
    }


connect4 : Game
connect4 =
    let
        controls =
            [ ( "ArrowLeft", KeyCode 4 )
            , ( "ArrowRight", KeyCode 6 )
            , ( " ", KeyCode 5 )
            ]
    in
    { name = "CONNECT4"
    , controls = controls
    }


hidden : Game
hidden =
    let
        controls =
            [ ( "ArrowLeft", KeyCode 4 )
            , ( "ArrowRight", KeyCode 6 )
            , ( " ", KeyCode 5 )
            , ( "ArrowUp", KeyCode 2 )
            , ( "ArrowDown", KeyCode 8 )
            ]
    in
    { name = "HIDDEN"
    , controls = controls
    }


invaders : Game
invaders =
    let
        controls =
            [ ( "ArrowLeft", KeyCode 4 )
            , ( " ", KeyCode 5 )
            , ( "ArrowRight", KeyCode 6 )
            ]
    in
    { name = "INVADERS"
    , controls = controls
    }


pong : Game
pong =
    let
        controls =
            [ ( "w", KeyCode 1 )
            , ( "s", KeyCode 4 )
            , ( "i", KeyCode 12 )
            , ( "k", KeyCode 13 )
            ]
    in
    { name = "PONG"
    , controls = controls
    }


tetris : Game
tetris =
    let
        controls =
            [ ( "ArrowLeft", KeyCode 5 )
            , ( "ArrowRight", KeyCode 6 )
            , ( " ", KeyCode 4 )
            , ( "ArrowDown", KeyCode 7 )
            ]
    in
    { name = "TETRIS"
    , controls = controls
    }


tictac : Game
tictac =
    let
        controls =
            [ ( "5", KeyCode 1 )
            , ( "6", KeyCode 2 )
            , ( "7", KeyCode 3 )
            , ( "r", KeyCode 4 )
            , ( "t", KeyCode 5 )
            , ( "y", KeyCode 6 )
            , ( "f", KeyCode 7 )
            , ( "g", KeyCode 8 )
            , ( "h", KeyCode 9 )
            ]
    in
    { name = "TICTAC"
    , controls = controls
    }


init : List Game
init =
    [ blinky
    , brix
    , connect4
    , hidden
    , invaders
    , pong
    , tetris
    , tictac
    ]
