module View exposing (view)

-- import Keyboard exposing (KeyCode)

import Dict exposing (Dict)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (on, onClick, targetValue)
import Json.Decode as Decode
import Model exposing (Model)
import Msg exposing (Msg(..))


type alias KeyCode =
    Int


view : Model -> Html Msg
view model =
    div []
        [ viewHeader
        , viewCanvas
        , viewGameSelector model
        , viewKeyMapping model
        ]


viewHeader : Html msg
viewHeader =
    h1 [] [ text "CHIP-8 emulator" ]


viewCanvas : Html Msg
viewCanvas =
    canvas [ id "visible-canvas" ] []


viewGameSelector : Model -> Html Msg
viewGameSelector model =
    let
        gameOption game =
            option [ value game.name ] [ text game.name ]

        gameOptions =
            option [ value "" ] [ text "SELECT GAME" ]
                :: List.map (\game -> gameOption game) model.games
    in
    div [ id "games-container" ]
        [ select
            [ id "game-selector"
            , onChange SelectGame
            ]
            gameOptions
        , button
            [ id "game-reload"
            , onClick ReloadGame
            ]
            [ text "Reload" ]
        ]


onChange : (String -> msg) -> Attribute msg
onChange tagger =
    on "change" (Decode.map tagger targetValue)


viewKeyMapping : Model -> Html Msg
viewKeyMapping model =
    let
        keyMapping =
            case model.selectedGame of
                Just game ->
                    Dict.toList game.controls

                Nothing ->
                    []

        toListItems ( keyCode, keyPadValue ) acc =
            case Dict.get keyCode keyMap of
                Just keyName ->
                    li [] [ text keyName ] :: acc

                Nothing ->
                    acc
    in
    div [ id "key-mapping-container" ]
        [ h3 [] [ text "Controls" ]
        , ul [ id "key-mapping" ]
            (List.foldl toListItems [] keyMapping)
        ]


keyMap : Dict KeyCode String
keyMap =
    Dict.empty
        |> Dict.insert 32 "Space"
        |> Dict.insert 37 "Left arrow"
        |> Dict.insert 38 "Up arrow"
        |> Dict.insert 39 "Right arrow"
        |> Dict.insert 40 "Down arrow"
        |> Dict.insert 53 "5"
        |> Dict.insert 54 "6"
        |> Dict.insert 55 "7"
        |> Dict.insert 70 "F"
        |> Dict.insert 71 "G"
        |> Dict.insert 72 "H"
        |> Dict.insert 73 "I"
        |> Dict.insert 75 "K"
        |> Dict.insert 82 "R"
        |> Dict.insert 83 "S"
        |> Dict.insert 84 "T"
        |> Dict.insert 87 "W"
        |> Dict.insert 89 "Y"
