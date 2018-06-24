module Msg exposing (Msg(..))

import Array exposing (Array)
import Keyboard exposing (KeyCode)
import Time exposing (Time)


type Msg
    = KeyUp KeyCode
    | KeyDown KeyCode
    | KeyPress KeyCode
    | DelayTick
    | ClockTick Time
    | SelectGame String
    | ReloadGame
    | LoadedGame (Array Int)
