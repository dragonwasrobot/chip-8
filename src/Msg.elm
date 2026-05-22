module Msg exposing (Msg(..))

import Array exposing (Array)
import Http
import KeyCode exposing (KeyCode)
import Types exposing (Value8Bit)


type Msg
    = KeyUp (Maybe KeyCode)
    | KeyDown (Maybe KeyCode)
    | DelayTick
    | ClockTick
    | SelectGame String
    | ReloadGame
    | LoadedGame (Result Http.Error (Array Value8Bit))
