module VerifyExamples.FetchDecodeExecuteLoop.GetNibble2 exposing (..)

-- This file got generated by [elm-verify-examples](https://github.com/stoeffel/elm-verify-examples).
-- Please don't modify this file by hand!

import Test
import Expect

import FetchDecodeExecuteLoop exposing (..)







spec2 : Test.Test
spec2 =
    Test.test "#getNibble: \n\n    getNibble 1 0x5678\n    --> Ok 6" <|
        \() ->
            Expect.equal
                (
                getNibble 1 0x5678
                )
                (
                Ok 6
                )