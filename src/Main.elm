module Main exposing (main)

import Browser
import Display
import Model exposing (Model, initModel)
import Msg exposing (Msg(..))
import Subscriptions exposing (subscriptions)
import Update exposing (update)
import View exposing (view)


init : () -> ( Model, Cmd Msg )
init flags =
    ( initModel, Cmd.none )


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }
