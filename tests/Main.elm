port module Main exposing (..)

import Tests
import Test exposing (..)
import Test.Runner.Node exposing (run, TestProgram)
import Json.Encode exposing (Value)
import Doc.FetchDecodeExecuteLoopSpec as FDEL
import Doc.InstructionsSpec as Instructions


main : TestProgram
main =
    run emit
        (describe "Tests"
            [ Tests.all, FDEL.spec, Instructions.spec ]
        )


port emit : ( String, Value ) -> Cmd msg
