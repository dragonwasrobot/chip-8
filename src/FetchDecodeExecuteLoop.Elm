module FetchDecodeExecuteLoop exposing
    ( dropFirstNibble
    , fetchOpcode
    , getByte
    , getNibble
    , tick
    , toHex
    )

import Bitwise
import Flags exposing (Flags)
import Hex
import Instructions
import Memory exposing (Memory)
import Model exposing (Model)
import Msg exposing (Msg(..))
import Registers exposing (Registers)
import Types exposing (Error, Value12Bit, Value16Bit, Value4Bit, Value8Bit)
import Utils exposing (noCmd)


{-| Gets the n'th nibble of a 16 bit word

    -- Get first nibble

    getNibble 0 0x5678
    --> 5

    getNibble 1 0x5678
    --> 6

    getNibble 2 0x5678
    --> 7

    getNibble 3 0x5678
    --> 8

-}
getNibble : Int -> Value16Bit -> Result Error Value4Bit
getNibble n opcode =
    if List.member n [ 0, 1, 2, 3 ] then
        opcode
            |> Bitwise.shiftLeftBy (4 * n)
            |> modBy 0xFFFF
            |> Bitwise.shiftRightBy 12
            |> Ok

    else
        Err <| "expected 'n' to be in [0,1,2,3] was '" ++ String.fromInt n ++ "'"


{-| Gets the trailing byte from a 16-bit opcode

    getByte 0x4321
    --> 0x21

-}
getByte : Value16Bit -> Value8Bit
getByte opcode =
    opcode
        |> Bitwise.shiftLeftBy 8
        |> modBy 0xFFFF
        |> Bitwise.shiftRightBy 8


fetchOpcode : Memory -> Value16Bit -> Value16Bit
fetchOpcode memory programCounter =
    let
        firstByte =
            memory
                |> Memory.getCell programCounter
                |> Result.withDefault 0

        secondByte =
            memory
                |> Memory.getCell (programCounter + 1)
                |> Result.withDefault 0
    in
    Bitwise.or (Bitwise.shiftLeftBy 8 firstByte) secondByte


{-| Drops the first nibble in 16-bit opcode

    dropFirstNibble 0x4321
    --> 0x321

-}
dropFirstNibble : Value16Bit -> Value12Bit
dropFirstNibble opcode =
    opcode
        |> Bitwise.shiftLeftBy 4
        |> modBy 0xFFFF
        |> Bitwise.shiftRightBy 4


{-| Converts an int to its hexadecimal string representation

    toHex 0x4a2f
    --> "4A2F"

-}
toHex : Value16Bit -> String
toHex int =
    int |> Hex.toString |> String.toUpper


handle0 : Model -> Value16Bit -> Result Error ( Model, Cmd Msg )
handle0 model opcode =
    case getByte opcode of
        0xE0 ->
            Ok <| Instructions.clearDisplay model

        0xEE ->
            Ok <| Instructions.returnFromSubroutine model

        _ ->
            Err <| "Unknown opcode: " ++ toHex opcode


handle1 : Model -> Value16Bit -> Result Error ( Model, Cmd Msg )
handle1 model opcode =
    opcode |> dropFirstNibble |> Instructions.jumpAbsolute model |> Ok


handle2 : Model -> Value16Bit -> Result Error ( Model, Cmd Msg )
handle2 model opcode =
    opcode |> dropFirstNibble |> Instructions.callSubroutine model |> Ok


handle3 : Model -> Value16Bit -> Result Error ( Model, Cmd Msg )
handle3 model opcode =
    let
        register =
            opcode |> getNibble 1 |> Result.withDefault 0

        value =
            opcode |> getByte
    in
    Ok <| Instructions.skipNextIfEqualConstant model register value


handle4 : Model -> Value16Bit -> Result Error ( Model, Cmd Msg )
handle4 model opcode =
    let
        register =
            opcode |> getNibble 1 |> Result.withDefault 0

        value =
            opcode |> getByte
    in
    Ok <| Instructions.skipNextIfNotEqualConstant model register value


handle5 : Model -> Value16Bit -> Result Error ( Model, Cmd Msg )
handle5 model opcode =
    let
        registerX =
            opcode |> getNibble 1 |> Result.withDefault 0

        registerY =
            opcode |> getNibble 2 |> Result.withDefault 0
    in
    if (opcode |> getNibble 3 |> Result.withDefault -1) /= 0 then
        Err <| "Unknown opcode: " ++ toHex opcode

    else
        Ok <| Instructions.skipNextIfRegistersEqual model registerX registerY


handle6 : Model -> Value16Bit -> Result Error ( Model, Cmd Msg )
handle6 model opcode =
    let
        registerX =
            opcode |> getNibble 1 |> Result.withDefault 0

        value =
            opcode |> getByte
    in
    Ok <| Instructions.setRegisterToConstant model registerX value


handle7 : Model -> Value16Bit -> Result Error ( Model, Cmd Msg )
handle7 model opcode =
    let
        registerX =
            opcode |> getNibble 1 |> Result.withDefault 0

        value =
            opcode |> getByte
    in
    Ok <| Instructions.addToRegister model registerX value


handle8 : Model -> Value16Bit -> Result Error ( Model, Cmd Msg )
handle8 model opcode =
    let
        registerX =
            opcode |> getNibble 1 |> Result.withDefault 0

        registerY =
            opcode |> getNibble 2 |> Result.withDefault 0

        nibble =
            opcode |> getNibble 3 |> Result.withDefault 0
    in
    case nibble of
        0x00 ->
            Ok <| Instructions.setRegisterToRegister model registerX registerY

        0x01 ->
            Ok <| Instructions.setRegisterOr model registerX registerY

        0x02 ->
            Ok <| Instructions.setRegisterAnd model registerX registerY

        0x03 ->
            Ok <| Instructions.setRegisterXor model registerX registerY

        0x04 ->
            Ok <| Instructions.setRegisterAdd model registerX registerY

        0x05 ->
            Ok <| Instructions.setRegisterSub model registerX registerY

        0x06 ->
            Ok <| Instructions.setRegisterShiftRight model registerX

        0x07 ->
            Ok <| Instructions.setRegisterSubFlipped model registerX registerY

        0x0E ->
            Ok <| Instructions.setRegisterShiftLeft model registerX

        other ->
            Err <| "Unknown opcode: " ++ toHex opcode


handle9 : Model -> Value16Bit -> Result Error ( Model, Cmd Msg )
handle9 model opcode =
    let
        registerX =
            opcode |> getNibble 1 |> Result.withDefault 0

        registerY =
            opcode |> getNibble 2 |> Result.withDefault 0

        nibble =
            opcode |> getNibble 3 |> Result.withDefault 0
    in
    if nibble /= 0 then
        Err <| "Unknown opcode: " ++ toHex opcode

    else
        Ok <| Instructions.skipNextIfRegistersNotEqual model registerX registerY

handleA : Model -> Value16Bit -> Result Error ( Model, Cmd Msg )
handleA model opcode =
    Ok <| Instructions.setAddressRegisterToConstant model (opcode |> dropFirstNibble)


handleB : Model -> Value16Bit -> Result Error ( Model, Cmd Msg )
handleB model opcode =
    Ok <| Instructions.jumpRelative model (opcode |> dropFirstNibble)


handleC : Model -> Value16Bit -> Result Error ( Model, Cmd Msg )
handleC model opcode =
    let
        registerX =
            opcode |> getNibble 1 |> Result.withDefault 0

        value =
            opcode |> getByte
    in
    Ok <| Instructions.setRegisterRandom model registerX value


handleD : Model -> Value16Bit -> Result Error ( Model, Cmd Msg )
handleD model opcode =
    let
        registerX =
            opcode |> getNibble 1 |> Result.withDefault 0

        registerY =
            opcode |> getNibble 2 |> Result.withDefault 0

        n =
            opcode |> getNibble 3 |> Result.withDefault 0
    in
    Ok <| Instructions.displaySprite model registerX registerY n


handleE : Model -> Value16Bit -> Result Error ( Model, Cmd Msg )
handleE model opcode =
    let
        registerX =
            opcode |> getNibble 1 |> Result.withDefault 0

        byte =
            opcode |> getByte
    in
    case byte of
        0x9E ->
            Ok <| Instructions.skipNextIfKeyPressed model registerX

        0xA1 ->
            Ok <| Instructions.skipNextIfKeyNotPressed model registerX

        other ->
            Err <| "Unknown opcode: " ++ toHex opcode


handleF : Model -> Value16Bit -> Result Error ( Model, Cmd Msg )
handleF model opcode =
    let
        registerX =
            opcode |> getNibble 1 |> Result.withDefault 0

        byte =
            opcode |> getByte
    in
    case byte of
        0x07 ->
            Ok <| Instructions.setRegisterToDelayTimer model registerX

        0x0A ->
            Ok <| Instructions.waitForKeyPress model registerX

        0x15 ->
            Ok <| Instructions.setDelayTimerToRegisterValue model registerX

        0x18 ->
            Ok <| Instructions.setSoundTimerToRegisterValue model registerX

        0x1E ->
            Ok <| Instructions.addToAddressRegister model registerX

        0x29 ->
            Ok <| Instructions.setAddressRegisterToSpriteLocation model registerX

        0x33 ->
            Ok <| Instructions.storeBcdOfRegister model registerX

        0x55 ->
            Ok <| Instructions.storeRegistersAtAddressRegister model registerX

        0x65 ->
            Ok <| Instructions.readRegistersFromAddressRegister model registerX

        other ->
            Err <| "Unknown opcode: " ++ toHex opcode


executeOpcode : Model -> Value16Bit -> Result Error ( Model, Cmd Msg )
executeOpcode model opcode =
    case opcode |> getNibble 0 |> Result.withDefault 0 of
        0x00 ->
            handle0 model opcode

        0x01 ->
            handle1 model opcode

        0x02 ->
            handle2 model opcode

        0x03 ->
            handle3 model opcode

        0x04 ->
            handle4 model opcode

        0x05 ->
            handle5 model opcode

        0x06 ->
            handle6 model opcode

        0x07 ->
            handle7 model opcode

        0x08 ->
            handle8 model opcode

        0x09 ->
            handle9 model opcode

        0x0A ->
            handleA model opcode

        0x0B ->
            handleB model opcode

        0x0C ->
            handleC model opcode

        0x0D ->
            handleD model opcode

        0x0E ->
            handleE model opcode

        0x0F ->
            handleF model opcode

        other ->
            Err <| "Unknown opcode: " ++ toHex opcode


performCycle : Flags -> Model -> ( Model, Cmd Msg )
performCycle flags model =
    if flags |> Flags.isWaitingForInput then
        model |> noCmd

    else
        let
            memory =
                model |> Model.getMemory

            programCounter =
                model |> Model.getRegisters |> Registers.getProgramCounter

            opcode =
                programCounter |> fetchOpcode memory

            ( resultModel, resultCmd ) =
                case executeOpcode model opcode of
                    Ok result ->
                        result

                    Err error ->
                        -- TODO: Handle error
                        ( model, Cmd.none )

            newRegisters =
                resultModel
                    |> Model.getRegisters
                    |> Registers.incrementProgramCounter

            newModel =
                resultModel |> Model.setRegisters newRegisters
        in
        ( newModel, resultCmd )


{-| Perform a clock tick

    For each clock tick, we fetch and execute 10 instruction.

-}
tick : Int -> Model -> ( Model, Cmd Msg )
tick instructions model =
    let
        ( newModel, newCmds ) =
            List.foldl
                (\_ ( accModel, accCmds ) ->
                    let
                        flags =
                            accModel |> Model.getFlags

                        running =
                            flags |> Flags.isRunning
                    in
                    let
                        ( updatedModel, cmd ) =
                            performCycle flags accModel
                    in
                    ( updatedModel, cmd :: accCmds )
                )
                ( model, [] )
                (List.range 0 instructions)
    in
    if List.isEmpty newCmds then
        ( newModel, Cmd.none )

    else
        ( newModel, Cmd.batch <| List.reverse newCmds )
