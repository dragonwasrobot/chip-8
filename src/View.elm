module View exposing (view)

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
                    game.controls

                Nothing ->
                    []

        toListItems ( keyStr, keyPadValue ) acc =
            li [] [ keyStr |> prettyPrintKey |> text ] :: acc
    in
    div [ id "key-mapping-container" ]
        [ h3 [] [ text "Controls" ]
        , ul [ id "key-mapping" ]
            (List.foldl toListItems [] keyMapping)
        ]


prettyPrintKey : String -> String
prettyPrintKey keyStr =
    case keyStr of
        " " ->
            "Space"

        "ArrowLeft" ->
            "Left arrow"

        "ArrowUp" ->
            "Up arrow"

        "ArrowRight" ->
            "Right arrow"

        "ArrowDown" ->
            "Down arrow"

        alphaNumeric ->
            String.toUpper alphaNumeric
