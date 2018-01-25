module Msg exposing (Msg(..))

import Array exposing (Array)
import Keyboard exposing (KeyCode)
import Flags exposing (Flags)
import Registers exposing (Registers)
import Time exposing (Time)


type Msg
    = KeyUp KeyCode
    | KeyDown KeyCode
    | KeyPress KeyCode
    | WaitForKeyPress
        (Maybe KeyCode
         -> ( Flags, Registers )
         -> ( Flags, Registers )
        )
    | DelayTick
    | ClockTick Time
    | SelectGame String
    | ReloadGame
    | LoadedGame (Array Int)
      -- Debug messages
    | Step Int
    | Pause Bool
    | PrintModel String
