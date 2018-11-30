module Memory exposing (Memory, getCell, initMemory, setCell)

{-| Memory

Memory address range from 200h to FFFh (3,584 bytes) since the first 512
bytes (0x200) are reserved for the CHIP-8 interpreter:

  - FFF = 4096 bytes.
  - 200 = 512 bytes.
  - FFF - 200 = 3584 bytes.

-}

import Array exposing (Array)
import Types exposing (Value16Bit, Value8Bit)


type alias Memory =
    Array Value8Bit


initMemory : Memory
initMemory =
    let
        memorySize =
            4096

        emptyMemory =
            Array.initialize memorySize (\_ -> 0)
    in
    emptyMemory
        |> addSpritesToMemory


getCell : Int -> Memory -> Value8Bit
getCell index memory =
    if index > 4095 then
        Debug.todo "Memory index out of bounds"

    else
        memory
            |> Array.get index
            |> Maybe.withDefault 0


setCell : Int -> Value8Bit -> Memory -> Memory
setCell index value memory =
    if index > 4095 then
        Debug.todo "Memory index out of bounds"

    else
        memory
            |> Array.set index value


{-| Sprites

Chip-8 draws graphics on screen through the use of sprites. A sprite is a
group of bytes which are a binary representation of the desired
picture. Chip-8 sprites may be up to 15 bytes, for a possible sprite size of
8x15.

Programs may also refer to a group of sprites representing the hexadecimal
digits 0 through F. These sprites are 5 bytes long, or 8x5 pixels. The data
should be stored in the interpreter area of Chip-8 memory (0x000 to
0x1FF). Below is a listing of each character's bytes, in binary and
hexadecimal:

Declare the built-in sprites and put them into Chip-8 memory

-}
hardcodedSprites : List Value8Bit
hardcodedSprites =
    let
        -- 0-4
        sprite0 =
            [ 0xF0, 0x90, 0x90, 0x90, 0xF0 ]

        -- 5-9
        sprite1 =
            [ 0x20, 0x60, 0x20, 0x20, 0x70 ]

        -- 10-14
        sprite2 =
            [ 0xF0, 0x10, 0xF0, 0x80, 0xF0 ]

        -- 15-19
        sprite3 =
            [ 0xF0, 0x10, 0xF0, 0x10, 0xF0 ]

        -- 20-24
        sprite4 =
            [ 0x90, 0x90, 0xF0, 0x10, 0x10 ]

        -- 25-29
        sprite5 =
            [ 0xF0, 0x80, 0xF0, 0x10, 0xF0 ]

        -- 30-34
        sprite6 =
            [ 0xF0, 0x80, 0xF0, 0x90, 0xF0 ]

        -- 35-39
        sprite7 =
            [ 0xF0, 0x10, 0x20, 0x40, 0x40 ]

        -- 40-44
        sprite8 =
            [ 0xF0, 0x90, 0xF0, 0x90, 0xF0 ]

        -- 45-49
        sprite9 =
            [ 0xF0, 0x90, 0xF0, 0x10, 0xF0 ]

        -- 50-54
        spriteA =
            [ 0xF0, 0x90, 0xF0, 0x90, 0x90 ]

        -- 55-59
        spriteB =
            [ 0xE0, 0x90, 0xE0, 0x90, 0xE0 ]

        -- 60-64
        spriteC =
            [ 0xF0, 0x80, 0x80, 0x80, 0xF0 ]

        -- 65-69
        spriteD =
            [ 0xE0, 0x90, 0x90, 0x90, 0xE0 ]

        -- 70-74
        spriteE =
            [ 0xF0, 0x80, 0xF0, 0x80, 0xF0 ]

        -- 75-79
        spriteF =
            [ 0xF0, 0x80, 0xF0, 0x80, 0x80 ]
    in
    sprite0
        ++ sprite1
        ++ sprite2
        ++ sprite3
        ++ sprite4
        ++ sprite5
        ++ sprite6
        ++ sprite7
        ++ sprite8
        ++ sprite9
        ++ spriteA
        ++ spriteB
        ++ spriteC
        ++ spriteD
        ++ spriteE
        ++ spriteF


addSpritesToMemory : Memory -> Memory
addSpritesToMemory memory =
    let
        sprites =
            Array.fromList hardcodedSprites

        rangeToUpdate =
            List.range 0 <| Array.length sprites
    in
    List.foldl
        (copySpriteCell sprites)
        memory
        rangeToUpdate


copySpriteCell : Array Value8Bit -> Int -> Memory -> Memory
copySpriteCell sprites idx memory =
    case Array.get idx sprites of
        Just spriteValue ->
            setCell idx spriteValue memory

        Nothing ->
            memory
