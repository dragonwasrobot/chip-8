module Chip8.KeyCode exposing (KeyCode(..), KeyMapping, decoder, nibbleValue)

import Chip8.Types exposing (Value4Bit)
import Json.Decode as Decode exposing (Decoder)
import List.Extra as List


{-| Mapping from standard keyboard codes to CHIP-8 keypad codes:
( Browser key code, CHIP-8 key code, optional description )
-}
type alias KeyMapping =
    { browserKeyCode : String
    , chip8KeyCode : KeyCode
    , description : Maybe String
    }


type KeyCode
    = KeyCode Value4Bit


nibbleValue : KeyCode -> Value4Bit
nibbleValue (KeyCode keyCode) =
    keyCode


decoder : List KeyMapping -> Decoder (Maybe KeyCode)
decoder keyMapping =
    Decode.map (toKeyCode keyMapping) (Decode.field "key" Decode.string)


toKeyCode : List KeyMapping -> String -> Maybe KeyCode
toKeyCode controls candidate =
    controls
        |> List.find (\mapping -> mapping.browserKeyCode == candidate)
        |> Maybe.map .chip8KeyCode
