module Model exposing
    ( Model
    , getDisplay
    , getFlags
    , getGames
    , getKeypad
    , getMemory
    , getRandomSeed
    , getRegisters
    , getSelectedGame
    , getStack
    , getTimers
    , initModel
    , setDisplay
    , setFlags
    , setKeypad
    , setMemory
    , setRandomSeed
    , setRegisters
    , setSelectedGame
    , setStack
    , setTimers
    )

{-| Model

Contains the state of the CHIP-8 emulator.

-}

import Display exposing (Display)
import Flags exposing (Flags)
import Games exposing (Game)
import Keypad exposing (Keypad)
import Memory exposing (Memory)
import Random exposing (Seed)
import Registers exposing (Registers)
import Stack exposing (Stack)
import Timers exposing (Timers)


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
    { memory = Memory.init
    , stack = Stack.init
    , registers = Registers.init
    , flags = Flags.init
    , display = Display.init
    , timers = Timers.init
    , keypad = Keypad.init
    , games = Games.init
    , selectedGame = Nothing
    , randomSeed = Random.initialSeed 49317
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
