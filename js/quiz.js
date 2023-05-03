// Variable holding all the decks the user wants to be quizzed on.
let okDecks = [];

// Let the user choose what decks they want to practice 
const deckChoices=document.querySelectorAll(".deck_button")
deckChoices.forEach((deck) => {
	deck.addEventListener("click", function(){
		deck.classList.toggle("selectedDeck")
		console.log("SelectedDeck toggled!")
	})
})

//Start the quiz
const goButton = document.getElementById("startQuiz")
goButton.addEventListener("click", function(){

	//Add all the currently selected decks to the array of decks to draw cards from
	selectedDecks = document.querySelectorAll(".selectedDeck");
	selectedDecks.forEach((deck) => {
		okDecks.push(deck.id.replace("deck",""))
	})

	console.log("You'll be quizzed on the following decks " + okDecks)
})

function getPossibleQuestions (okDecks) {
	//Filter all cards based on okDecks

	//Make a list of all cards that fit that criteria

	//Make a list of cards that are ok for future questions. 
}