module FetchDecodeExecuteLoop
    exposing
        ( tick
        , getNibble
        , fetchOpcode
        , getByte
        , dropFirstNibble
        , toHex
        )

import Bitwise
import Flags exposing (Flags)
import Hex
import Instructions
import Model exposing (Model)
import Memory exposing (Memory)
import Msg exposing (Msg(..))
import Registers exposing (Registers)
import Types exposing (Value4Bit, Value8Bit, Value12Bit, Value16Bit)


{-| Gets the n'th nibble of a 16 bit word

    -- Get first nibble

    getNibble 0 0x5678
    --> 5

    getNibble 1 0x5678
    --> 6

    getNibble 2 0x5678
    --> 7

    getNibble 3 0x5678
    --> 8

-}
getNibble : Int -> Value16Bit -> Value4Bit
getNibble n opcode =
    if List.member n [ 0, 1, 2, 3 ] then
        opcode
            |> Bitwise.shiftLeftBy (4 * n)
            |> (\value -> value % 0xFFFF)
            |> Bitwise.shiftRightBy 12
    else
        Debug.crash <|
            ("expected 'n' to be in [0,1,2,3] was '" ++ toString n ++ "'")


{-| Gets the trailing byte from a 16-bit opcode

    getByte 0x4321
    --> 0x21

-}
getByte : Value16Bit -> Value8Bit
getByte opcode =
    opcode
        |> Bitwise.shiftLeftBy 8
        |> (\value -> value % 0xFFFF)
        |> Bitwise.shiftRightBy 8


fetchOpcode : Memory -> Value16Bit -> Value16Bit
fetchOpcode memory programCounter =
    let
        firstNibble =
            memory |> Memory.getCell programCounter

        secondNibble =
            memory |> Memory.getCell (programCounter + 1)
    in
        Bitwise.or (Bitwise.shiftLeftBy 8 firstNibble) secondNibble


{-| Drops the first nibble in 16-bit opcode

    dropFirstNibble 0x4321
    --> 0x321

-}
dropFirstNibble : Value16Bit -> Value12Bit
dropFirstNibble opcode =
    opcode
        |> Bitwise.shiftLeftBy 4
        |> (\v -> v % 0xFFFF)
        |> Bitwise.shiftRightBy 4


{-| Converts an int to its hexadecimal string representation

    toHex 0x4a2f
    --> "4A2F"

-}
toHex : Value16Bit -> String
toHex int =
    int |> Hex.toString |> String.toUpper


handle0 : Model -> Value16Bit -> ( Model, Cmd Msg )
handle0 model opcode =
    case getByte opcode of
        0xE0 ->
            Instructions.clearDisplay model

        0xEE ->
            Instructions.returnFromSubroutine model

        _ ->
            Debug.crash <| "Unknown opcode: " ++ (toHex opcode)


handle1 : Model -> Value16Bit -> ( Model, Cmd Msg )
handle1 model opcode =
    opcode |> dropFirstNibble |> Instructions.jumpAbsolute model


handle2 : Model -> Value16Bit -> ( Model, Cmd Msg )
handle2 model opcode =
    opcode |> dropFirstNibble |> Instructions.callSubroutine model


handle3 : Model -> Value16Bit -> ( Model, Cmd Msg )
handle3 model opcode =
    let
        register =
            opcode |> getNibble 1

        value =
            opcode |> getByte
    in
        Instructions.skipNextIfEqualConstant model register value


handle4 : Model -> Value16Bit -> ( Model, Cmd Msg )
handle4 model opcode =
    let
        register =
            opcode |> getNibble 1

        value =
            opcode |> getByte
    in
        Instructions.skipNextIfNotEqualConstant model register value


handle5 : Model -> Value16Bit -> ( Model, Cmd Msg )
handle5 model opcode =
    let
        registerX =
            opcode |> getNibble 1

        registerY =
            opcode |> getNibble 2
    in
        if (opcode |> getNibble 3) /= 0 then
            Debug.crash <| "Unknown opcode: " ++ (toHex opcode)
        else
            Instructions.skipNextIfRegistersEqual model registerX registerY


handle6 : Model -> Value16Bit -> ( Model, Cmd Msg )
handle6 model opcode =
    let
        registerX =
            opcode |> getNibble 1

        value =
            opcode |> getByte
    in
        Instructions.setRegisterToConstant model registerX value


handle7 : Model -> Value16Bit -> ( Model, Cmd Msg )
handle7 model opcode =
    let
        registerX =
            opcode |> getNibble 1

        value =
            opcode |> getByte
    in
        Instructions.addToRegister model registerX value


handle8 : Model -> Value16Bit -> ( Model, Cmd Msg )
handle8 model opcode =
    let
        registerX =
            opcode |> getNibble 1

        registerY =
            opcode |> getNibble 2

        nibble =
            opcode |> getNibble 3
    in
        case nibble of
            0x00 ->
                Instructions.setRegisterToRegister model registerX registerY

            0x01 ->
                Instructions.setRegisterOr model registerX registerY

            0x02 ->
                Instructions.setRegisterAnd model registerX registerY

            0x03 ->
                Instructions.setRegisterXor model registerX registerY

            0x04 ->
                Instructions.setRegisterAdd model registerX registerY

            0x05 ->
                Instructions.setRegisterSub model registerX registerY

            0x06 ->
                Instructions.setRegisterShiftRight model registerX

            0x07 ->
                Instructions.setRegisterSubFlipped model registerX registerY

            0x0E ->
                Instructions.setRegisterShiftLeft model registerX

            other ->
                Debug.crash <| "Unknown opcode: " ++ (toHex opcode)


handle9 : Model -> Value16Bit -> ( Model, Cmd Msg )
handle9 model opcode =
    let
        registerX =
            opcode |> getNibble 1

        registerY =
            opcode |> getNibble 2

        nibble =
            opcode |> getNibble 3
    in
        if nibble /= 0 then
            Debug.crash <| "Unknown opcode: " ++ (toHex opcode)
        else
            Instructions.skipNextIfRegistersNotEqual model registerX registerY


handleA : Model -> Value16Bit -> ( Model, Cmd Msg )
handleA model opcode =
    Instructions.setAddressRegisterToConstant model (opcode |> dropFirstNibble)


handleB : Model -> Value16Bit -> ( Model, Cmd Msg )
handleB model opcode =
    Instructions.jumpRelative model (opcode |> dropFirstNibble)


handleC : Model -> Value16Bit -> ( Model, Cmd Msg )
handleC model opcode =
    let
        registerX =
            opcode |> getNibble 1

        value =
            opcode |> getByte
    in
        Instructions.setRegisterRandom model registerX value


handleD : Model -> Value16Bit -> ( Model, Cmd Msg )
handleD model opcode =
    let
        registerX =
            opcode |> getNibble 1

        registerY =
            opcode |> getNibble 2

        n =
            opcode |> getNibble 3
    in
        Instructions.displaySprite model registerX registerY n


handleE : Model -> Value16Bit -> ( Model, Cmd Msg )
handleE model opcode =
    let
        registerX =
            opcode |> getNibble 1

        byte =
            opcode |> getByte
    in
        case byte of
            0x9E ->
                Instructions.skipNextIfKeyPressed model registerX

            0xA1 ->
                Instructions.skipNextIfKeyNotPressed model registerX

            other ->
                Debug.crash <| "Unknown opcode: " ++ (toHex opcode)


handleF : Model -> Value16Bit -> ( Model, Cmd Msg )
handleF model opcode =
    let
        registerX =
            opcode |> getNibble 1

        byte =
            opcode |> getByte
    in
        case byte of
            0x07 ->
                Instructions.setRegisterToDelayTimer model registerX

            0x0A ->
                Instructions.waitForKeyPress model registerX

            0x15 ->
                Instructions.setDelayTimerToRegisterValue model registerX

            0x18 ->
                Instructions.setSoundTimerToRegisterValue model registerX

            0x1E ->
                Instructions.addToAddressRegister model registerX

            0x29 ->
                Instructions.setAddressRegisterToSpriteLocation model registerX

            0x33 ->
                Instructions.storeBcdOfRegister model registerX

            0x55 ->
                Instructions.storeRegistersAtAddressRegister model registerX

            0x65 ->
                Instructions.readRegistersFromAddressRegister model registerX

            other ->
                Debug.crash <| "Unknown opcode: " ++ (toHex opcode)


executeOpcode : Model -> Value16Bit -> ( Model, Cmd Msg )
executeOpcode model opcode =
    case opcode |> getNibble 0 of
        0x00 ->
            handle0 model opcode

        0x01 ->
            handle1 model opcode

        0x02 ->
            handle2 model opcode

        0x03 ->
            handle3 model opcode

        0x04 ->
            handle4 model opcode

        0x05 ->
            handle5 model opcode

        0x06 ->
            handle6 model opcode

        0x07 ->
            handle7 model opcode

        0x08 ->
            handle8 model opcode

        0x09 ->
            handle9 model opcode

        0x0A ->
            handleA model opcode

        0x0B ->
            handleB model opcode

        0x0C ->
            handleC model opcode

        0x0D ->
            handleD model opcode

        0x0E ->
            handleE model opcode

        0x0F ->
            handleF model opcode

        other ->
            Debug.crash <| "Unknown opcode: " ++ (toHex opcode)


performCycle : Flags -> Model -> ( Model, Cmd Msg )
performCycle flags model =
    if flags.waitingForInput == True then
        ( model, Cmd.none )
    else
        let
            memory =
                model |> Model.getMemory

            programCounter =
                model |> Model.getRegisters |> Registers.getProgramCounter

            opcode =
                programCounter |> fetchOpcode memory

            ( resultModel, cmd ) =
                -- let
                --     _ =
                --         Debug.log "(PC, opcode)" ( programCounter, toHex opcode )
                -- in
                executeOpcode model opcode

            newRegisters =
                resultModel
                    |> Model.getRegisters
                    |> Registers.incrementProgramCounter

            newModel =
                resultModel |> Model.setRegisters newRegisters
        in
            ( newModel, cmd )


{-| Perform a clock tick

    For each clock tick, we fetch and execute 10 instruction.

-}
tick : Int -> Model -> ( Model, Cmd Msg )
tick instructions model =
    let
        ( newModel, newCmds ) =
            List.foldl
                (\_ ( accModel, accCmds ) ->
                    let
                        flags =
                            accModel |> Model.getFlags

                        running =
                            flags |> Flags.isRunning
                    in
                        let
                            ( updatedModel, cmd ) =
                                performCycle flags accModel
                        in
                            ( updatedModel, cmd :: accCmds )
                )
                ( model, [] )
                (List.range 0 instructions)
    in
        if List.isEmpty newCmds then
            ( newModel, Cmd.none )
        else
            ( newModel, Cmd.batch <| List.reverse newCmds )
