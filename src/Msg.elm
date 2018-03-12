module Msg exposing (Msg(..))

import Array exposing (Array)
import Keyboard exposing (KeyCode)
import Flags exposing (Flags)
import Registers exposing (Registers)
import Time exposing (Time)
import Types exposing (Value8Bit)


type Msg
    = KeyUp KeyCode
    | KeyDown KeyCode
    | KeyPress KeyCode
    | WaitForKeyPress Value8Bit
    | DelayTick
    | ClockTick Time
    | SelectGame String
    | ReloadGame
    | LoadedGame (Array Int)
      -- Debug messages
    | Step Int
    | Pause Bool
    | PrintModel String
