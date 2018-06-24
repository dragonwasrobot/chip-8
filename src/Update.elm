port module Update exposing (update)

import Array exposing (Array)
import FetchDecodeExecuteLoop
import Dict
import Display
import Flags exposing (Flags)
import List.Extra exposing (find, indexedFoldl)
import Keyboard exposing (KeyCode)
import Keypad
import Memory
import Model exposing (Model)
import Msg exposing (Msg(..))
import Registers exposing (Registers)
import Timers
import Types exposing (Value8Bit)
import Utils exposing (noCmd)


addKeyCode : KeyCode -> Model -> ( Model, Cmd Msg )
addKeyCode keyCode model =
    case model |> Model.getSelectedGame of
        Just game ->
            let
                newKeypad =
                    model
                        |> Model.getKeypad
                        |> Keypad.addKeyPress
                            keyCode
                            game.controls
            in
                model
                    |> Model.setKeypad newKeypad
                    |> checkIfWaitingForKeyPress keyCode

        Nothing ->
            model
                |> noCmd


removeKeyCode : KeyCode -> Model -> ( Model, Cmd Msg )
removeKeyCode keyCode model =
    model
        |> Model.getSelectedGame
        |> Maybe.map
            (\game ->
                let
                    newKeypad =
                        model
                            |> Model.getKeypad
                            |> Keypad.removeKeyPress
                                keyCode
                                game.controls
                in
                    model
                        |> Model.setKeypad newKeypad
            )
        |> Maybe.withDefault model
        |> noCmd


checkIfWaitingForKeyPress : KeyCode -> Model -> ( Model, Cmd Msg )
checkIfWaitingForKeyPress keyCode model =
    case
        ( model
            |> Model.getFlags
            |> Flags.getWaitingForInputRegister
        , model
            |> Model.getSelectedGame
            |> Maybe.andThen (.controls >> Dict.get keyCode)
        )
    of
        ( Just registerX, Just chip8KeyCode ) ->
            let
                newFlags =
                    model
                        |> Model.getFlags
                        |> Flags.setWaitingForInputRegister Nothing

                newRegisters =
                    model
                        |> Model.getRegisters
                        |> Registers.setDataRegister registerX chip8KeyCode
            in
                model
                    |> Model.setFlags newFlags
                    |> Model.setRegisters newRegisters
                    |> noCmd

        _ ->
            model
                |> noCmd


delayTick : Model -> ( Model, Cmd Msg )
delayTick model =
    let
        ( ( newRegisters, newTimers ), cmd ) =
            Timers.tick
                (model |> Model.getRegisters)
                (model |> Model.getTimers)
    in
        ( model
            |> Model.setRegisters newRegisters
            |> Model.setTimers newTimers
        , cmd
        )


clockTick : Model -> ( Model, Cmd Msg )
clockTick model =
    let
        flags =
            model |> Model.getFlags

        running =
            flags |> Flags.isRunning

        waitingForInput =
            flags |> Flags.isWaitingForInput

        speed =
            2
    in
        if running == True && waitingForInput == False then
            model |> FetchDecodeExecuteLoop.tick speed
        else
            ( model, Cmd.none )


selectGame : String -> Model -> ( Model, Cmd Msg )
selectGame gameName model =
    let
        selectedGame =
            find (.name >> (==) gameName) model.games
    in
        ( Model.initModel
            |> Model.setSelectedGame selectedGame
        , loadGame gameName
        )


port loadGame : String -> Cmd msg


reloadGame : Model -> ( Model, Cmd Msg )
reloadGame model =
    case model |> Model.getSelectedGame of
        Just game ->
            let
                freshModel =
                    Model.initModel

                ( newModel, cmd ) =
                    selectGame game.name freshModel
            in
                ( newModel
                , Cmd.batch
                    [ freshModel |> Model.getDisplay |> Display.drawDisplay
                    , cmd
                    ]
                )

        Nothing ->
            model |> noCmd


readProgram : Array Value8Bit -> Model -> ( Model, Cmd Msg )
readProgram programBytes model =
    let
        programStart =
            512

        newMemory =
            indexedFoldl
                (\idx val acc -> Memory.setCell (programStart + idx) val acc)
                (model |> Model.getMemory)
                (programBytes |> Array.toList)

        newRegisters =
            model
                |> Model.getRegisters
                |> Registers.setAddressRegister 0
                |> Registers.setProgramCounter programStart

        newFlags =
            model |> Model.getFlags |> Flags.setRunning True
    in
        model
            |> Model.setMemory newMemory
            |> Model.setRegisters newRegisters
            |> Model.setFlags newFlags
            |> noCmd


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case Debug.log "msg" msg of
        KeyDown keyCode ->
            addKeyCode keyCode model

        KeyUp keyCode ->
            removeKeyCode keyCode model

        KeyPress keyCode ->
            -- checkIfWaitingForKeyPress keyCode model
            model |> noCmd

        DelayTick ->
            delayTick model

        ClockTick _ ->
            clockTick model

        SelectGame gameName ->
            selectGame gameName model

        ReloadGame ->
            reloadGame model

        LoadedGame gameBytes ->
            readProgram gameBytes model
