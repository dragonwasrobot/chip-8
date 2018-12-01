module Keypad exposing
    ( Keypad
    , addKeyPress
    , getKeysPressed
    , init
    , removeKeyPress
    )

{-| Keypad

Computers using the Chip-8 language had a 16-key hexadecimal keypad with the
following layout:

|---|---|---|---|
| 1 | 2 | 3 | C |
|---|---|---|---|
| 4 | 5 | 6 | D |
|---|---|---|---|
| 7 | 8 | 9 | E |
|---|---|---|---|
| A | 0 | B | F |
|---|---|---|---|

We create a specific mapping per game, since the 16-key keypad is unusual.

-}

import Dict exposing (Dict)
import KeyCode exposing (KeyCode)


type alias Keypad =
    Dict Int Bool


init : Keypad
init =
    List.range 0 16
        |> List.foldl (\idx -> Dict.insert idx False) Dict.empty



{- Keyboard events -}


addKeyPress : KeyCode -> Keypad -> Keypad
addKeyPress keyCode keysPressed =
    keysPressed
        |> Dict.insert (KeyCode.nibbleValue keyCode) True


removeKeyPress : KeyCode -> Keypad -> Keypad
removeKeyPress keyCode keysPressed =
    keysPressed
        |> Dict.insert (KeyCode.nibbleValue keyCode) False


getKeysPressed : Keypad -> List Int
getKeysPressed keyPad =
    keyPad
        |> Dict.toList
        |> List.filter (Tuple.second >> (==) True)
        |> List.map Tuple.first
