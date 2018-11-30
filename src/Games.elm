module Games exposing (Game, KeyMapping, initGames)

{-| Games

Contains description of the different games / ROMS available for the CHIP-8
emulator.

-}

import Dict exposing (Dict)
import KeyCode exposing (KeyCode(..))



-- import Keyboard exposing (KeyCode)


{-| Mapping from standard keyboard codes to CHIP-8 keypad codes
-}
type alias KeyMapping =
    Dict Int Int


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
            Dict.empty
                |> Dict.insert 37 7
                |> Dict.insert 38 3
                |> Dict.insert 39 8
                |> Dict.insert 40 6
    in
    { name = "BLINKY"
    , controls = controls
    }


brix : Game
brix =
    let
        controls =
            Dict.empty
                |> Dict.insert 37 4
                |> Dict.insert 39 6
    in
    { name = "BRIX"
    , controls = controls
    }


connect4 : Game
connect4 =
    let
        controls =
            Dict.empty
                |> Dict.insert 37 4
                |> Dict.insert 32 5
                |> Dict.insert 39 6
    in
    { name = "CONNECT4"
    , controls = controls
    }


hidden : Game
hidden =
    let
        controls =
            Dict.empty
                |> Dict.insert 37 4
                |> Dict.insert 32 5
                |> Dict.insert 39 6
                |> Dict.insert 40 8
                |> Dict.insert 38 2
    in
    { name = "HIDDEN"
    , controls = controls
    }


invaders : Game
invaders =
    let
        controls =
            Dict.empty
                |> Dict.insert 37 4
                |> Dict.insert 32 5
                |> Dict.insert 39 6
    in
    { name = "INVADERS"
    , controls = controls
    }


pong : Game
pong =
    let
        controls =
            Dict.empty
                -- W,S and K,I
                |> Dict.insert 87 1
                |> Dict.insert 83 4
                |> Dict.insert 73 12
                |> Dict.insert 75 13
    in
    { name = "PONG"
    , controls = controls
    }


tetris : Game
tetris =
    let
        controls =
            Dict.empty
                |> Dict.insert 37 5
                |> Dict.insert 39 6
                |> Dict.insert 32 4
                |> Dict.insert 40 7
    in
    { name = "TETRIS"
    , controls = controls
    }


tictac : Game
tictac =
    let
        controls =
            Dict.empty
                -- Y,T,R,H,G,F,7,6,5
                |> Dict.insert 53 1
                |> Dict.insert 54 2
                |> Dict.insert 55 3
                |> Dict.insert 82 4
                |> Dict.insert 84 5
                |> Dict.insert 89 6
                |> Dict.insert 70 7
                |> Dict.insert 71 8
                |> Dict.insert 72 9
    in
    { name = "TICTAC"
    , controls = controls
    }


initGames : List Game
initGames =
    [ blinky
    , brix
    , connect4
    , hidden
    , invaders
    , pong
    , tetris
    , tictac
    ]
