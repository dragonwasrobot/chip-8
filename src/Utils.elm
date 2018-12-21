module Utils exposing (getWithDefault, noCmd)

import Array exposing (Array)


getWithDefault : a -> Int -> Array a -> a
getWithDefault default idx array =
    Maybe.withDefault default <| Array.get idx array


noCmd : model -> ( model, Cmd msg )
noCmd model =
    ( model, Cmd.none )
