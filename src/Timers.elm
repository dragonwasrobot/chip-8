module Timers
    exposing
        ( Timers
        , initTimers
        , startDelayTimer
        , tick
        , playSound
        , initDelay
        )

{-| Timers and Sounds

    Chip-8 provides 2 timers, a delay timer and a sound timer.

    The delay timer is active whenever the delay timer register (DT) is
    non-zero. This timer does nothing more than subtract 1 from the value of DT
    at a rate of 60Hz. When DT reaches 0, it deactivates.

-}

import Registers exposing (Registers)
import Msg exposing (Msg(..))
import Utils exposing (setTimeout)
import Ports


type alias Delay =
    { running : Bool
    , tickLength : Float
    }


initDelay : Delay
initDelay =
    { running = False
    , tickLength = (1 / 60) * 1000 -- 60Hz
    }


isRunning : Delay -> Bool
isRunning delay =
    delay.running


setRunning : Bool -> Delay -> Delay
setRunning running delay =
    { delay | running = running }


getTickLength : Delay -> Float
getTickLength delay =
    delay.tickLength


type alias Timers =
    { delay : Delay }


initTimers : Timers
initTimers =
    { delay = initDelay }


getDelay : Timers -> Delay
getDelay timers =
    timers.delay


setDelay : Delay -> Timers -> Timers
setDelay delay timers =
    { timers | delay = delay }


{-| Start the delay timer
-}
startDelayTimer : Registers -> Timers -> ( ( Registers, Timers ), Cmd Msg )
startDelayTimer registers timers =
    if not (timers |> getDelay |> isRunning) then
        let
            updatedTimers =
                timers
                    |> getDelay
                    |> setRunning True
                    |> (setDelay |> flip) timers
        in
            tick registers updatedTimers
    else
        ( ( registers, timers ), Cmd.none )


{-| Performs a tick of the delay timer
-}
tick : Registers -> Timers -> ( ( Registers, Timers ), Cmd Msg )
tick registers timers =
    let
        delay =
            timers |> getDelay

        delayTimer =
            registers |> Registers.getDelayTimer
    in
        if isRunning delay && delayTimer > 0 then
            ( ( registers |> Registers.setDelayTimer (delayTimer - 1), timers )
            , setTimeout delay.tickLength DelayTick
            )
        else
            ( ( registers, setDelay (setRunning False delay) timers )
            , Cmd.none
            )


{-| Start playing the sound
-}
playSound : Int -> Cmd Msg
playSound soundTime =
    Ports.playSound soundTime
