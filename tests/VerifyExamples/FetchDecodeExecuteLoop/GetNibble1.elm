module VerifyExamples.FetchDecodeExecuteLoop.GetNibble1 exposing (..)

-- This file got generated by [elm-verify-examples](https://github.com/stoeffel/elm-verify-examples).
-- Please don't modify this file by hand!

import Test
import Expect

import FetchDecodeExecuteLoop exposing (..)







spec1 : Test.Test
spec1 =
    Test.test "#getNibble: \n\n    getNibble 2 0x5678\n    --> Ok 7" <|
        \() ->
            Expect.equal
                (
                getNibble 2 0x5678
                )
                (
                Ok 7
                )