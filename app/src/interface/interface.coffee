# # Interface

# author: Peter Urbak <peter@dragonwasrobot.com> <br/>
# version: 2015-01-25

$(document).ready () ->

  initializeGameSelector = () ->
    gameSelector = $('#game-selector')
    selectGame = $('<option>').append('SELECT GAME')
    gameSelector.append(selectGame)
    Chip8.games.forEach (game) ->
      gameOption = $('<option>')
      gameOption.attr('value', game)
      gameOption.append game
      gameSelector.append gameOption

    gameSelector.change () ->
      selectedGame = gameSelector.val()
      if selectedGame? then Chip8.run selectedGame

  initializeReloadButton = () ->
    gameSelector = $('#game-selector')
    reloadButton = $('#reload')
    reloadButton.click () ->
      selectedGame = gameSelector.val()
      if selectedGame? then Chip8.run selectedGame

  initializeGameSelector()
  initializeReloadButton()
