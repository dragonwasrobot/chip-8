module Chip8.Types exposing
    ( RuntimeError
    , Value12Bit
    , Value16Bit
    , Value4Bit
    , Value8Bit
    )

-- Common types used in the CHIP-8 project.


type alias Value4Bit =
    Int


type alias Value8Bit =
    Int


type alias Value12Bit =
    Int


type alias Value16Bit =
    Int


type alias RuntimeError =
    String
