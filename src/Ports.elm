port module Ports exposing (playSound, printError)


port printError : String -> Cmd msg


{-| Start playing the sound
-}
port playSound : Int -> Cmd msg
