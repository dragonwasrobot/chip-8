module Msg exposing (Msg(..))

import Array exposing (Array)
import Http
import KeyCode exposing (KeyCode)
import Time exposing (Posix)
import Types exposing (Value8Bit)


type Msg
    = KeyUp (Maybe KeyCode)
    | KeyDown (Maybe KeyCode)
    | KeyPress (Maybe KeyCode)
    | DelayTick
    | ClockTick Posix
    | SelectGame String
    | ReloadGame
    | LoadedGame (Result Http.Error (Array Value8Bit))
