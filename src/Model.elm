module Model
    exposing
        ( Model
        , initModel
        , getMemory
        , setMemory
        , getStack
        , setStack
        , getRegisters
        , setRegisters
        , getFlags
        , setFlags
        , getDisplay
        , setDisplay
        , getTimers
        , setTimers
        , getKeypad
        , setKeypad
        , getGames
        , getSelectedGame
        , setSelectedGame
        , getRandomSeed
        , setRandomSeed
        )

{-| Model

Contains the state of the CHIP-8 emulator.

-}

import Display exposing (Display, initDisplay)
import Games exposing (Game, initGames)
import Flags exposing (Flags, initFlags)
import Keypad exposing (Keypad, initKeypad)
import Memory exposing (Memory, initMemory)
import Random exposing (Seed, initialSeed)
import Registers exposing (Registers, initRegisters)
import Stack exposing (Stack, initStack)
import Timers exposing (Timers, initTimers)


type alias Model =
    { memory : Memory
    , stack : Stack
    , registers : Registers
    , flags : Flags
    , display : Display
    , timers : Timers
    , keypad : Keypad
    , games : List Game
    , selectedGame : Maybe Game
    , randomSeed : Seed
    }


initModel : Model
initModel =
    { memory = initMemory
    , stack = initStack
    , registers = initRegisters
    , flags = initFlags
    , display = initDisplay
    , timers = initTimers
    , keypad = initKeypad
    , games = initGames
    , selectedGame = Nothing
    , randomSeed = initialSeed 49317
    }


getMemory : Model -> Memory
getMemory model =
    model.memory


setMemory : Memory -> Model -> Model
setMemory memory model =
    { model | memory = memory }


getStack : Model -> Stack
getStack model =
    model.stack


setStack : Stack -> Model -> Model
setStack stack model =
    { model | stack = stack }


getRegisters : Model -> Registers
getRegisters model =
    model.registers


setRegisters : Registers -> Model -> Model
setRegisters registers model =
    { model | registers = registers }


getFlags : Model -> Flags
getFlags model =
    model.flags


setFlags : Flags -> Model -> Model
setFlags flags model =
    { model | flags = flags }


getDisplay : Model -> Display
getDisplay model =
    model.display


setDisplay : Display -> Model -> Model
setDisplay display model =
    { model | display = display }


getTimers : Model -> Timers
getTimers model =
    model.timers


setTimers : Timers -> Model -> Model
setTimers timers model =
    { model | timers = timers }


getKeypad : Model -> Keypad
getKeypad model =
    model.keypad


setKeypad : Keypad -> Model -> Model
setKeypad keypad model =
    { model | keypad = keypad }


getGames : Model -> List Game
getGames model =
    model.games


getSelectedGame : Model -> Maybe Game
getSelectedGame model =
    model.selectedGame


setSelectedGame : Maybe Game -> Model -> Model
setSelectedGame maybeGame model =
    { model | selectedGame = maybeGame }


getRandomSeed : Model -> Seed
getRandomSeed model =
    model.randomSeed


setRandomSeed : Seed -> Model -> Model
setRandomSeed seed model =
    { model | randomSeed = seed }
