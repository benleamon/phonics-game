// Variable holding all the decks the user wants to be quizzed on.
let okDecks = [];

// Let the user choose what decks they want to practice 
const deckChoices=document.querySelectorAll(".deck_button")
deckChoices.forEach((deck) => {
	deck.addEventListener("click", function(){
		deck.classList.toggle("selectedDeck")
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

    getImageList().then((cards) => {
        const allCards = [];

        //Filter all the cards on the server based on the decks we want to quiz in okDecks
        //Get each of the decks in okDecks. 
        for (let i = 0; i < okDecks.length; i++){
            const filtered = cards.filter(name => name.startsWith(okDecks[i]));
            //Then for each deck in okDecks, get each of the cards. 
            for(let j = 0; j < filtered.length; j++){
                allCards.push(filtered[j])
            }
        }

        console.log("all cards: " +allCards)
        //Note: the spread operator will create a copy or the array. 
        const questionPool = [...allCards];
        console.log("question pool:")
        console.log(questionPool)

        questionIndex = randomNumber(questionPool.length)
        const questionCard = questionPool[questionIndex]
        console.log("Answer to this question:" + questionCard)
        questionPool.splice(questionIndex, 1)

        //Create a list of possible answers
        possibleAnswers = []
        for (let i = 0; i< 3; i++){
        	const answerIndex = randomNumber(questionPool.length)
        	//Check here to make sure that this index isn't already in the set of possible answers. 
        	const answerCard = questionPool[answerIndex]
        	possibleAnswers.push(answerCard)
        }
        //Insert the correct answer at a random index in the list of possible answers
        const insertAnswerIndex = randomNumber(possibleAnswers.length + 1)
        possibleAnswers.splice(insertAnswerIndex, 0, questionCard)

        console.log("possible answers: ")
        console.log(possibleAnswers)
        //Move all of that into a function (might be good to have a function called getQuestion with a param for if we want it to come from all questions -- for possible answers, or from possibleQuestions -- for the question.)
    });
})

// Get the links to the images stored on the server.
function getImageList() {
  // Path to JSON file
  const jsonPath = "./files.json";

  // Fetch the JSON data
  return fetch(jsonPath)
    .then(response => response.json())
    .then(data => {
      // get file names and save
      const imageList = [];
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
          const fileName = data[i][j];
          if (fileName !== "") {
            imageList.push(fileName);
          }
        }
      }
      //console.log("File names: "+imageList) 
      return imageList;
    })
    // Handle errors
    .catch(error => console.error(error));
}

function getPossibleQuestions (okDecks) {
  // Get all possible cards
  let allCards = []
  getImageList().then((cards) => {
    //Filter all the cards on the server cards based on the decks we want to quiz in okDecks
    for (let i = 0; i < okDecks.length; i++){
      const filtered = cards.filter(name => name.startsWith(okDecks[i]));
      for(let j = 0; j < filtered.length; j++){
      	allCards.push(filtered[j])
      }
    }
    //console.log("all cards: " +allCards)
    return allCards;
  });
  return allCards;
}

function randomNumber (n) {
	const randomNumber = Math.floor(Math.random() * n);
	console.log("RandomNumber Return is: " + randomNumber)
	return randomNumber
}