module Stack exposing (Stack, init, pop, put)

{-| Stack

It is a 16-bit valued array of length 16 used for storing the address that
the interpreter should return to when finished with a subroutine. Chip-8
allows for up to 16 levels of nested subroutines.

-}

import Array exposing (Array)
import Types exposing (Value16Bit, Value8Bit)


type alias Stack =
    Array Value16Bit


init : Stack
init =
    let
        stackSize =
            16
    in
    Array.initialize stackSize (\_ -> 0)


pop : Value8Bit -> Stack -> Value16Bit
pop stackPointer stack =
    if stackPointer > 15 then
        Debug.todo "Stack pointer out of bounds"

    else
        stack |> Array.get stackPointer |> Maybe.withDefault 0


put : Value8Bit -> Value16Bit -> Stack -> Stack
put stackPointer value stack =
    if stackPointer > 15 then
        Debug.todo "Stack pointer out of bounds"

    else
        stack |> Array.set stackPointer value
