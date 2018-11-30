module Utils exposing (getWithDefault, noCmd, setTimeout)

import Array exposing (Array)
import Process
import Task
import Time exposing (Posix)


getWithDefault : a -> Int -> Array a -> a
getWithDefault default idx array =
    Maybe.withDefault default <| Array.get idx array


setTimeout : Float -> msg -> Cmd msg
setTimeout time msg =
    Process.sleep time
        |> Task.perform (\_ -> msg)


noCmd : model -> ( model, Cmd msg )
noCmd model =
    ( model, Cmd.none )
