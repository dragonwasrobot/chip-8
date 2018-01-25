module Stack exposing (Stack, initStack, put, pop)

{-| Stack

It is a 16-bit valued array of length 16 used for storing the address that
the interpreter should return to when finished with a subroutine. Chip-8
allows for up to 16 levels of nested subroutines.

-}

import Array exposing (Array)
import Types exposing (Value8Bit, Value16Bit)


type alias Stack =
    Array Value16Bit


initStack : Stack
initStack =
    let
        stackSize =
            16
    in
        Array.initialize stackSize (\_ -> 0)


pop : Value8Bit -> Stack -> Value16Bit
pop stackPointer stack =
    if stackPointer > 15 then
        Debug.crash "Stack pointer out of bounds"
    else
        stack |> Array.get stackPointer |> Maybe.withDefault 0


put : Value8Bit -> Value16Bit -> Stack -> Stack
put stackPointer value stack =
    if stackPointer > 15 then
        Debug.crash "Stack pointer out of bounds"
    else
        stack |> Array.set stackPointer value
