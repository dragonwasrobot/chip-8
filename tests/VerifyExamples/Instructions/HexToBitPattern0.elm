module VerifyExamples.Instructions.HexToBitPattern0 exposing (..)

-- This file got generated by [elm-verify-examples](https://github.com/stoeffel/elm-verify-examples).
-- Please don't modify this file by hand!

import Test
import Expect

import Instructions exposing (..)







spec0 : Test.Test
spec0 =
    Test.test "#hexToBitPattern: \n\n    hexToBitPattern 43\n    --> [False, False, True, False, True, False, True, True]" <|
        \() ->
            Expect.equal
                (
                hexToBitPattern 43
                )
                (
                [False, False, True, False, True, False, True, True]
                )