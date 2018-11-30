module KeyCode exposing (KeyCode(..), decoder, intValue)

import Json.Decode as Decode exposing (Decoder)


type KeyCode
    = KeyCode Int


intValue : KeyCode -> Int
intValue (KeyCode keyCode) =
    keyCode


decoder : Decoder KeyCode
decoder =
    Decode.map toKeyCode (Decode.field "key" Decode.string)


toKeyCode : String -> KeyCode
toKeyCode key =
    case Debug.log "Key" key of
        " " ->
            KeyCode 32

        "ArrowLeft" ->
            KeyCode 37

        "ArrowUp" ->
            KeyCode 38

        "ArrowRight" ->
            KeyCode 39

        "ArrowDown" ->
            KeyCode 40

        "5" ->
            KeyCode 53

        "6" ->
            KeyCode 54

        "7" ->
            KeyCode 55

        "F" ->
            KeyCode 70

        "G" ->
            KeyCode 71

        "H" ->
            KeyCode 72

        "I" ->
            KeyCode 73

        "K" ->
            KeyCode 75

        "R" ->
            KeyCode 82

        "S" ->
            KeyCode 83

        "T" ->
            KeyCode 84

        "W" ->
            KeyCode 87

        "Y" ->
            KeyCode 89

        someKey ->
            KeyCode 0
