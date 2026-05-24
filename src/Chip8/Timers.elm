module Chip8.Timers exposing
    ( DelayTimer(..)
    , SoundTimer
    , Timers
    , clearSoundTimer
    , delayTick
    , getDelay
    , getDelayLength
    , getPlayLength
    , getSound
    , init
    , setDelay
    , startDelayTimer
    , startSoundTimer
    )

{-| Timers and Sounds

    Chip-8 provides 2 timers, a delay timer and a sound timer.

    The delay timer is active whenever the delay timer register (DT) is
    non-zero. This timer does nothing more than subtract 1 from the value of DT
    at a rate of 60Hz. When DT reaches 0, it deactivates.

-}

import Chip8.Registers as Registers exposing (Registers)
import Chip8.Types exposing (Value8Bit)


type DelayTimer
    = Idle
    | Ready
    | Running


initDelay : DelayTimer
initDelay =
    Idle


getDelayLength : Float
getDelayLength =
    -- 60Hz
    (1 / 60) * 1000


type SoundTimer
    = SoundTimer { playLength : Value8Bit }


initSound : SoundTimer
initSound =
    SoundTimer { playLength = 0 }


type Timers
    = Timers DelayTimer SoundTimer


getPlayLength : SoundTimer -> Value8Bit
getPlayLength (SoundTimer sound) =
    sound.playLength


setPlayLength : Value8Bit -> SoundTimer -> SoundTimer
setPlayLength playLength (SoundTimer _) =
    SoundTimer { playLength = playLength }


init : Timers
init =
    Timers initDelay initSound


getDelay : Timers -> DelayTimer
getDelay (Timers delay _) =
    delay


setDelay : DelayTimer -> Timers -> Timers
setDelay delay (Timers _ sound) =
    Timers delay sound


getSound : Timers -> SoundTimer
getSound (Timers _ sound) =
    sound


setSound : SoundTimer -> Timers -> Timers
setSound sound (Timers delay _) =
    Timers delay sound


clearSoundTimer : Timers -> Timers
clearSoundTimer (Timers delay _) =
    Timers delay initSound


{-| Start the delay timer
-}
startDelayTimer : Registers -> Timers -> ( Registers, Timers )
startDelayTimer registers timers =
    timers
        |> setDelay Ready
        |> delayTick registers


{-| Start the sound timer
-}
startSoundTimer : Registers -> Timers -> ( Registers, Timers )
startSoundTimer registers timers =
    let
        flip f a b =
            f b a

        playLength =
            registers |> Registers.getSoundTimer

        updatedTimers =
            timers
                |> getSound
                |> setPlayLength playLength
                |> (setSound |> flip) timers
    in
    ( registers, updatedTimers )


{-| Performs a tick of the delay timer
-}
delayTick : Registers -> Timers -> ( Registers, Timers )
delayTick registers timers =
    let
        delayTimer =
            registers |> Registers.getDelayTimer
    in
    if delayTimer > 0 then
        ( registers |> Registers.setDelayTimer (delayTimer - 1)
        , timers
        )

    else
        ( registers, setDelay Idle timers )
