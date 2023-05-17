// Variable holding all the decks the user wants to be quizzed on.
let okDecks = [];

// Create object for score and user data: 
let userScore = {
  date : todaysDate(),
  quizLength : 10,
  score : 0,
  questionNumber : 0,
  questions : [],
  missedQuestions : []
}
console.log(userScore)

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
        hideIntro();

        //Run through all questions in the quiz
        for (let i = 0; i < userScore.quizLength; i++){
          //loop stuff goes here
        }

        //Create a question: 
        let question = writeQuestion(allCards);
        console.log(question)
        
        //Create audio element 
        addSound(question.correctAnswerId)
        
        //Display the audio button
        const playButton = document.getElementById("question-sound")
        playButton.classList.toggle("hidden")
        
        //Connect the audio button to the correct answer's audio
        playButton.addEventListener("click", function(){
          const audio = document.getElementById("sound"+question.correctAnswerId);
          audio.currentTime = 0;
          audio.play();
        })

        //Display the answers
        displayAnswers(question.allAnswerImages)
        
        //React to the user input
        let answers = document.querySelectorAll('.answer')
        answers.forEach((answer) => {
          answer.addEventListener('click', function(){
            console.log("you clicked" + answer.id)
            if (answer.id == question.correctAnswerId) {
              //Correct andswer sequence 
              console.log("YAY!")
              removeOldQuestion();
              //Next question function here
            } else {
              //Incorrect answer sequence
              console.log("nope")
              removeOldQuestion();
              //Next question function here 
            }
          })  
        }) 

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
  let questionPool = [...cards];

  //We will likely need to filter out old questions from question pool to prevent duplicate questions.  

  //Get the correct answer
  let correctAnswer = getCorrectAnswer(questionPool);
  
  // Log the question in user data 
  userScore.questions.push(correctAnswer);

  // Increment question number 
  userScore.questionNumber++;
  console.log("Beginning question: "+ userScore.questionNumber)
  console.log(userScore)

  // All the phonics cards that have duplicate sounds (Note: you'll need to update this if you add more!)
  const duplicates = [
    ['s','2-00','2-22'],
    ['k','2-10','2-11','2-12'],
    ['r', '2-15', '5-10'],
    ["f", "2-18", "5-11"],
    ["l", "2-20", "2-21"],
    ["w", "3-02", "5-09"],
    ["z", "3-05", "3-06", "3-07"],
    ["ai", "3-14", "5-00", "5-17"],
    ["ee", "3-15", "5-03", "5-16", "5-18"],
    ["igh", "3-16", "5-02", "5-19"],
    ["e-hi", "3-17", "5-14", "5-20"],
    ["u", "3-18", "5-06", "5-12", "5-21"],
    ["up-e", "3-21", "5-08", "5-15"],
    ["3", "3-22", "5-05"],
    ["a-hi", "3-23", "5-01"],
    ["bac-c", "3-24", "5-04"],
    ["st", "4-00", "4-24"],
    ["sk", "4-28", "4-29"],
    ["ju", "5-07", "5-13", "5-22"]
  ];

  // Get the group (if it exists) containing the duplicate phonemes
  let selectedGroup;
  for (const group of duplicates) {
    if (group.includes(correctAnswer.replace('.png', ''))) {
      selectedGroup = group;
      break
    }
  }

  // Now remove all the items of selected group from the questionPool. 
  if (selectedGroup) {
    //Add png to all the selected group elements because I was stupid when I desigend the original list.
    selectedGroup = selectedGroup.map(item => item + ".png")
    questionPool = questionPool.filter( item => !selectedGroup.includes(item))
    console.log("Removed Duplicate sounds: ")
    console.log(selectedGroup)
  }

  console.log(questionPool)

  //Get the incorrect answers 
  const wrongAnswers = getPossibleAnswers(questionPool)

  //Insert the correct answer at a random index in the list of possible answers
  const insertAnswerIndex = randomNumber(wrongAnswers.length + 1)
  wrongAnswers.splice(insertAnswerIndex, 0, correctAnswer)

  const question = {
    correctAnswerImage: correctAnswer,
    correctAnswerAudio: correctAnswer.replace(".png", ".mp3"),
    correctAnswerId: correctAnswer.replace(".png", ""),
    allAnswerImages: wrongAnswers
  }

  return question;
}

function hideIntro(){
  const elements = document.querySelectorAll(".intro")
  elements.forEach((element) => {
    element.classList.toggle("hidden")
    console.log("toggled")
  })
}

function todaysDate(){
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  const formattedDate = day + '/' + month + '/' + year;
  return formattedDate;
}

function addSound(cardId){
  //Create audio element 
  const audioElement = document.createElement("audio")
  audioElement.id= "sound"+cardId;
  audioElement.preload = "auto";

  //Create source 
  const sourceElement = document.createElement("source");
  sourceElement.src = "audio/" + cardId + ".mp3";
  sourceElement.type = "audio/mpeg";

  audioElement.appendChild(sourceElement);
  document.getElementById("audio").appendChild(audioElement);
}

function displayAnswers(answers){
  answers.forEach(fileName =>{
    //Create an image for the card
    const card = document.createElement('img');
    //Set the image source 
    card.src = "img/"+fileName;
    //Apply card css class
    card.classList.add("answer");
    //give the card an id
    const cardId = fileName.replace(".png", "")
    card.id = cardId;

    // add the answer to the site
    document.getElementById("answers").appendChild(card)
  })
};

function removeOldQuestion(){
  let elements = document.querySelectorAll(".answer")
  elements.forEach((element) => {
    element.remove();
  })
} 