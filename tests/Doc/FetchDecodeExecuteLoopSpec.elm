module Doc.FetchDecodeExecuteLoopSpec exposing (spec)

-- This file got generated by [elm-verify-examples](https://github.com/stoeffel/elm-verify-examples).
-- Please don't modify this file by hand!

import Test
import Expect
import FetchDecodeExecuteLoop exposing(..)


spec : Test.Test
spec =
    Test.describe "FetchDecodeExecuteLoop" <|
    [
        Test.describe "#getNibble" <|
            [
            Test.test "Example: 1 -- `getNibble 0 0x5678 --> 5`" <|
                \() ->
                    Expect.equal
                        (
                            getNibble 0 0x5678
                        )
                        (
                            5
                        )
            , Test.test "Example: 2 -- `getNibble 1 0x5678 --> 6`" <|
                \() ->
                    Expect.equal
                        (
                            getNibble 1 0x5678
                        )
                        (
                            6
                        )
            , Test.test "Example: 3 -- `getNibble 2 0x5678 --> 7`" <|
                \() ->
                    Expect.equal
                        (
                            getNibble 2 0x5678
                        )
                        (
                            7
                        )
            , Test.test "Example: 4 -- `getNibble 3 0x5678 --> 8`" <|
                \() ->
                    Expect.equal
                        (
                            getNibble 3 0x5678
                        )
                        (
                            8
                        )
            ]
        , Test.describe "#getByte" <|
            [
            Test.test "Example: 1 -- `getByte 0x4321 --> 0x21`" <|
                \() ->
                    Expect.equal
                        (
                            getByte 0x4321
                        )
                        (
                            0x21
                        )
            ]
        , Test.describe "#dropFirstNibble" <|
            [
            Test.test "Example: 1 -- `dropFirstNibble 0x4321 --> 0x321`" <|
                \() ->
                    Expect.equal
                        (
                            dropFirstNibble 0x4321
                        )
                        (
                            0x321
                        )
            ]
        , Test.describe "#toHex" <|
            [
            Test.test "Example: 1 -- `toHex 0x4a2f --> \"4A2F\"`" <|
                \() ->
                    Expect.equal
                        (
                            toHex 0x4a2f
                        )
                        (
                            "4A2F"
                        )
            ]
    ]