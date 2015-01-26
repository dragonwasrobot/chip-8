# # Interface

# author: Peter Urbak <peter@dragonwasrobot.com> <br/>
# version: 2015-01-25

$(document).ready () ->

  initializeGameSelector = () ->

    keyMap = {
      32: 'Space'
      37: 'Left arrow'
      38: 'Up arrow'
      39: 'Right arrow'
      40: 'Down arrow'
      53: '5'
      54: '6'
      55: '7'
      70: 'F'
      71: 'G'
      72: 'H'
      73: 'I'
      75: 'K'
      82: 'R'
      83: 'S'
      84: 'T'
      87: 'W'
      89: 'Y'
    }

    addKeyMapping = (keys) ->
      keyMapping = $('#key-mapping')
      keyMapping.empty()
      for key in keys
        keyItem = $('<li>')
        keyItem.append(keyMap[key])
        keyMapping.append keyItem

    addGameOption = (game) ->
      gameOption = $('<option>')
      gameOption.attr('value', game)
      gameOption.append game
      gameSelector.append gameOption

    gameSelector = $('#game-selector')
    selectGame = $('<option>').append('SELECT GAME')
    gameSelector.append(selectGame)

    gameSelector.change () ->
      selectedGame = gameSelector.val()
      selectedKeyMap = Chip8.games[selectedGame]
      addKeyMapping Object.keys(selectedKeyMap)
      Chip8.run selectedGame if selectedGame?

    addGameOption game for game of Chip8.games

  initializeReloadButton = () ->
    gameSelector = $('#game-selector')
    reloadButton = $('#reload')
    reloadButton.click () ->
      selectedGame = gameSelector.val()
      if selectedGame? then Chip8.run selectedGame

  initializeGameSelector()
  initializeReloadButton()
