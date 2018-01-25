module Main exposing (main)

import Display
import Msg exposing (Msg(..))
import Model exposing (Model, initModel)
import Ports
import Update exposing (update)
import View exposing (view)
import Html exposing (Html, program)
import Keyboard
import Time exposing (every, millisecond)


init : ( Model, Cmd Msg )
init =
    let
        model =
            initModel

        cmd =
            model |> Model.getDisplay |> Display.drawDisplay
    in
        ( model, cmd )


subscriptions : Sub Msg
subscriptions =
    Sub.batch
        [ Keyboard.ups KeyUp
        , Keyboard.downs KeyDown
        , Keyboard.presses KeyPress
        , Ports.step Step
        , Ports.pause Pause
        , Ports.printModel PrintModel
        , Time.every ((1000 / 600) * millisecond) ClockTick
        , Ports.loadedGame LoadedGame
        ]


main : Program Never Model Msg
main =
    Html.program
        { init = init
        , view = view
        , update = update
        , subscriptions = (\_ -> subscriptions)
        }
