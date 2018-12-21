module VirtualMachine exposing
    ( VirtualMachine
    , getDisplay
    , getFlags
    , getKeypad
    , getMemory
    , getRandomSeed
    , getRegisters
    , getStack
    , getTimers
    , init
    , setDisplay
    , setFlags
    , setKeypad
    , setMemory
    , setRandomSeed
    , setRegisters
    , setStack
    , setTimers
    )

{-| Virtual machine

Contains the state of the CHIP-8 emulator.

-}

import Display exposing (Display)
import Flags exposing (Flags)
import Keypad exposing (Keypad)
import Memory exposing (Memory)
import Random exposing (Seed)
import Registers exposing (Registers)
import Stack exposing (Stack)
import Timers exposing (Timers)


type alias VirtualMachine =
    { memory : Memory
    , stack : Stack
    , registers : Registers
    , flags : Flags
    , display : Display
    , timers : Timers
    , keypad : Keypad
    , randomSeed : Seed
    }


init : VirtualMachine
init =
    { memory = Memory.init
    , stack = Stack.init
    , registers = Registers.init
    , flags = Flags.init
    , display = Display.init
    , timers = Timers.init
    , keypad = Keypad.init
    , randomSeed = Random.initialSeed 49317
    }


getMemory : VirtualMachine -> Memory
getMemory virtualMachine =
    virtualMachine.memory


setMemory : Memory -> VirtualMachine -> VirtualMachine
setMemory memory virtualMachine =
    { virtualMachine | memory = memory }


getStack : VirtualMachine -> Stack
getStack virtualMachine =
    virtualMachine.stack


setStack : Stack -> VirtualMachine -> VirtualMachine
setStack stack virtualMachine =
    { virtualMachine | stack = stack }


getRegisters : VirtualMachine -> Registers
getRegisters virtualMachine =
    virtualMachine.registers


setRegisters : Registers -> VirtualMachine -> VirtualMachine
setRegisters registers virtualMachine =
    { virtualMachine | registers = registers }


getFlags : VirtualMachine -> Flags
getFlags virtualMachine =
    virtualMachine.flags


setFlags : Flags -> VirtualMachine -> VirtualMachine
setFlags flags virtualMachine =
    { virtualMachine | flags = flags }


getDisplay : VirtualMachine -> Display
getDisplay virtualMachine =
    virtualMachine.display


setDisplay : Display -> VirtualMachine -> VirtualMachine
setDisplay display virtualMachine =
    { virtualMachine | display = display }


getTimers : VirtualMachine -> Timers
getTimers virtualMachine =
    virtualMachine.timers


setTimers : Timers -> VirtualMachine -> VirtualMachine
setTimers timers virtualMachine =
    { virtualMachine | timers = timers }


getKeypad : VirtualMachine -> Keypad
getKeypad virtualMachine =
    virtualMachine.keypad


setKeypad : Keypad -> VirtualMachine -> VirtualMachine
setKeypad keypad virtualMachine =
    { virtualMachine | keypad = keypad }


getRandomSeed : VirtualMachine -> Seed
getRandomSeed virtualMachine =
    virtualMachine.randomSeed


setRandomSeed : Seed -> VirtualMachine -> VirtualMachine
setRandomSeed seed virtualMachine =
    { virtualMachine | randomSeed = seed }
