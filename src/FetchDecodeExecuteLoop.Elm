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
import Msg exposing (Msg(..))
import Registers exposing (Registers)
import Types exposing (Error, Value12Bit, Value16Bit, Value4Bit, Value8Bit)
import VirtualMachine exposing (VirtualMachine)


{-| Gets the n'th nibble of a 16 bit word

    -- Get first nibble

    getNibble 0 0x5678
    --> Ok 5

    getNibble 1 0x5678
    --> Ok 6

    getNibble 2 0x5678
    --> Ok 7

    getNibble 3 0x5678
    --> Ok 8

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


handle0 : VirtualMachine -> Value16Bit -> Result Error ( VirtualMachine, Cmd Msg )
handle0 virtualMachine opcode =
    case getByte opcode of
        0xE0 ->
            Ok <| Instructions.clearDisplay virtualMachine

        0xEE ->
            Ok <| Instructions.returnFromSubroutine virtualMachine

        _ ->
            Err <| "Unknown opcode: " ++ toHex opcode


handle1 : VirtualMachine -> Value16Bit -> Result Error ( VirtualMachine, Cmd Msg )
handle1 virtualMachine opcode =
    opcode |> dropFirstNibble |> Instructions.jumpAbsolute virtualMachine |> Ok


handle2 : VirtualMachine -> Value16Bit -> Result Error ( VirtualMachine, Cmd Msg )
handle2 virtualMachine opcode =
    opcode |> dropFirstNibble |> Instructions.callSubroutine virtualMachine |> Ok


handle3 : VirtualMachine -> Value16Bit -> Result Error ( VirtualMachine, Cmd Msg )
handle3 virtualMachine opcode =
    let
        register =
            opcode |> getNibble 1 |> Result.withDefault 0

        value =
            opcode |> getByte
    in
    Ok <| Instructions.skipNextIfEqualConstant virtualMachine register value


handle4 : VirtualMachine -> Value16Bit -> Result Error ( VirtualMachine, Cmd Msg )
handle4 virtualMachine opcode =
    let
        register =
            opcode |> getNibble 1 |> Result.withDefault 0

        value =
            opcode |> getByte
    in
    Ok <| Instructions.skipNextIfNotEqualConstant virtualMachine register value


handle5 : VirtualMachine -> Value16Bit -> Result Error ( VirtualMachine, Cmd Msg )
handle5 virtualMachine opcode =
    let
        registerX =
            opcode |> getNibble 1 |> Result.withDefault 0

        registerY =
            opcode |> getNibble 2 |> Result.withDefault 0
    in
    if (opcode |> getNibble 3 |> Result.withDefault -1) /= 0 then
        Err <| "Unknown opcode: " ++ toHex opcode

    else
        Ok <| Instructions.skipNextIfRegistersEqual virtualMachine registerX registerY


handle6 : VirtualMachine -> Value16Bit -> Result Error ( VirtualMachine, Cmd Msg )
handle6 virtualMachine opcode =
    let
        registerX =
            opcode |> getNibble 1 |> Result.withDefault 0

        value =
            opcode |> getByte
    in
    Ok <| Instructions.setRegisterToConstant virtualMachine registerX value


handle7 : VirtualMachine -> Value16Bit -> Result Error ( VirtualMachine, Cmd Msg )
handle7 virtualMachine opcode =
    let
        registerX =
            opcode |> getNibble 1 |> Result.withDefault 0

        value =
            opcode |> getByte
    in
    Ok <| Instructions.addToRegister virtualMachine registerX value


handle8 : VirtualMachine -> Value16Bit -> Result Error ( VirtualMachine, Cmd Msg )
handle8 virtualMachine opcode =
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
            Ok <| Instructions.setRegisterToRegister virtualMachine registerX registerY

        0x01 ->
            Ok <| Instructions.setRegisterOr virtualMachine registerX registerY

        0x02 ->
            Ok <| Instructions.setRegisterAnd virtualMachine registerX registerY

        0x03 ->
            Ok <| Instructions.setRegisterXor virtualMachine registerX registerY

        0x04 ->
            Ok <| Instructions.setRegisterAdd virtualMachine registerX registerY

        0x05 ->
            Ok <| Instructions.setRegisterSub virtualMachine registerX registerY

        0x06 ->
            Ok <| Instructions.setRegisterShiftRight virtualMachine registerX

        0x07 ->
            Ok <| Instructions.setRegisterSubFlipped virtualMachine registerX registerY

        0x0E ->
            Ok <| Instructions.setRegisterShiftLeft virtualMachine registerX

        other ->
            Err <| "Unknown opcode: " ++ toHex opcode


handle9 : VirtualMachine -> Value16Bit -> Result Error ( VirtualMachine, Cmd Msg )
handle9 virtualMachine opcode =
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
        Ok <| Instructions.skipNextIfRegistersNotEqual virtualMachine registerX registerY


handleA : VirtualMachine -> Value16Bit -> Result Error ( VirtualMachine, Cmd Msg )
handleA virtualMachine opcode =
    Ok <| Instructions.setAddressRegisterToConstant virtualMachine (opcode |> dropFirstNibble)


handleB : VirtualMachine -> Value16Bit -> Result Error ( VirtualMachine, Cmd Msg )
handleB virtualMachine opcode =
    Ok <| Instructions.jumpRelative virtualMachine (opcode |> dropFirstNibble)


handleC : VirtualMachine -> Value16Bit -> Result Error ( VirtualMachine, Cmd Msg )
handleC virtualMachine opcode =
    let
        registerX =
            opcode |> getNibble 1 |> Result.withDefault 0

        value =
            opcode |> getByte
    in
    Ok <| Instructions.setRegisterRandom virtualMachine registerX value


handleD : VirtualMachine -> Value16Bit -> Result Error ( VirtualMachine, Cmd Msg )
handleD virtualMachine opcode =
    let
        registerX =
            opcode |> getNibble 1 |> Result.withDefault 0

        registerY =
            opcode |> getNibble 2 |> Result.withDefault 0

        n =
            opcode |> getNibble 3 |> Result.withDefault 0
    in
    Ok <| Instructions.displaySprite virtualMachine registerX registerY n


handleE : VirtualMachine -> Value16Bit -> Result Error ( VirtualMachine, Cmd Msg )
handleE virtualMachine opcode =
    let
        registerX =
            opcode |> getNibble 1 |> Result.withDefault 0

        byte =
            opcode |> getByte
    in
    case byte of
        0x9E ->
            Ok <| Instructions.skipNextIfKeyPressed virtualMachine registerX

        0xA1 ->
            Ok <| Instructions.skipNextIfKeyNotPressed virtualMachine registerX

        other ->
            Err <| "Unknown opcode: " ++ toHex opcode


handleF : VirtualMachine -> Value16Bit -> Result Error ( VirtualMachine, Cmd Msg )
handleF virtualMachine opcode =
    let
        registerX =
            opcode |> getNibble 1 |> Result.withDefault 0

        byte =
            opcode |> getByte
    in
    case byte of
        0x07 ->
            Ok <| Instructions.setRegisterToDelayTimer virtualMachine registerX

        0x0A ->
            Ok <| Instructions.waitForKeyPress virtualMachine registerX

        0x15 ->
            Ok <| Instructions.setDelayTimerToRegisterValue virtualMachine registerX

        0x18 ->
            Ok <| Instructions.setSoundTimerToRegisterValue virtualMachine registerX

        0x1E ->
            Ok <| Instructions.addToAddressRegister virtualMachine registerX

        0x29 ->
            Ok <| Instructions.setAddressRegisterToSpriteLocation virtualMachine registerX

        0x33 ->
            Ok <| Instructions.storeBcdOfRegister virtualMachine registerX

        0x55 ->
            Ok <| Instructions.storeRegistersAtAddressRegister virtualMachine registerX

        0x65 ->
            Ok <| Instructions.readRegistersFromAddressRegister virtualMachine registerX

        other ->
            Err <| "Unknown opcode: " ++ toHex opcode


executeOpcode : VirtualMachine -> Value16Bit -> Result Error ( VirtualMachine, Cmd Msg )
executeOpcode virtualMachine opcode =
    case opcode |> getNibble 0 |> Result.withDefault 0 of
        0x00 ->
            handle0 virtualMachine opcode

        0x01 ->
            handle1 virtualMachine opcode

        0x02 ->
            handle2 virtualMachine opcode

        0x03 ->
            handle3 virtualMachine opcode

        0x04 ->
            handle4 virtualMachine opcode

        0x05 ->
            handle5 virtualMachine opcode

        0x06 ->
            handle6 virtualMachine opcode

        0x07 ->
            handle7 virtualMachine opcode

        0x08 ->
            handle8 virtualMachine opcode

        0x09 ->
            handle9 virtualMachine opcode

        0x0A ->
            handleA virtualMachine opcode

        0x0B ->
            handleB virtualMachine opcode

        0x0C ->
            handleC virtualMachine opcode

        0x0D ->
            handleD virtualMachine opcode

        0x0E ->
            handleE virtualMachine opcode

        0x0F ->
            handleF virtualMachine opcode

        other ->
            Err <| "Unknown opcode: " ++ toHex opcode


performCycle : Flags -> VirtualMachine -> ( VirtualMachine, Cmd Msg )
performCycle flags virtualMachine =
    if flags |> Flags.isWaitingForInput then
        ( virtualMachine, Cmd.none )

    else
        let
            memory =
                virtualMachine |> VirtualMachine.getMemory

            programCounter =
                virtualMachine |> VirtualMachine.getRegisters |> Registers.getProgramCounter

            opcode =
                programCounter |> fetchOpcode memory

            ( resultVirtualMachine, resultCmd ) =
                case executeOpcode virtualMachine opcode of
                    Ok result ->
                        result

                    Err error ->
                        -- TODO: Handle error
                        ( virtualMachine, Cmd.none )

            newRegisters =
                resultVirtualMachine
                    |> VirtualMachine.getRegisters
                    |> Registers.incrementProgramCounter

            newVirtualMachine =
                resultVirtualMachine |> VirtualMachine.setRegisters newRegisters
        in
        ( newVirtualMachine, resultCmd )


{-| Perform a clock tick

    For each clock tick, we fetch and execute 10 instruction.

-}
tick : Int -> VirtualMachine -> ( VirtualMachine, Cmd Msg )
tick instructions virtualMachine =
    let
        ( newVirtualMachine, newCmds ) =
            List.foldl
                (\_ ( accVirtualMachine, accCmds ) ->
                    let
                        flags =
                            accVirtualMachine |> VirtualMachine.getFlags

                        running =
                            flags |> Flags.isRunning
                    in
                    let
                        ( updatedVirtualMachine, cmd ) =
                            performCycle flags accVirtualMachine
                    in
                    ( updatedVirtualMachine, cmd :: accCmds )
                )
                ( virtualMachine, [] )
                (List.range 0 instructions)
    in
    if List.isEmpty newCmds then
        ( newVirtualMachine, Cmd.none )

    else
        ( newVirtualMachine, Cmd.batch <| List.reverse newCmds )
