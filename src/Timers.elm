port module Timers exposing
    ( Timers
    , init
    , initDelay
    , playSound
    , startDelayTimer
    , tick
    )

{-| Timers and Sounds

    Chip-8 provides 2 timers, a delay timer and a sound timer.

    The delay timer is active whenever the delay timer register (DT) is
    non-zero. This timer does nothing more than subtract 1 from the value of DT
    at a rate of 60Hz. When DT reaches 0, it deactivates.

-}

import Msg exposing (Msg(..))
import Process
import Registers exposing (Registers)
import Task


type Delay
    = Delay
        { running : Bool
        , tickLength : Float
        }


initDelay : Delay
initDelay =
    Delay
        { running = False
        , tickLength = (1 / 60) * 1000 -- 60Hz
        }


isRunning : Delay -> Bool
isRunning (Delay delay) =
    delay.running


setRunning : Bool -> Delay -> Delay
setRunning running (Delay delay) =
    Delay { delay | running = running }


getTickLength : Delay -> Float
getTickLength (Delay delay) =
    delay.tickLength


type Timers
    = Timers Delay


init : Timers
init =
    Timers initDelay


getDelay : Timers -> Delay
getDelay (Timers delay) =
    delay


setDelay : Delay -> Timers -> Timers
setDelay delay (Timers _) =
    Timers delay


{-| Start the delay timer
-}
startDelayTimer : Registers -> Timers -> ( ( Registers, Timers ), Cmd Msg )
startDelayTimer registers timers =
    if not (timers |> getDelay |> isRunning) then
        let
            flip f a b =
                f b a

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
        , setTimeout (getTickLength delay) DelayTick
        )

    else
        ( ( registers, setDelay (setRunning False delay) timers )
        , Cmd.none
        )


setTimeout : Float -> msg -> Cmd msg
setTimeout time msg =
    Process.sleep time
        |> Task.perform (\_ -> msg)


{-| Start playing the sound
-}
port playSound : Int -> Cmd msg
