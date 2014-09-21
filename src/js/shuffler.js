// settings
var timerLength = 30 * 60; // 30 minutes
var shuffleSpeed = 150;
var hints = [
	[0, "Massive congratulations to:"],
	[5, "Nearly there..."],
	[10, "Getting close..."],
	[timerLength, "Who's it going to be?"]
];
var clockHighlightAt = 10;
var finalNameFlashSpeed = 600;
var finalNameFlashFadeSpeed = 200;

// running vars
var currentClock = 0;
var currentName = 0;
var maxName = 0;

// page elements
var clockDisplay, nameHintDisplay, nameDisplay;

$(document).ready(function () {
	// get page elements
	clockDisplay = $(".clock");
	nameHintDisplay = $(".name_hint");
	nameDisplay = $(".name");

	// get name size
	maxName = names.length - 1;

	// set up the clock
	currentClock = timerLength;
	updateClockDisplay();
	setTimeout(function () {
		clockPulse();
	}, 1000);

	// set up the name shuffler
	updateNameDisplay();
	shufflerPulse();
});

function clockPulse() {
	--currentClock;
	updateClockDisplay();
	if (currentClock > 0) {
		setTimeout(function () {
			clockPulse()
		}, 1000);
	}
}

function updateClockDisplay() {
	// clock display
	var seconds = currentClock % 60;
	var minutes = ((currentClock - seconds) / 60) % 60;
	var hours = (currentClock - seconds - (minutes * 60)) / (60 * 60);
	clockDisplay.html((hours < 10 ? "0" : "") + hours + ":" + (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds)

	// hint display
	for (var i = 0; i < hints.length; ++i) {
		var hint = hints[i];
		if (currentClock <= hint[0]) {
			nameHintDisplay.html(hint[1]);
			break;
		}
	}

	// clock display
	if (currentClock <= clockHighlightAt) {
		clockDisplay.addClass("clock_highlight");
	}
}

function shufflerPulse() {
	currentName =randomBetween(0, maxName);
	updateNameDisplay();
	if (currentClock > 0) {
		setTimeout(function () {
			shufflerPulse();
		}, shuffleSpeed);
	} else {
		finishDisplay();
	}
}

function updateNameDisplay() {
	nameDisplay.html(names[currentName]);
}

function finishDisplay() {
	flashFinalName();
}

function flashFinalName() {
	nameDisplay.fadeToggle(finalNameFlashFadeSpeed);
	setTimeout(function() {
		flashFinalName();
	}, finalNameFlashSpeed);
}

function randomBetween(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}