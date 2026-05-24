module Chip8.FetchDecodeExecuteLoop exposing
    ( dropFirstNibble
    , getByte
    , getNibble
    , tick
    , toHex
    )

import Bitwise
import Chip8.Flags as Flags exposing (Flags)
import Chip8.Instructions as Instructions
import Chip8.Memory as Memory exposing (Memory)
import Chip8.Registers as Registers
import Chip8.Types exposing (RuntimeError, Value12Bit, Value16Bit, Value4Bit, Value8Bit)
import Chip8.VirtualMachine as VirtualMachine exposing (VirtualMachine)
import Hex


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
getNibble : Int -> Value16Bit -> Result RuntimeError Value4Bit
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


handle0 : VirtualMachine -> Value16Bit -> Result RuntimeError VirtualMachine
handle0 virtualMachine opcode =
    case getByte opcode of
        0xE0 ->
            Ok <| Instructions.clearDisplay virtualMachine

        0xEE ->
            Ok <| Instructions.returnFromSubroutine virtualMachine

        _ ->
            Ok <| Instructions.jumpSys virtualMachine


handle1 : VirtualMachine -> Value16Bit -> Result RuntimeError VirtualMachine
handle1 virtualMachine opcode =
    virtualMachine
        |> (opcode |> dropFirstNibble |> Instructions.jumpAbsolute)
        |> Ok


handle2 : VirtualMachine -> Value16Bit -> Result RuntimeError VirtualMachine
handle2 virtualMachine opcode =
    opcode |> dropFirstNibble |> Instructions.callSubroutine virtualMachine |> Ok


handle3 : VirtualMachine -> Value16Bit -> Result RuntimeError VirtualMachine
handle3 virtualMachine opcode =
    let
        register =
            opcode |> getNibble 1 |> Result.withDefault 0

        value =
            opcode |> getByte
    in
    virtualMachine |> Instructions.skipNextIfEqualConstant register value |> Ok


handle4 : VirtualMachine -> Value16Bit -> Result RuntimeError VirtualMachine
handle4 virtualMachine opcode =
    let
        register =
            opcode |> getNibble 1 |> Result.withDefault 0

        value =
            opcode |> getByte
    in
    Ok <| Instructions.skipNextIfNotEqualConstant register value virtualMachine


handle5 : VirtualMachine -> Value16Bit -> Result RuntimeError VirtualMachine
handle5 virtualMachine opcode =
    if (opcode |> getNibble 3 |> Result.withDefault -1) /= 0 then
        Err <| "Unknown opcode: " ++ toHex opcode

    else
        let
            registerX =
                opcode |> getNibble 1 |> Result.withDefault 0

            registerY =
                opcode |> getNibble 2 |> Result.withDefault 0
        in
        Ok <| Instructions.skipNextIfRegistersEqual registerX registerY virtualMachine


handle6 : VirtualMachine -> Value16Bit -> Result RuntimeError VirtualMachine
handle6 virtualMachine opcode =
    let
        registerX =
            opcode |> getNibble 1 |> Result.withDefault 0

        value =
            opcode |> getByte
    in
    virtualMachine |> Instructions.setRegisterToConstant registerX value |> Ok


handle7 : VirtualMachine -> Value16Bit -> Result RuntimeError VirtualMachine
handle7 virtualMachine opcode =
    let
        registerX =
            opcode |> getNibble 1 |> Result.withDefault 0

        value =
            opcode |> getByte
    in
    virtualMachine |> Instructions.addToRegister registerX value |> Ok


handle8 : VirtualMachine -> Value16Bit -> Result RuntimeError VirtualMachine
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
            virtualMachine |> Instructions.setRegisterToRegister registerX registerY |> Ok

        0x01 ->
            virtualMachine |> Instructions.setRegisterOr registerX registerY |> Ok

        0x02 ->
            virtualMachine |> Instructions.setRegisterAnd registerX registerY |> Ok

        0x03 ->
            virtualMachine |> Instructions.setRegisterXor registerX registerY |> Ok

        0x04 ->
            virtualMachine |> Instructions.setRegisterAdd registerX registerY |> Ok

        0x05 ->
            virtualMachine |> Instructions.setRegisterSub registerX registerY |> Ok

        0x06 ->
            virtualMachine |> Instructions.setRegisterShiftRight registerX |> Ok

        0x07 ->
            virtualMachine |> Instructions.setRegisterSubFlipped registerX registerY |> Ok

        0x0E ->
            virtualMachine |> Instructions.setRegisterShiftLeft registerX |> Ok

        _ ->
            "Unknown opcode: " ++ toHex opcode |> Err


handle9 : VirtualMachine -> Value16Bit -> Result RuntimeError VirtualMachine
handle9 virtualMachine opcode =
    let
        nibble =
            opcode |> getNibble 3 |> Result.withDefault 0
    in
    if nibble /= 0 then
        Err <| "Unknown opcode: " ++ toHex opcode

    else
        let
            registerX =
                opcode |> getNibble 1 |> Result.withDefault 0

            registerY =
                opcode |> getNibble 2 |> Result.withDefault 0
        in
        virtualMachine
            |> Instructions.skipNextIfRegistersNotEqual registerX registerY
            |> Ok


handleA : VirtualMachine -> Value16Bit -> Result RuntimeError VirtualMachine
handleA virtualMachine opcode =
    virtualMachine
        |> Instructions.setAddressRegisterToConstant (opcode |> dropFirstNibble)
        |> Ok


handleB : VirtualMachine -> Value16Bit -> Result RuntimeError VirtualMachine
handleB virtualMachine opcode =
    virtualMachine
        |> Instructions.jumpRelative (opcode |> dropFirstNibble)
        |> Ok


handleC : VirtualMachine -> Value16Bit -> Result RuntimeError VirtualMachine
handleC virtualMachine opcode =
    let
        registerX =
            opcode |> getNibble 1 |> Result.withDefault 0

        value =
            opcode |> getByte
    in
    virtualMachine
        |> Instructions.setRegisterRandom registerX value
        |> Ok


handleD : VirtualMachine -> Value16Bit -> Result RuntimeError VirtualMachine
handleD virtualMachine opcode =
    let
        registerX =
            opcode |> getNibble 1 |> Result.withDefault 0

        registerY =
            opcode |> getNibble 2 |> Result.withDefault 0

        n =
            opcode |> getNibble 3 |> Result.withDefault 0
    in
    virtualMachine
        |> Instructions.displaySprite registerX registerY n
        |> Ok


handleE : VirtualMachine -> Value16Bit -> Result RuntimeError VirtualMachine
handleE virtualMachine opcode =
    let
        registerX =
            opcode |> getNibble 1 |> Result.withDefault 0

        byte =
            opcode |> getByte
    in
    case byte of
        0x9E ->
            virtualMachine
                |> Instructions.skipNextIfKeyPressed registerX
                |> Ok

        0xA1 ->
            virtualMachine
                |> Instructions.skipNextIfKeyNotPressed registerX
                |> Ok

        _ ->
            "Unknown opcode: " ++ toHex opcode |> Err


handleF : VirtualMachine -> Value16Bit -> Result RuntimeError VirtualMachine
handleF virtualMachine opcode =
    let
        registerX =
            opcode |> getNibble 1 |> Result.withDefault 0

        byte =
            opcode |> getByte
    in
    case byte of
        0x07 ->
            virtualMachine |> Instructions.setRegisterToDelayTimer registerX |> Ok

        0x0A ->
            virtualMachine |> Instructions.waitForKeyPress registerX |> Ok

        0x15 ->
            virtualMachine |> Instructions.setDelayTimerToRegisterValue registerX |> Ok

        0x18 ->
            virtualMachine |> Instructions.setSoundTimerToRegisterValue registerX |> Ok

        0x1E ->
            virtualMachine |> Instructions.addToAddressRegister registerX |> Ok

        0x29 ->
            virtualMachine |> Instructions.setAddressRegisterToSpriteLocation registerX |> Ok

        0x33 ->
            virtualMachine |> Instructions.storeBcdOfRegister registerX |> Ok

        0x55 ->
            virtualMachine |> Instructions.storeRegistersAtAddressRegister registerX |> Ok

        0x65 ->
            virtualMachine |> Instructions.readRegistersFromAddressRegister registerX |> Ok

        _ ->
            "Unknown opcode: " ++ toHex opcode |> Err


executeOpcode : VirtualMachine -> Value16Bit -> Result RuntimeError VirtualMachine
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

        _ ->
            Err <| "Unknown opcode: " ++ toHex opcode


performCycle : Flags -> VirtualMachine -> Result RuntimeError VirtualMachine
performCycle flags virtualMachine =
    if flags |> Flags.isWaitingForInput then
        virtualMachine |> Ok

    else
        let
            memory =
                virtualMachine |> VirtualMachine.getMemory

            programCounter =
                virtualMachine |> VirtualMachine.getRegisters |> Registers.getProgramCounter

            opcode =
                programCounter
                    |> fetchOpcode memory
        in
        case executeOpcode virtualMachine opcode of
            Ok resultVirtualMachine ->
                let
                    newRegisters =
                        resultVirtualMachine
                            |> VirtualMachine.getRegisters
                            |> Registers.incrementProgramCounter
                in
                resultVirtualMachine
                    |> VirtualMachine.setRegisters newRegisters
                    |> Ok

            Err error ->
                Err error


{-| Perform a clock tick

    For each clock tick, we fetch and execute 10 instruction.

-}
tick : Int -> VirtualMachine -> Result RuntimeError VirtualMachine
tick instructions virtualMachine =
    List.foldl
        (\_ accVirtualMachineResult ->
            case accVirtualMachineResult of
                Err error ->
                    Err error

                Ok accVirtualMachine ->
                    let
                        flags =
                            accVirtualMachine |> VirtualMachine.getFlags
                    in
                    performCycle flags accVirtualMachine
        )
        (Ok virtualMachine)
        (List.range 0 instructions)
