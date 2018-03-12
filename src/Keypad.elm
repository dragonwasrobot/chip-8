module Keypad
    exposing
        ( Keypad
        , initKeypad
        , addKeyPress
        , removeKeyPress
        , getKeysPressed
        , waitForKeyPress
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

import Msg exposing (Msg(..))
import Games exposing (KeyMapping)
import Dict exposing (Dict)
import Flags exposing (Flags)
import Registers exposing (Registers)
import Keyboard exposing (KeyCode)
import Utils exposing (setTimeout)
import Types exposing (Value8Bit)


type alias Keypad =
    Dict KeyCode Bool


initKeypad : Keypad
initKeypad =
    List.foldl
        (\idx dict -> Dict.insert idx False dict)
        Dict.empty
        (List.range 0 16)



{- Keyboard events -}


addKeyPress : KeyCode -> KeyMapping -> Keypad -> Keypad
addKeyPress keyCode keyMapping keysPressed =
    case Dict.get keyCode keyMapping of
        Just chip8KeyCode ->
            Dict.insert chip8KeyCode True keysPressed

        Nothing ->
            keysPressed


removeKeyPress : KeyCode -> KeyMapping -> Keypad -> Keypad
removeKeyPress keyCode keyMapping keysPressed =
    case Dict.get keyCode keyMapping of
        Just chip8KeyCode ->
            Dict.insert chip8KeyCode False keysPressed

        Nothing ->
            keysPressed


getKeysPressed : Keypad -> List KeyCode
getKeysPressed keyPad =
    keyPad
        |> Dict.toList
        |> List.filter (\( _, pressed ) -> pressed == True)
        |> List.map (Tuple.first)


waitForKeyPress :
    Keypad
    -> ( Flags, Registers )
    -> Value8Bit
    -> ( ( Flags, Registers ), Cmd Msg )
waitForKeyPress keypad ( flags, registers ) registerX =
    let
        waitLength =
            100

        keysPressed =
            getKeysPressed keypad

        isKeyPressed =
            List.length keysPressed > 0

        updatedFlags =
            { flags | waitingForInput = not isKeyPressed }

        checkKey maybeKey ( updatedFlags, registers ) =
            let
                newRegisters =
                    case maybeKey of
                        Just key ->
                            registers |> Registers.setDataRegister registerX key

                        Nothing ->
                            registers
            in
                ( updatedFlags |> Flags.setWaitingForInput False
                , newRegisters
                )
    in
        if isKeyPressed then
            ( checkKey (List.head keysPressed) ( updatedFlags, registers )
            , Cmd.none
            )
        else
            ( ( flags, registers )
            , setTimeout waitLength (WaitForKeyPress registerX)
            )
