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
        //Hide the startup buttons/text

        //Create a question: 
        writeQuestion(allCards);

        //Display the audio 

        //Display the answers 

        //Check input 

        //React to the user input 

        //Display the next button 

        //Iterate the question counter or desplay the cert (likely this will be some kind of loop with a flag)

        //Display the cert 
    
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
	return randomNumber
}

function getCorrectAnswer(questionPool){
  questionIndex = randomNumber(questionPool.length)
  const questionCard = questionPool[questionIndex]
  questionPool.splice(questionIndex, 1)
  return questionCard;
}

function getPossibleAnswers (questionPool){
  //List of possible answers
  possibleAnswers = []
  //Get the incorrect answers 
  for (let i = 0; i< 3; i++){
    let answerIndex;
    //Make sure there are no duplicate answers
    do {
      answerIndex = randomNumber(questionPool.length);
    } while (possibleAnswers.includes(answerIndex));
    const answerCard = questionPool[answerIndex]
    possibleAnswers.push(answerCard)
  }
  return possibleAnswers;
}

function writeQuestion (cards){
  // Make a copy of all the cards we could write questions for.
  //Note: the spread operator will create a copy or the array. 
  const questionPool = [...cards];

  //Get the correct answer
  const correctAnswer = getCorrectAnswer(questionPool);
  console.log("Correct Answer:")
  console.log(correctAnswer);

  //I think we need to find a way to also filter out identical sounds. Maybe make some kind of array of duplicate sounds? 
  //Filter questionPool again based on duplicate sounds. 
  //Likely we'll need to make a dictionary of duplicates 
  //First check if the correct answer is a key in the dictionary
  //then if it is purge all the values from the question pool. 

  //Get the incorrect answers 
  const wrongAnswers = getPossibleAnswers(questionPool)
  console.log("Wrong Answers: ")
  console.log(wrongAnswers)


  //Insert the correct answer at a random index in the list of possible answers
  const insertAnswerIndex = randomNumber(wrongAnswers.length + 1)
  wrongAnswers.splice(insertAnswerIndex, 0, correctAnswer)

  console.log("All Answers: ")
  console.log(wrongAnswers)
}
        