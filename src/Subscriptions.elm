port module Subscriptions exposing (subscriptions)

-- import Keyboard

import Array exposing (Array)
import Browser.Events as Events
import Flags
import Json.Decode as Decode exposing (Decoder)
import KeyCode exposing (KeyCode)
import Model exposing (Model)
import Msg exposing (Msg(..))
import Time


subscriptions : Model -> Sub Msg
subscriptions model =
    let
        flags =
            model |> Model.getFlags

        keyboardSubscriptions =
            if Flags.isRunning flags then
                [ Events.onKeyUp (Decode.map KeyUp KeyCode.decoder)
                , Events.onKeyDown (Decode.map KeyDown KeyCode.decoder)
                , Events.onKeyPress (Decode.map KeyPress KeyCode.decoder)
                ]

            else
                []

        clockSubscriptions =
            if
                (flags |> Flags.isWaitingForInput)
                    || (flags |> Flags.isRunning |> not)
            then
                []

            else
                [ Time.every (1000 / 600) ClockTick ]

        gameSubscriptions =
            [ loadedGame LoadedGame ]

        subscriptionList =
            keyboardSubscriptions ++ clockSubscriptions ++ gameSubscriptions
    in
    Sub.batch subscriptionList


port loadedGame : (Array Int -> msg) -> Sub msg
