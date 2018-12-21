module Stack exposing (Stack, init, pop, put)

{-| Stack

It is a 16-bit valued array of length 16 used for storing the address that
the interpreter should return to when finished with a subroutine. Chip-8
allows for up to 16 levels of nested subroutines.

-}

import Array exposing (Array)
import Types exposing (Error, Value16Bit, Value8Bit)


type alias Stack =
    Array Value16Bit


stackSize : Int
stackSize =
    16


init : Stack
init =
    Array.initialize stackSize (\_ -> 0)


pop : Value8Bit -> Stack -> Result Error Value16Bit
pop stackPointer stack =
    if stackPointer >= stackSize then
        Err "Stack pointer out of bounds"

    else
        stack
            |> Array.get stackPointer
            |> Maybe.withDefault 0
            |> Ok


put : Value8Bit -> Value16Bit -> Stack -> Result Error Stack
put stackPointer value stack =
    if stackPointer >= stackSize then
        Err "Stack pointer out of bounds"

    else
        stack
            |> Array.set stackPointer value
            |> Ok
