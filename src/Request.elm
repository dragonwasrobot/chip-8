module Request exposing (fetchRom)

import Array exposing (Array)
import Bytes exposing (Bytes)
import Bytes.Decode as Decode exposing (Decoder, Step(..))
import Http exposing (Error(..), Response(..))
import Types exposing (Value8Bit)


romsUrlPrefix : String
romsUrlPrefix =
    -- Use /roms/ for dev, /chip-8/roms for prod
    "/roms/"


fetchRom : String -> (Result Error (Array Value8Bit) -> msg) -> Cmd msg
fetchRom romName toMsg =
    Http.get
        { url = romsUrlPrefix ++ romName
        , expect = Http.expectBytesResponse toMsg decodeBytesResponse
        }


decodeBytesResponse : Response Bytes -> Result Error (Array Value8Bit)
decodeBytesResponse response =
    case response of
        BadUrl_ url ->
            Err (BadUrl url)

        Timeout_ ->
            Err Timeout

        NetworkError_ ->
            Err NetworkError

        BadStatus_ metadata _ ->
            Err (BadStatus metadata.statusCode)

        GoodStatus_ _ bytes ->
            case Decode.decode (romDecoder (Bytes.width bytes)) bytes of
                Just rom ->
                    Ok rom

                Nothing ->
                    Err (BadBody "Could not decode bytes payload")


romDecoder : Int -> Decoder (Array Value8Bit)
romDecoder width =
    Decode.map Array.fromList <| byteListDecoder Decode.unsignedInt8 width


byteListDecoder : Decoder a -> Int -> Decoder (List a)
byteListDecoder decoder width =
    Decode.loop ( width, [] ) (listStep decoder)


listStep : Decoder a -> ( Int, List a ) -> Decoder (Step ( Int, List a ) (List a))
listStep decoder ( n, xs ) =
    if n <= 0 then
        Decode.succeed (Done (List.reverse xs))

    else
        Decode.map (\x -> Loop ( n - 1, x :: xs )) decoder
