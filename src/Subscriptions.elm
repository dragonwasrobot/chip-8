port module Subscriptions exposing (subscriptions)

-- import Keyboard

import Array exposing (Array)
import Browser.Events as Events
import Flags exposing (Flags)
import Games exposing (Game)
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

        maybeGame =
            model |> Model.getSelectedGame

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
            keyboardSubscriptions flags maybeGame ++ clockSubscriptions ++ gameSubscriptions
    in
    Sub.batch subscriptionList


keyboardSubscriptions : Flags -> Maybe Game -> List (Sub Msg)
keyboardSubscriptions flags maybeGame =
    case ( Flags.isRunning flags, maybeGame ) of
        ( True, Just game ) ->
            let
                keyDecoder toMsg =
                    game.controls
                        |> KeyCode.decoder
                        |> Decode.map toMsg
            in
            [ Events.onKeyUp (keyDecoder KeyUp)
            , Events.onKeyDown (keyDecoder KeyDown)
            , Events.onKeyPress (keyDecoder KeyPress)
            ]

        ( _, _ ) ->
            []


port loadedGame : (Array Int -> msg) -> Sub msg
