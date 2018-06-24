module Main exposing (main)

import Display
import Msg exposing (Msg(..))
import Model exposing (Model, initModel)
import Update exposing (update)
import Subscriptions exposing (subscriptions)
import View exposing (view)
import Html exposing (Html, program)


init : ( Model, Cmd Msg )
init =
    let
        model =
            initModel

        cmd =
            model |> Model.getDisplay |> Display.drawDisplay
    in
        ( model, cmd )


main : Program Never Model Msg
main =
    Html.program
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }
