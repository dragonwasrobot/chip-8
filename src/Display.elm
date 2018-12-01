module Display exposing (Cell, Display, getCell, init, setCell)

import Array exposing (Array)


{-| Display

The original implementation of the Chip-8 language used a 64x32-pixel
monochrome display.

-}
type alias Display =
    Array (Array Bool)


init : Display
init =
    let
        ( width, height ) =
            ( 64, 32 )
    in
    Array.initialize
        width
        (\_ -> Array.initialize height (\_ -> False))


type alias Cell =
    { column : Int
    , row : Int
    , value : Bool
    }


getCell : Display -> Int -> Int -> Cell
getCell display column row =
    let
        value =
            display
                |> Array.get column
                |> Maybe.andThen (Array.get row)
                |> Maybe.withDefault False
    in
    { column = column
    , row = row
    , value = value
    }


setCell : Cell -> Display -> Display
setCell cell display =
    let
        updatedColumn =
            display
                |> Array.get cell.column
                |> Maybe.map (Array.set cell.row cell.value)
                |> Maybe.withDefault Array.empty
    in
    Array.set cell.column updatedColumn display
