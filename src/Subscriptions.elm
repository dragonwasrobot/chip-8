port module Subscriptions exposing (subscriptions)

import Array exposing (Array)
import Flags
import Keyboard
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
                [ Keyboard.ups KeyUp
                , Keyboard.downs KeyDown
                , Keyboard.presses KeyPress
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
                [ Time.every ((1000 / 600) * Time.millisecond) ClockTick ]

        gameSubscriptions =
            [ loadedGame LoadedGame ]

        subscriptionList =
            keyboardSubscriptions ++ clockSubscriptions ++ gameSubscriptions
    in
        Sub.batch subscriptionList


port loadedGame : (Array Int -> msg) -> Sub msg
