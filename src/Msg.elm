module Msg exposing (Msg(..))

import Array exposing (Array)
import KeyCode exposing (KeyCode)
import Time exposing (Posix)


type Msg
    = KeyUp KeyCode
    | KeyDown KeyCode
    | KeyPress KeyCode
    | DelayTick
    | ClockTick Posix
    | SelectGame String
    | ReloadGame
    | LoadedGame (Array Int)
