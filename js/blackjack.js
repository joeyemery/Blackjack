function Blackjack(stage, decks) {
	this.stage = stage;
	this.deck = this.generateDeck(decks);
	this.currentTurn = 0;

	console.log(this);
}

/* --- Generate decks function --- */
Blackjack.prototype.generateDeck = function(decks) {
	var actualDeck = [
		'S_2', 'S_3', 'S_4', 'S_5', 'S_6', 'S_7', 'S_8', 'S_9', 'S_10', 'S_J', 'S_Q', 'S_K', 'S_A',
		'D_2', 'D_3', 'D_4', 'D_5', 'D_6', 'D_7', 'D_8', 'D_9', 'D_10', 'D_J', 'D_Q', 'D_K', 'D_A',
		'C_2', 'C_3', 'C_4', 'C_5', 'C_6', 'C_7', 'C_8', 'C_9', 'C_10', 'C_J', 'C_Q', 'C_K', 'C_A',
		'H_2', 'H_3', 'H_4', 'H_5', 'H_6', 'H_7', 'H_8', 'H_9', 'H_10', 'H_J', 'H_Q', 'H_K', 'H_A'
	];

	var deck = [];

	for(i = 0; i < decks; i++) {
		$.each(actualDeck, function(key, value) {
			deck.push(value);
		});
	}

	return deck;
}

/* --- Shuffle function --- */
Blackjack.prototype.shuffle = function() {
	var currentIndex = this.deck.length, temporaryValue, randomIndex;

  	// While there remain elements to shuffle...
  	while (0 !== currentIndex) {
	    // Pick a remaining element...
	    randomIndex = Math.floor(Math.random() * currentIndex);
	    currentIndex -= 1;

	    // And swap it with the current element.
	    temporaryValue = this.deck[currentIndex];
	    this.deck[currentIndex] = this.deck[randomIndex];
	    this.deck[randomIndex] = temporaryValue;
  	}
}

/* --- Deal cards function --- */
Blackjack.prototype.deal = function() {
	var instance = this;

	this.shuffle();

	// Deal out a card each, per player.
	for(i = 0; i < 2; i++) {
		$('.player').each(function() {
			instance.giveCard($(this).data('player'));
		});
	}

	// Calculate card totals.
	this.assignTotals(this.calculateTotals());

	// Start the turn process.
	this.makeTurn();
}

Blackjack.prototype.calculateTotals = function() {
	var instance = this;
	var total = null;
	var values = new Array();

	$('.player').each(function(key, value) {
		var totalValue = 0;
		$(this).find('.cards p').each(function(key, value) {

			// Check for Aces.
			if(instance.aceCheck($(this).data('number'))) {
				var cardValue = 11;
			} else {
				switch($(this).data('number')) {
					case 'J': case 'Q': case 'K':
						var cardValue = 10;
					break;
					default:
						var cardValue = $(this).data('number');
					break;
				}
			}

			totalValue += cardValue;
		});

		values.push(totalValue);
	});

	return values;
}

Blackjack.prototype.assignTotals = function(totals) {
	$('.player#player_1 .total h2').text(totals[0]);
	$('.player#player_2 .total h2').text(totals[1]);
}

Blackjack.prototype.giveCard = function(player) {
	var dealCard = this.deck[0].split('_');
	this.deck.splice(0, 1);

	switch(dealCard[0]) {
		case 'D':
			var suit = '&diams;';
		break;
		case 'H':
			var suit = '&hearts;';
		break;
		case 'C':
			var suit = '&clubs;';
		break;
		case 'S':
			var suit = '&spades;';
		break;
	}

	$('.player#player_' + player + ' .cards').append('<p class="card ' + dealCard[0] + '" data-suit="' + dealCard[0] + '" data-number="' + dealCard[1] + '">' + dealCard[1] + '<span>' + suit + '</span></p>');
}

Blackjack.prototype.makeTurn = function() {
	var player = $('.player.turn');
	var numbers = [];

	// Increment the current turn counter.
	this.currentTurn++;

	if(player.data('stand')) {
	} else {
		player.find('.turn-options button').removeAttr('disabled');

		this.playTurn();
	}
}

Blackjack.prototype.playTurn = function() {
	var instance = this;

	this.stage.find('.turn-option#stand').on('click', this.stand);
	this.stage.find('.turn-option#hit').on('click', function() {
		instance.hit(instance);
	});
}

Blackjack.prototype.stand = function() {
	var player = $('.player.turn');
	player.data('stand', 'true');

	this.nextTurn();
}

Blackjack.prototype.hit = function(instance) {
	var player = $('.player.turn');

	instance.giveCard(player.data('player'));
	instance.assignTotals(instance.calculateTotals());

	if(instance.checkBust(player.find('.total h2').text())) {
		player.addClass('bust');
	} else {
		alert('not bust');
	}
}

Blackjack.prototype.checkBust = function(value) {
	return (value > 21) ? true : false;
}

Blackjack.prototype.nextTurn  = function() {

}

Blackjack.prototype.aceCheck = function(card) {
	if(card == 'A') {
		return true;
	} else {
		return false;
	}
}