// Create a new blackjack game.
var Game = new Blackjack($('#game-stage'), 4);

$(document).ready(function() {
	Game.deal();
});