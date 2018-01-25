port module Ports
    exposing
        ( drawCells
        , playSound
        , loadGame
        , loadedGame
        , pause
        , step
        , printModel
        )

import Array exposing (Array)
import Json.Decode exposing (Value)


port drawCells : Array (Array Bool) -> Cmd msg


port playSound : Int -> Cmd msg


port loadGame : String -> Cmd msg


port loadedGame : (Array Int -> msg) -> Sub msg



-- God mode


port step : (Int -> msg) -> Sub msg


port pause : (Bool -> msg) -> Sub msg


port printModel : (String -> msg) -> Sub msg
