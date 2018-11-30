module Keypad exposing
    ( Keypad
    , addKeyPress
    , getKeysPressed
    , initKeypad
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
import Flags exposing (Flags)
import Games exposing (KeyMapping)
import KeyCode exposing (KeyCode)
import Registers exposing (Registers)



-- import Keyboard exposing (KeyCode)


type alias Keypad =
    Dict Int Bool


initKeypad : Keypad
initKeypad =
    List.range 0 16
        |> List.foldl (\idx -> Dict.insert idx False) Dict.empty



{- Keyboard events -}


addKeyPress : KeyCode -> KeyMapping -> Keypad -> Keypad
addKeyPress keyCode keyMapping keysPressed =
    case Dict.get (KeyCode.intValue keyCode) keyMapping of
        Just chip8KeyCode ->
            keysPressed
                |> Dict.insert chip8KeyCode True

        Nothing ->
            keysPressed


removeKeyPress : KeyCode -> KeyMapping -> Keypad -> Keypad
removeKeyPress keyCode keyMapping keysPressed =
    case Dict.get (KeyCode.intValue keyCode) keyMapping of
        Just chip8KeyCode ->
            keysPressed
                |> Dict.insert chip8KeyCode False

        Nothing ->
            keysPressed


getKeysPressed : Keypad -> List Int
getKeysPressed keyPad =
    keyPad
        |> Dict.toList
        |> List.filter (Tuple.second >> (==) True)
        |> List.map Tuple.first
