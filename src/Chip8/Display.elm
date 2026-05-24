module Chip8.Display exposing
    ( Cell
    , CellState
    , Display
    , decrementFade
    , getCell
    , init
    , isRendered
    , setCell
    )

import Array exposing (Array)


{-| Display

The original implementation of the Chip-8 language used a 64x32-pixel monochrome
display.

Each cell tracks both its value (what the CHIP-8 program "sees") and a fade
counter that keeps a recently-erased pixel visible for a few 60Hz frames. This
hides the flicker that XOR-based sprite movement produces, where a game erases a
sprite at the old position and re-draws it at the new one across two consecutive
instructions.

-}
type alias Display =
    Array (Array CellState)


type alias CellState =
    { value : Bool, fade : Int }


fadeFrames : Int
fadeFrames =
    2


init : Display
init =
    let
        ( width, height ) =
            ( 64, 32 )
    in
    Array.repeat width (Array.repeat height { value = False, fade = 0 })


type alias Cell =
    { column : Int
    , row : Int
    , value : Bool
    }


getCell : Display -> Int -> Int -> Cell
getCell display column row =
    let
        state =
            display
                |> Array.get column
                |> Maybe.andThen (Array.get row)
                |> Maybe.withDefault { value = False, fade = 0 }
    in
    { column = column
    , row = row
    , value = state.value
    }


setCell : Cell -> Display -> Display
setCell cell display =
    let
        oldState =
            display
                |> Array.get cell.column
                |> Maybe.andThen (Array.get cell.row)
                |> Maybe.withDefault { value = False, fade = 0 }

        newFade =
            if oldState.value && not cell.value then
                fadeFrames

            else if cell.value then
                0

            else
                oldState.fade

        newState =
            { value = cell.value, fade = newFade }

        updatedColumn =
            display
                |> Array.get cell.column
                |> Maybe.map (Array.set cell.row newState)
                |> Maybe.withDefault Array.empty
    in
    Array.set cell.column updatedColumn display


isRendered : Display -> Int -> Int -> Bool
isRendered display column row =
    display
        |> Array.get column
        |> Maybe.andThen (Array.get row)
        |> Maybe.map (\state -> state.value || state.fade > 0)
        |> Maybe.withDefault False


decrementFade : Display -> Display
decrementFade display =
    let
        decrement state =
            if state.fade > 0 then
                { state | fade = state.fade - 1 }

            else
                state
    in
    display |> Array.map (Array.map decrement)
