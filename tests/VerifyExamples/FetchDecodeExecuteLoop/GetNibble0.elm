module VerifyExamples.FetchDecodeExecuteLoop.GetNibble0 exposing (..)

-- This file got generated by [elm-verify-examples](https://github.com/stoeffel/elm-verify-examples).
-- Please don't modify this file by hand!

import Test
import Expect

import FetchDecodeExecuteLoop exposing (..)







spec0 : Test.Test
spec0 =
    Test.test "#getNibble: \n\n    getNibble 3 0x5678\n    --> Ok 8" <|
        \() ->
            Expect.equal
                (
                getNibble 3 0x5678
                )
                (
                Ok 8
                )