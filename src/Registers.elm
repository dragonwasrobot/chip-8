module Registers
    exposing
        ( Registers
        , initRegisters
        , getAddressRegister
        , setAddressRegister
        , getDataRegister
        , setDataRegister
        , getDelayTimer
        , setDelayTimer
        , getSoundTimer
        , setSoundTimer
        , getProgramCounter
        , setProgramCounter
        , decrementProgramCounter
        , incrementProgramCounter
        , getStackPointer
        , incrementStackPointer
        , decrementStackPointer
        )

{-| Registers

The 16 8-bit data registers.

V0, V1, V2, V3, V4, V5, V6, V7, V8, V9, VA, VB, VC, VD, BE, and VF, where VF
doubles as a carry flag and thus shouldn't be used by any program.

The 16-bit address register, called I.

The two special purpose 8-bit registers for delay and sound timers, DT and ST.

When the registers are non-zero, they are automatically decremented at a rate
of 60Hz.

The program counter (PC, 16-bit) and stack pointer (SP, 8-bit).

-}

import Array exposing (Array)
import Types exposing (Value8Bit, Value16Bit)


type alias DataRegisters =
    Array Value16Bit


initDataRegisters : DataRegisters
initDataRegisters =
    let
        registerCount =
            16
    in
        Array.initialize registerCount (\_ -> 0)


type alias Registers =
    { dataRegisters : DataRegisters
    , addressRegister : Value16Bit
    , delayTimer : Value8Bit
    , soundTimer : Value8Bit
    , programCounter : Value16Bit
    , stackPointer : Value8Bit
    }


initRegisters : Registers
initRegisters =
    { dataRegisters = initDataRegisters
    , addressRegister = 0
    , delayTimer = 0
    , soundTimer = 0
    , programCounter = 0
    , stackPointer = 0
    }


getDataRegister : Int -> Registers -> Value16Bit
getDataRegister index registers =
    if index > 15 then
        Debug.crash ("Data register index out of bounds: " ++ toString index)
    else
        registers.dataRegisters |> Array.get index |> Maybe.withDefault 0


setDataRegister : Int -> Value16Bit -> Registers -> Registers
setDataRegister index value registers =
    let
        updatedDataRegisters =
            registers.dataRegisters |> Array.set index value
    in
        if index > 15 then
            Debug.crash "Register index out of bounds"
        else
            { registers | dataRegisters = updatedDataRegisters }


getAddressRegister : Registers -> Value16Bit
getAddressRegister registers =
    registers.addressRegister


setAddressRegister : Value16Bit -> Registers -> Registers
setAddressRegister address registers =
    { registers | addressRegister = address }


getDelayTimer : Registers -> Value8Bit
getDelayTimer registers =
    registers.delayTimer


setDelayTimer : Value8Bit -> Registers -> Registers
setDelayTimer delay registers =
    { registers | delayTimer = delay }


getSoundTimer : Registers -> Value8Bit
getSoundTimer registers =
    registers.soundTimer


setSoundTimer : Value8Bit -> Registers -> Registers
setSoundTimer sound registers =
    { registers | soundTimer = sound }


getProgramCounter : Registers -> Value16Bit
getProgramCounter registers =
    registers.programCounter


setProgramCounter : Value16Bit -> Registers -> Registers
setProgramCounter programCounter registers =
    { registers | programCounter = programCounter }


incrementProgramCounter : Registers -> Registers
incrementProgramCounter registers =
    { registers | programCounter = getProgramCounter registers + 2 }


decrementProgramCounter : Registers -> Registers
decrementProgramCounter registers =
    { registers | programCounter = getProgramCounter registers - 2 }


getStackPointer : Registers -> Value16Bit
getStackPointer registers =
    registers.stackPointer


incrementStackPointer : Registers -> Registers
incrementStackPointer registers =
    { registers | stackPointer = getStackPointer registers + 1 }


decrementStackPointer : Registers -> Registers
decrementStackPointer registers =
    { registers | stackPointer = getStackPointer registers - 1 }
