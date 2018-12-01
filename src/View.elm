module View exposing (view)

import Array exposing (Array)
import Canvas exposing (Commands)
import CanvasColor as Color
import Dict exposing (Dict)
import Display exposing (Cell, Display)
import Html exposing (..)
import Html.Attributes as Attr
import Html.Events as Events
import Json.Decode as Decode
import List.Extra as List
import Model exposing (Model)
import Msg exposing (Msg(..))


type alias KeyCode =
    Int


view : Model -> Html Msg
view model =
    div []
        [ viewHeader
        , viewCanvas model
        , viewGameSelector model
        , viewKeyMapping model
        ]


viewHeader : Html msg
viewHeader =
    h1 [] [ text "CHIP-8 emulator" ]



{- Canvas and Drawing

   The display is rendered with 10x10 pixel cells and we use a
   bright retro green for coloring the pixels.

-}


cellSize =
    10


width =
    64 * cellSize


height =
    32 * cellSize


cellColor =
    { red = 181
    , green = 232
    , blue = 82
    , gray = 38
    }


viewCanvas : Model -> Html Msg
viewCanvas model =
    let
        display =
            model.display
    in
    Canvas.element
        width
        height
        []
        (Canvas.empty
            |> Canvas.strokeStyle (Color.rgba cellColor.red cellColor.green cellColor.blue 1)
            |> Canvas.clearRect 0 0 width height
            |> renderDisplay display
        )


renderDisplay : Display -> Commands -> Commands
renderDisplay displayCells commands =
    displayCells
        |> Array.toList
        |> List.indexedFoldl renderCellRow commands


renderCellRow : Int -> Array Bool -> Commands -> Commands
renderCellRow rowIdx rowCells commands =
    rowCells
        |> Array.toList
        |> List.indexedFoldl (renderCell rowIdx) commands


renderCell : Int -> Int -> Bool -> Commands -> Commands
renderCell rowIdx columnIdx cellValue commands =
    let
        color =
            if cellValue == True then
                Color.rgba cellColor.red cellColor.green cellColor.blue 1

            else
                Color.rgba cellColor.gray cellColor.gray cellColor.gray 1

        ( x, y ) =
            ( toFloat rowIdx * cellSize, toFloat columnIdx * cellSize )
    in
    commands
        |> Canvas.fillStyle color
        |> Canvas.fillRect x y cellSize cellSize


viewGameSelector : Model -> Html Msg
viewGameSelector model =
    let
        gameOption game =
            option [ Attr.value game.name ] [ text game.name ]

        gameOptions =
            option [ Attr.value "" ] [ text "SELECT GAME" ]
                :: List.map (\game -> gameOption game) model.games
    in
    div [ Attr.id "games-container" ]
        [ select
            [ Attr.id "game-selector"
            , onChange SelectGame
            ]
            gameOptions
        , button
            [ Attr.id "game-reload"
            , Events.onClick ReloadGame
            ]
            [ text "Reload" ]
        ]


onChange : (String -> msg) -> Attribute msg
onChange tagger =
    Events.on "change" (Decode.map tagger Events.targetValue)


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
    div [ Attr.id "key-mapping-container" ]
        [ h3 [] [ text "Controls" ]
        , ul [ Attr.id "key-mapping" ]
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
