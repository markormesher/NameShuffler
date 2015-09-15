// shuffle state
var shuffleEnabled = true, shuffleFinished = false, shuffleTimeout = null, currentName = "";

// view components
var clockHintText, clockText, nameHintText, nameText, lastWinnerText;

function collectViews() {
	clockHintText = $('.clock_hint');
	clockText = $('.clock');
	nameHintText = $('.name_hint');
	nameText = $('.name');
	lastWinnerText = $('.last_winner');
	lastWinnerText.fadeTo(1, 0.4);
}

function setWinnerDisplayMode(winnerDisplay) {
	if (!winnerDisplay) {
		// change opacity
		clockHintText.fadeTo(1, 1);
		clockText.fadeTo(1, 1);
		nameHintText.fadeTo(1, 0.4);
		nameText.fadeTo(1, 0.4);
	} else {
		// stop shuffling
		shuffleEnabled = false;

		// change opacity
		clockHintText.fadeTo(1, 0.4);
		clockText.fadeTo(1, 0.4);
		nameHintText.fadeTo(1, 1);
		nameText.fadeTo(1, 1);

		// pulse name
		nameHintText.html("Congratulations,");
		nameText.pulse(
			{color: '#089bfd'},
			{pulses: -1}
		);

		// start up again in 60 seconds
		setTimeout(function () {
			lastWinnerText.html("Last winner: <strong>" + currentName + "</strong>");
		}, 5 * 1000);
		setTimeout(function () {
			nameText.pulse('destroy');
			if (!shuffleFinished) shuffleEnabled = true;
			nameCycle();
			setWinnerDisplayMode(false);
		}, 6 * 1000);
	}
}

// clock cycles
function getNextStop() {
	// now
	var now = (new Date()).getTime();

	// look for closest after now
	for (var s in stops) {
		if (stops[s] >= now) {
			return stops[s];
		}
	}

	return null;
}

function clockCycle() {
	// get next stop
	var nextStop = getNextStop();
	if (nextStop == null) {
		clockHintText.html("No more scheduled giveaways");
		clockText.html("--:--:--");
		shuffleEnabled = false;
		shuffleFinished = true;
		return;
	}

	// difference
	var diff = Math.floor((nextStop - (new Date()).getTime()) / 1000);
	var s = diff % 60;
	var m = Math.floor(diff / 60) % 60;
	var h = Math.floor(diff / 3600);

	// output
	clockHintText.html("Next giveaway in:");
	clockText.html((h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s);

	// did someone win?
	if (diff == 0) {
		setWinnerDisplayMode(true);
	}

	// repeat
	setTimeout(clockCycle, 500);
}

// name shuffling
function nameCycle() {
	// finished all?
	if (shuffleFinished) {
		nameHintText.html("No more scheduled giveaways");
		nameText.html("-");
	}

	// disabled?
	if (!shuffleEnabled) return;

	// pick next name
	var newName = currentName;
	while (newName == currentName) {
		newName = names[Math.floor(Math.random() * names.length)];
	}
	currentName = newName;

	// display
	nameHintText.html("Next winner:");
	nameText.html(currentName);

	// repeat
	if (shuffleTimeout != null) {
		clearTimeout(shuffleTimeout);
	}
	shuffleTimeout = setTimeout(nameCycle, 100);
}

// initialise
$(document).ready(function () {
	collectViews();
	setWinnerDisplayMode(false);
	clockCycle();
	nameCycle();
});