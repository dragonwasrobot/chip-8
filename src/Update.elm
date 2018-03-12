module Update exposing (update)

import Array exposing (Array)
import FetchDecodeExecuteLoop
import Display
import Flags exposing (Flags)
import List.Extra exposing (find, indexedFoldl)
import Keyboard exposing (KeyCode)
import Keypad
import Memory
import Model exposing (Model)
import Msg exposing (Msg(..))
import Ports
import Registers exposing (Registers)
import Timers
import Types exposing (Value8Bit)


addKeyCode : Model -> KeyCode -> ( Model, Cmd Msg )
addKeyCode model keyCode =
    case model |> Model.getSelectedGame of
        Just game ->
            let
                keyMapping =
                    game.controls

                newKeypad =
                    model
                        |> Model.getKeypad
                        |> Keypad.addKeyPress keyCode keyMapping
            in
                ( model |> Model.setKeypad newKeypad, Cmd.none )

        Nothing ->
            ( model, Cmd.none )


removeKeyCode : Model -> KeyCode -> ( Model, Cmd Msg )
removeKeyCode model keyCode =
    case Model.getSelectedGame model of
        Just game ->
            let
                keyMapping =
                    game.controls

                newKeypad =
                    model
                        |> Model.getKeypad
                        |> Keypad.removeKeyPress keyCode keyMapping
            in
                ( model |> Model.setKeypad newKeypad, Cmd.none )

        Nothing ->
            ( model, Cmd.none )


waitForKeyPress :
    Model
    -> Value8Bit
    -> ( Model, Cmd Msg )
waitForKeyPress model registerX =
    let
        flags =
            model |> Model.getFlags

        registers =
            model |> Model.getRegisters

        keypad =
            model |> Model.getKeypad

        ( ( newFlags, newRegisters ), cmd ) =
            Keypad.waitForKeyPress keypad ( flags, registers ) registerX
    in
        ( model |> Model.setFlags newFlags |> Model.setRegisters newRegisters
        , cmd
        )


delayTick : Model -> ( Model, Cmd Msg )
delayTick model =
    let
        ( ( newRegisters, newTimers ), cmd ) =
            Timers.tick (model |> Model.getRegisters) (model |> Model.getTimers)
    in
        ( model |> Model.setRegisters newRegisters |> Model.setTimers newTimers
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


selectGame : Model -> String -> ( Model, Cmd Msg )
selectGame model gameName =
    let
        selectedGame =
            find (\game -> game.name == gameName) model.games

        freshModel =
            Model.initModel
    in
        ( freshModel
            |> Model.setSelectedGame selectedGame
        , Ports.loadGame gameName
        )


reloadGame : Model -> ( Model, Cmd Msg )
reloadGame model =
    case model |> Model.getSelectedGame of
        Just game ->
            let
                freshModel =
                    Model.initModel

                ( newModel, cmd ) =
                    selectGame freshModel game.name
            in
                ( newModel
                , Cmd.batch
                    [ freshModel |> Model.getDisplay |> Display.drawDisplay
                    , cmd
                    ]
                )

        Nothing ->
            ( model, Cmd.none )


readProgram : Model -> Array Value8Bit -> ( Model, Cmd Msg )
readProgram model programBytes =
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
        ( model
            |> Model.setMemory newMemory
            |> Model.setRegisters newRegisters
            |> Model.setFlags newFlags
        , Cmd.none
        )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        KeyDown keyCode ->
            addKeyCode model keyCode

        KeyUp keyCode ->
            removeKeyCode model keyCode

        KeyPress keyCode ->
            ( model, Cmd.none )

        WaitForKeyPress registerX ->
            waitForKeyPress model registerX

        DelayTick ->
            delayTick model

        ClockTick t ->
            clockTick model

        Step steps ->
            FetchDecodeExecuteLoop.tick steps model

        PrintModel args ->
            let
                _ =
                    Debug.log "memory" (model |> Model.getMemory)

                _ =
                    Debug.log "registers" (model |> Model.getRegisters)

                _ =
                    Debug.log "flags" (model |> Model.getFlags)
            in
                ( model, Cmd.none )

        Pause _ ->
            let
                newFlags =
                    model |> Model.getFlags |> Flags.setRunning False
            in
                ( model |> Model.setFlags newFlags, Cmd.none )

        SelectGame gameName ->
            selectGame model gameName

        ReloadGame ->
            reloadGame model

        LoadedGame gameBytes ->
            readProgram model gameBytes
