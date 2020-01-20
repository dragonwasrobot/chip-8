module KeyCode exposing (KeyCode(..), KeyMapping, decoder, nibbleValue)

import Json.Decode as Decode exposing (Decoder)
import List.Extra as List
import Types exposing (Value4Bit)


{-| Mapping from standard keyboard codes to CHIP-8 keypad codes
-}
type alias KeyMapping =
    List ( String, KeyCode )


type KeyCode
    = KeyCode Value4Bit


nibbleValue : KeyCode -> Value4Bit
nibbleValue (KeyCode keyCode) =
    keyCode


decoder : KeyMapping -> Decoder (Maybe KeyCode)
decoder keyMapping =
    Decode.map (toKeyCode keyMapping) (Decode.field "key" Decode.string)


toKeyCode : KeyMapping -> String -> Maybe KeyCode
toKeyCode controls candidate =
    controls
        |> List.find (\( str, _ ) -> str == candidate)
        |> Maybe.map Tuple.second
