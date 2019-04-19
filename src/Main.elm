module Main exposing (main)

import Array exposing (Array)
import Browser
import Browser.Events as BrowserEvents
import Canvas exposing (Renderable)
import Color
import Dict exposing (Dict)
import Display exposing (Cell, Display)
import FetchDecodeExecuteLoop
import Flags exposing (Flags)
import Games exposing (Game)
import Html exposing (..)
import Html.Attributes as Attr
import Html.Events as Events
import Http
import Json.Decode as Decode exposing (Decoder)
import KeyCode exposing (KeyCode)
import Keypad
import List.Extra as List
import Memory
import Msg exposing (Msg(..))
import Registers exposing (Registers)
import Request
import Time exposing (Posix)
import Timers
import Types exposing (Error, Value8Bit)
import VirtualMachine exposing (VirtualMachine)



-- INIT


init : () -> ( Model, Cmd Msg )
init _ =
    ( initModel, Cmd.none )


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }



-- MODEL


type alias Model =
    { virtualMachine : VirtualMachine
    , games : List Game
    , selectedGame : Maybe Game
    , error : Maybe Error
    }


initModel : Model
initModel =
    { virtualMachine = VirtualMachine.init
    , games = Games.init
    , selectedGame = Nothing
    , error = Nothing
    }



-- UPDATE


addKeyCode : Maybe KeyCode -> Model -> ( Model, Cmd Msg )
addKeyCode maybeKeyCode model =
    case maybeKeyCode of
        Just keyCode ->
            let
                newKeypad =
                    model.virtualMachine
                        |> VirtualMachine.getKeypad
                        |> Keypad.addKeyPress keyCode

                ( newVirtualMachine, cmd ) =
                    model.virtualMachine
                        |> VirtualMachine.setKeypad newKeypad
                        |> checkIfWaitingForKeyPress keyCode
            in
            ( { model | virtualMachine = newVirtualMachine }, cmd )

        _ ->
            ( model, Cmd.none )


removeKeyCode : Maybe KeyCode -> Model -> ( Model, Cmd Msg )
removeKeyCode maybeKeyCode model =
    case maybeKeyCode of
        Just keyCode ->
            let
                newKeypad =
                    model.virtualMachine
                        |> VirtualMachine.getKeypad
                        |> Keypad.removeKeyPress keyCode

                newVirtualMachine =
                    model.virtualMachine
                        |> VirtualMachine.setKeypad newKeypad
            in
            ( { model | virtualMachine = newVirtualMachine }, Cmd.none )

        Nothing ->
            ( model, Cmd.none )


checkIfWaitingForKeyPress : KeyCode -> VirtualMachine -> ( VirtualMachine, Cmd Msg )
checkIfWaitingForKeyPress keyCode virtualMachine =
    case virtualMachine |> VirtualMachine.getFlags |> Flags.getWaitingForInputRegister of
        Just registerX ->
            let
                newFlags =
                    virtualMachine
                        |> VirtualMachine.getFlags
                        |> Flags.setWaitingForInputRegister Nothing

                registers =
                    virtualMachine |> VirtualMachine.getRegisters

                newRegisters =
                    registers
                        |> Registers.setDataRegister registerX (KeyCode.nibbleValue keyCode)
                        |> Result.withDefault registers
            in
            ( virtualMachine
                |> VirtualMachine.setFlags newFlags
                |> VirtualMachine.setRegisters newRegisters
            , Cmd.none
            )

        _ ->
            ( virtualMachine, Cmd.none )


delayTick : Model -> ( Model, Cmd Msg )
delayTick model =
    let
        ( ( newRegisters, newTimers ), cmd ) =
            Timers.tick
                (model.virtualMachine |> VirtualMachine.getRegisters)
                (model.virtualMachine |> VirtualMachine.getTimers)

        newVirtualMachine =
            model.virtualMachine
                |> VirtualMachine.setRegisters newRegisters
                |> VirtualMachine.setTimers newTimers
    in
    ( { model | virtualMachine = newVirtualMachine }, cmd )


clockTick : Model -> ( Model, Cmd Msg )
clockTick model =
    let
        flags =
            model.virtualMachine |> VirtualMachine.getFlags

        running =
            flags |> Flags.isRunning

        waitingForInput =
            flags |> Flags.isWaitingForInput

        tickSpeed =
            2
    in
    if running == True && waitingForInput == False then
        let
            ( newVirtualMachine, cmd ) =
                model.virtualMachine |> FetchDecodeExecuteLoop.tick tickSpeed
        in
        ( { model | virtualMachine = newVirtualMachine }, cmd )

    else
        ( model, Cmd.none )


selectGame : String -> Model -> ( Model, Cmd Msg )
selectGame gameName model =
    let
        selectedGame =
            model.games |> List.find (.name >> (==) gameName)

        newVirtualMachine =
            VirtualMachine.init
    in
    ( { model
        | virtualMachine = newVirtualMachine
        , selectedGame = selectedGame
        , error = Nothing
      }
    , loadGame gameName
    )


loadGame : String -> Cmd Msg
loadGame gameName =
    Request.fetchRom gameName LoadedGame


reloadGame : Model -> ( Model, Cmd Msg )
reloadGame model =
    case model.selectedGame of
        Just game ->
            let
                ( newModel, cmd ) =
                    selectGame game.name model
            in
            ( newModel, cmd )

        Nothing ->
            ( model, Cmd.none )


readProgram : Result Http.Error (Array Value8Bit) -> Model -> ( Model, Cmd Msg )
readProgram programBytesResult model =
    case programBytesResult of
        Err error ->
            ( model, Cmd.none )

        Ok programBytes ->
            let
                programStart =
                    512

                memory =
                    model.virtualMachine |> VirtualMachine.getMemory

                newMemory =
                    (programBytes |> Array.toList)
                        |> List.indexedFoldl
                            (\idx value accMemory ->
                                accMemory
                                    |> Memory.setCell (programStart + idx) value
                                    |> Result.withDefault accMemory
                            )
                            memory

                newRegisters =
                    model.virtualMachine
                        |> VirtualMachine.getRegisters
                        |> Registers.setAddressRegister 0
                        |> Registers.setProgramCounter programStart

                newFlags =
                    model.virtualMachine
                        |> VirtualMachine.getFlags
                        |> Flags.setRunning True

                newVirtualMachine =
                    model.virtualMachine
                        |> VirtualMachine.setMemory newMemory
                        |> VirtualMachine.setRegisters newRegisters
                        |> VirtualMachine.setFlags newFlags
            in
            ( { model | virtualMachine = newVirtualMachine }, Cmd.none )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        KeyDown maybeKeyCode ->
            model |> addKeyCode maybeKeyCode

        KeyUp maybeKeyCode ->
            model |> removeKeyCode maybeKeyCode

        KeyPress keyCode ->
            ( model, Cmd.none )

        DelayTick ->
            model |> delayTick

        ClockTick _ ->
            model |> clockTick

        SelectGame gameName ->
            model |> selectGame gameName

        ReloadGame ->
            model |> reloadGame

        LoadedGame gameBytesResult ->
            model |> readProgram gameBytesResult



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    let
        flags =
            model.virtualMachine |> VirtualMachine.getFlags

        maybeGame =
            model.selectedGame

        subscriptionList =
            keyboardSubscriptions flags maybeGame ++ clockSubscriptions flags
    in
    Sub.batch subscriptionList


keyboardSubscriptions : Flags -> Maybe Game -> List (Sub Msg)
keyboardSubscriptions flags maybeGame =
    case ( Flags.isRunning flags, maybeGame ) of
        ( True, Just game ) ->
            let
                keyDecoder toMsg =
                    game.controls
                        |> KeyCode.decoder
                        |> Decode.map toMsg
            in
            [ BrowserEvents.onKeyUp (keyDecoder KeyUp)
            , BrowserEvents.onKeyDown (keyDecoder KeyDown)
            , BrowserEvents.onKeyPress (keyDecoder KeyPress)
            ]

        ( _, _ ) ->
            []


clockSubscriptions : Flags -> List (Sub Msg)
clockSubscriptions flags =
    if
        (flags |> Flags.isWaitingForInput)
            || (flags |> Flags.isRunning |> not)
    then
        []

    else
        [ Time.every (1000 / 600) ClockTick ]



-- VIEW


view : Model -> Html Msg
view model =
    div [ Attr.style "margin-top" "1em" ]
        [ viewHeader
        , viewCanvas model
        , viewGameSelector model
        , viewKeyMapping model
        ]


viewHeader : Html msg
viewHeader =
    h1 [] [ text "CHIP-8 EMULATOR" ]



{- Canvas and Drawing -}


cellSize =
    10


width =
    64 * cellSize


height =
    32 * cellSize


type alias Color =
    { red : Int
    , green : Int
    , blue : Int
    }


cellColor : Color
cellColor =
    { red = 33
    , green = 37
    , blue = 41
    }


backgroundColor : Color
backgroundColor =
    { red = 253
    , green = 246
    , blue = 227
    }


viewCanvas : Model -> Html Msg
viewCanvas model =
    Canvas.toHtml ( width, height ) [] <|
        renderDisplay model.virtualMachine.display <|
            [ Canvas.shapes
                [ Canvas.fill Color.white ]
                [ Canvas.rect ( 0, 0 ) width height ]
            ]


renderDisplay : Display -> List Renderable -> List Renderable
renderDisplay displayCells renderables =
    displayCells
        |> Array.toList
        |> List.indexedFoldl renderCellRow renderables


renderCellRow : Int -> Array Bool -> List Renderable -> List Renderable
renderCellRow rowIdx rowCells renderables =
    rowCells
        |> Array.toList
        |> List.indexedFoldl (renderCell rowIdx) renderables


renderCell : Int -> Int -> Bool -> List Renderable -> List Renderable
renderCell rowIdx columnIdx cellValue renderables =
    let
        color =
            if cellValue == True then
                Color.rgb255 cellColor.red cellColor.green cellColor.blue

            else
                Color.rgb255 backgroundColor.red backgroundColor.green backgroundColor.blue

        ( x, y ) =
            ( toFloat rowIdx * cellSize, toFloat columnIdx * cellSize )
    in
    renderables
        ++ [ Canvas.shapes [ Canvas.fill color ] [ Canvas.rect ( x, y ) cellSize cellSize ] ]


viewGameSelector : Model -> Html Msg
viewGameSelector model =
    let
        gameOption : Game -> Html Msg
        gameOption game =
            option [ Attr.value game.name ] [ text game.name ]

        gameOptions : List (Html Msg)
        gameOptions =
            option [ Attr.value "" ] [ text "SELECT GAME" ]
                :: List.map gameOption model.games

        gameSelector : List (Html Msg)
        gameSelector =
            [ div
                [ Attr.class "nes-select"
                , Attr.style "width" "15%"
                , Attr.style "left" "42.5%"
                , Attr.style "margin-bottom" "1em"
                ]
                [ select
                    [ Attr.id "game-selector"
                    , onChange SelectGame
                    ]
                    gameOptions
                ]
            ]

        reloadButton : List (Html Msg)
        reloadButton =
            [ button
                [ Attr.id "game-reload"
                , Attr.class "nes-btn is-warning"
                , Attr.style "margin-left" "0.5em"
                , Events.onClick ReloadGame
                ]
                [ text "RELOAD" ]
            ]
    in
    section
        [ Attr.id "games-container" ]
        (gameSelector ++ reloadButton)


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
        [ h3 [] [ text "CONTROLS" ]
        , ul [ Attr.id "key-mapping" ]
            (List.foldl toListItems [] keyMapping)
        ]


prettyPrintKey : String -> String
prettyPrintKey keyStr =
    case keyStr of
        " " ->
            "SPACE"

        "ArrowLeft" ->
            "LEFT ARROW"

        "ArrowUp" ->
            "UP ARROW"

        "ArrowRight" ->
            "RIGHT ARROW"

        "ArrowDown" ->
            "DOWN ARROW"

        alphaNumeric ->
            String.toUpper alphaNumeric
