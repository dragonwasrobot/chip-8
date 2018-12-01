module Msg exposing (Msg(..))

import Array exposing (Array)
import KeyCode exposing (KeyCode)
import Time exposing (Posix)


type Msg
    = KeyUp (Maybe KeyCode)
    | KeyDown (Maybe KeyCode)
    | KeyPress (Maybe KeyCode)
    | DelayTick
    | ClockTick Posix
    | SelectGame String
    | ReloadGame
    | LoadedGame (Array Int)
