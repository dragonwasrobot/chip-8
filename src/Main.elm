module Main exposing (InitFlags, Model, Msg, main)

import Array exposing (Array)
import Browser
import Browser.Events as BrowserEvents
import Canvas exposing (Renderable)
import Canvas.Settings exposing (fill)
import Chip8.Display as Display exposing (Display)
import Chip8.FetchDecodeExecuteLoop as FetchDecodeExecuteLoop
import Chip8.Flags as Flags exposing (Flags)
import Chip8.KeyCode as KeyCode exposing (KeyCode)
import Chip8.Keypad as Keypad
import Chip8.Memory as Memory
import Chip8.Registers as Registers
import Chip8.Timers as Timers exposing (DelayTimer(..))
import Chip8.Types exposing (RuntimeError, Value8Bit)
import Chip8.VirtualMachine as VirtualMachine exposing (VirtualMachine)
import Color exposing (Color)
import Games exposing (Game)
import Grid
import Html
    exposing
        ( Attribute
        , Html
        , button
        , div
        , h1
        , h3
        , li
        , option
        , section
        , select
        , text
        , ul
        )
import Html.Attributes as Attr
import Html.Events as Events
import Http exposing (Error(..))
import Json.Decode as Decode
import List.Extra as List
import Ports
import Process
import Request
import Task
import Time



-- * INIT


main : Program InitFlags Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


type alias InitFlags =
    { basePath : String
    , seed : Int
    }



-- * MODEL


init : InitFlags -> ( Model, Cmd Msg )
init flags =
    ( initModel flags, Cmd.none )


type alias Model =
    { virtualMachine : VirtualMachine
    , games : List Game
    , selectedGame : Maybe Game
    , error : Maybe RuntimeError
    , basePath : String
    , seed : Int
    }


initModel : InitFlags -> Model
initModel flags =
    { virtualMachine = VirtualMachine.init flags.seed
    , games = Games.init
    , selectedGame = Nothing
    , error = Nothing
    , basePath = flags.basePath
    , seed = flags.seed
    }



-- * UPDATE


type Msg
    = KeyUp (Maybe KeyCode)
    | KeyDown (Maybe KeyCode)
    | DelayTick
    | ClockTick
    | FadeTick
    | SelectGame String
    | ReloadGame
    | LoadedGame (Result Http.Error (Array Value8Bit))


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        KeyDown maybeKeyCode ->
            model |> addKeyCode maybeKeyCode

        KeyUp maybeKeyCode ->
            model |> removeKeyCode maybeKeyCode

        DelayTick ->
            model |> delayTick

        ClockTick ->
            model |> clockTick

        FadeTick ->
            model |> fadeTick

        SelectGame gameName ->
            model |> selectGame gameName

        ReloadGame ->
            model |> reloadGame

        LoadedGame gameBytesResult ->
            model |> readProgram gameBytesResult


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
        ( newRegisters, newTimers ) =
            Timers.delayTick
                (model.virtualMachine |> VirtualMachine.getRegisters)
                (model.virtualMachine |> VirtualMachine.getTimers)

        delayCmd =
            if Registers.getDelayTimer newRegisters > 0 then
                Timers.getDelayLength
                    |> Process.sleep
                    |> Task.perform (\_ -> DelayTick)

            else
                Cmd.none

        newVirtualMachine =
            model.virtualMachine
                |> VirtualMachine.setRegisters newRegisters
                |> VirtualMachine.setTimers newTimers
    in
    ( { model | virtualMachine = newVirtualMachine }, delayCmd )


clockTick : Model -> ( Model, Cmd Msg )
clockTick model =
    let
        flags =
            model.virtualMachine |> VirtualMachine.getFlags

        running =
            flags |> Flags.isRunning

        waitingForInput =
            flags |> Flags.isWaitingForInput
    in
    if running && waitingForInput == False then
        let
            virtualMachineResult =
                model.virtualMachine |> FetchDecodeExecuteLoop.tick
        in
        case virtualMachineResult of
            Err error ->
                ( model, Ports.printError error )

            Ok virtualMachine ->
                let
                    ( updatedTimers, delayCmd ) =
                        if (virtualMachine.timers |> Timers.getDelay) == Ready then
                            ( Timers.setDelay Running virtualMachine.timers
                            , Timers.getDelayLength
                                |> Process.sleep
                                |> Task.perform (\_ -> DelayTick)
                            )

                        else
                            ( virtualMachine.timers, Cmd.none )

                    playLength =
                        virtualMachine.timers
                            |> Timers.getSound
                            |> Timers.getPlayLength

                    soundCmd =
                        if playLength > 0 then
                            Ports.playSound playLength

                        else
                            Cmd.none

                    newVirtualMachine =
                        { virtualMachine | timers = Timers.clearSoundTimer updatedTimers }
                in
                ( { model | virtualMachine = newVirtualMachine }
                , Cmd.batch [ soundCmd, delayCmd ]
                )

    else
        ( model, Cmd.none )


fadeTick : Model -> ( Model, Cmd Msg )
fadeTick model =
    let
        newDisplay =
            model.virtualMachine
                |> VirtualMachine.getDisplay
                |> Display.decrementFade

        newVirtualMachine =
            model.virtualMachine |> VirtualMachine.setDisplay newDisplay
    in
    ( { model | virtualMachine = newVirtualMachine }, Cmd.none )


selectGame : String -> Model -> ( Model, Cmd Msg )
selectGame gameName model =
    let
        selectedGame =
            model.games |> List.find (.name >> (==) gameName)

        newVirtualMachine =
            VirtualMachine.init model.seed
    in
    ( { model
        | virtualMachine = newVirtualMachine
        , selectedGame = selectedGame
        , error = Nothing
      }
    , loadGame model.basePath gameName
    )


loadGame : String -> String -> Cmd Msg
loadGame basePath gameName =
    let
        gamePath =
            basePath ++ gameName
    in
    Request.fetchRom gamePath LoadedGame


reloadGame : Model -> ( Model, Cmd Msg )
reloadGame model =
    case model.selectedGame of
        Just game ->
            selectGame game.name model

        Nothing ->
            ( model, Cmd.none )


readProgram : Result Http.Error (Array Value8Bit) -> Model -> ( Model, Cmd Msg )
readProgram programBytesResult model =
    case programBytesResult of
        Err error ->
            let
                errorMessage =
                    case error of
                        BadUrl url ->
                            "Bad Url: " ++ url

                        Timeout ->
                            "Timeout error occurred"

                        NetworkError ->
                            "Timeout error occurred"

                        BadStatus statusCode ->
                            "Bad status code: " ++ String.fromInt statusCode

                        BadBody body ->
                            "Bad body: " ++ body
            in
            ( model, Ports.printError errorMessage )

        Ok programBytes ->
            let
                programStart =
                    512

                memory =
                    model.virtualMachine |> VirtualMachine.getMemory

                newMemory =
                    programBytes
                        |> Array.toList
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



-- * VIEW


view : Model -> Html Msg
view model =
    div [ Attr.id "container" ]
        [ viewHeader
        , viewCanvas model
        , viewGameSelector model
        , viewKeyMapping model
        ]


viewHeader : Html msg
viewHeader =
    h1 [] [ text "CHIP-8 EMULATOR" ]



{- Canvas and Drawing -}


cellSize : number
cellSize =
    10


width : number
width =
    64


height : number
height =
    32


cellColor : Color
cellColor =
    -- #212529
    Color.rgb255 33 37 41


viewCanvas : Model -> Html Msg
viewCanvas model =
    let
        shapes =
            Canvas.shapes
                [ fill Color.white ]
                [ Canvas.rect ( 0, 0 ) (width * cellSize) (height * cellSize) ]
                :: renderDisplay model.virtualMachine.display
    in
    Canvas.toHtml ( width * cellSize, height * cellSize )
        []
        shapes


renderDisplay : Display -> List Renderable
renderDisplay displayCells =
    Grid.fold2d { rows = height, cols = width }
        (renderCell displayCells)
        []


renderCell : Display -> ( Int, Int ) -> List Renderable -> List Renderable
renderCell display ( row, column ) renderables =
    if Display.isRendered display row column then
        let
            ( x, y ) =
                ( toFloat row * cellSize, toFloat column * cellSize )
        in
        Canvas.shapes
            [ fill cellColor ]
            [ Canvas.rect ( x, y ) cellSize cellSize ]
            :: renderables

    else
        renderables


viewGameSelector : Model -> Html Msg
viewGameSelector model =
    let
        toDisplayName game =
            game.name
                |> String.toUpper
                |> String.split "."
                |> List.head
                |> Maybe.withDefault "Unknown"

        gameOption : Game -> Html Msg
        gameOption game =
            option [ Attr.value game.name ] [ text <| toDisplayName <| game ]

        gameOptions : List (Html Msg)
        gameOptions =
            option [ Attr.value "" ] [ text "SELECT GAME" ]
                :: List.map gameOption model.games

        gameSelector : List (Html Msg)
        gameSelector =
            [ div
                [ Attr.class "nes-select is-dark centerish" ]
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
        keyMappings =
            case model.selectedGame of
                Just game ->
                    game.controls

                Nothing ->
                    []

        toListItems keyMapping acc =
            let
                keyCodeDescription =
                    keyMapping.description
                        |> Maybe.withDefault (keyMapping.browserKeyCode |> prettyPrintKey)
            in
            li [] [ text keyCodeDescription ] :: acc
    in
    div [ Attr.id "key-mapping-container" ]
        [ h3 [] [ text "CONTROLS" ]
        , ul [ Attr.id "key-mapping" ]
            (List.foldl toListItems [] keyMappings)
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



-- * SUBSCRIPTIONS


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
            ]

        _ ->
            []


clockSubscriptions : Flags -> List (Sub Msg)
clockSubscriptions flags =
    if flags |> Flags.isRunning |> not then
        []

    else
        let
            fadeSub =
                Time.every (1000 / 60) (\_ -> FadeTick)
        in
        if flags |> Flags.isWaitingForInput then
            [ fadeSub ]

        else
            [ Time.every (1000 / 600) (\_ -> ClockTick)
            , fadeSub
            ]
