// players.state {word: string}
// state.numTeams int
// state.numWords int
// state.words [string]
// state.round int

var round; // ?int

getJSONs([{ path: '/socket_games/words/common.json', name: 'words' }]);

$(document).ready(function() {
	$('#door').click(door);
	$('#leave').click(leave);
	$('#new').click(prepare);
});

function prepare() {
	state.currentPlayer = null;
	state.numTeams = Number.parseInt($('#num_teams').val());
	state.numWords = Number.parseInt($('#num_words').val());
	state.words = constants.words.slice();
	shuffleArray(state.words);
	state.words = state.words.slice(0, state.numWords);
	assignTeams();
	state.round = state.round === undefined ? 1 : state.round + 1;
	sendState('prepare');
}

function assignTeams() {
	var chosenWords = state.words.slice(0, state.numTeams);
	shuffleArray(state.words);
	var playerIndices = [];
	for (var i = 0; i < state.players.length; i++) {
		if (state.players[i].present) playerIndices.push(i);
	}
	shuffleArray(playerIndices);
	for (var i = 0; i < playerIndices.length; i++) {
		var word = chosenWords[i % chosenWords.length];
		state.players[i].state.word = word;
	}
}

function update() {
	$('#num_teams').val(state.numTeams);
	$('#num_words').val(state.numWords);
	if (state.round === round) return;
	var words = $('<div>').addClass('inline_flex').addClass('bubble');
	for (var i = 0; i < state.words.length; i++) {
		var word = state.words[i];
		$('<div>').addClass('space').addClass('inline').text(word).appendTo(words);
	}
	var yourWord = $('<div>').addClass('inline').addClass('space').addClass('bubble').addClass('word').text(me().state.word);
	$('<div>').addClass('game').addClass('bubble').append(words).append('<br>').append(yourWord).prependTo('#games').click(hide);
}

function hide() {
	$(this).find('.word').toggle();
}
