require '../app/src/chip_8'

exports.chip8Test = {

  'test can clear display': (test) ->
    inst_00E0_CLS()
    test.equal(display, ((0 for j in [0...displayHeight]) for i in [0...displayWidth]))
    test.done()

}
