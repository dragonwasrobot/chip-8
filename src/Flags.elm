module Flags
    exposing
        ( Flags
        , initFlags
        , isWaitingForInput
        , getWaitingForInputRegister
        , setWaitingForInputRegister
        , isRunning
        , setRunning
        )

import Types exposing (Value8Bit)


{-| Flags

  - Waiting for input
  - Running

-}
type alias Flags =
    { waitingForInputRegister : Maybe Value8Bit
    , running : Bool
    }


initFlags : Flags
initFlags =
    { waitingForInputRegister = Nothing
    , running = False
    }


isWaitingForInput : Flags -> Bool
isWaitingForInput flags =
    case flags.waitingForInputRegister of
        Just _ ->
            True

        Nothing ->
            False


getWaitingForInputRegister : Flags -> Maybe Value8Bit
getWaitingForInputRegister flags =
    flags.waitingForInputRegister


setWaitingForInputRegister : Maybe Value8Bit -> Flags -> Flags
setWaitingForInputRegister waitingForInputRegister flags =
    { flags | waitingForInputRegister = waitingForInputRegister }


isRunning : Flags -> Bool
isRunning flags =
    flags.running


setRunning : Bool -> Flags -> Flags
setRunning running flags =
    { flags | running = running }
