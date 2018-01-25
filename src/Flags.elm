module Flags
    exposing
        ( Flags
        , initFlags
        , isWaitingForInput
        , setWaitingForInput
        , isRunning
        , setRunning
        )

{-| Flags

  - Waiting for input
  - Running

-}


type alias Flags =
    { waitingForInput : Bool
    , running : Bool
    }


initFlags : Flags
initFlags =
    { waitingForInput = False
    , running = False
    }


isWaitingForInput : Flags -> Bool
isWaitingForInput flags =
    flags.waitingForInput


setWaitingForInput : Bool -> Flags -> Flags
setWaitingForInput waitingForInput flags =
    { flags | waitingForInput = waitingForInput }


isRunning : Flags -> Bool
isRunning flags =
    flags.running


setRunning : Bool -> Flags -> Flags
setRunning running flags =
    { flags | running = running }
