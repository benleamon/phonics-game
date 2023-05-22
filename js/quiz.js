// Variable holding all the decks the user wants to be quizzed on.
let okDecks = [];

// Create object for score and user data: 
let userScore = {
  date : todaysDate(),
  quizLength : 1,
  phases:[],
  score : 0,
  questionNumber : 0,
  questions : [],
  missedQuestions : []
}

let question;
let nextButton;
const goButton = document.getElementById("startQuiz");
const deckChoices = document.querySelectorAll(".deck_button");

deckChoices.forEach((deck) => {
  deck.addEventListener("click", function () {
    deck.classList.toggle("selectedDeck");

    const selectedDecks = document.querySelectorAll(".selectedDeck");
    if (selectedDecks.length >= 1) {
      goButton.classList.add("okToGo");
    } else {
      goButton.classList.remove("okToGo");
    }
  });
});


//Start the quiz
goButton.addEventListener("click", function(){

    //First check if the user has selected any decks
    let elements = document.querySelectorAll(".selectedDeck")
    if (elements.length < 1){
      return
    };

    //Add all the currently selected decks to the array of decks to draw cards from
    selectedDecks = document.querySelectorAll(".selectedDeck");
    selectedDecks.forEach((deck) => {
        okDecks.push(deck.id.replace("deck",""));
        userScore.phases.push(deck.id.replace("deck",""));
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
        function startQuiz(){
          if (userScore.questionNumber < userScore.quizLength){
            //Create a question: 
            question = writeQuestion(allCards);
            
            //Create audio element 
            addSound(question.correctAnswerId)

            //Display the answers
            displayAnswers(question.allAnswerImages)

            //Play the sound right away
            const sound = document.querySelectorAll('.question-audio')[0];
            sound.currentTime = 0
            setTimeout(() => {
              sound.play();
            }, 250);

            //React to the user input
            let answers = document.querySelectorAll('.answer')
            let flag = true;
            answers.forEach((answer) => {
              answer.addEventListener('click', function(){
                //Note: There's likely a better way to do this, I'm using this flag to stop the user beign able to click on any of the buttons more than once. 
                if(flag){
                  flag = false;
                  if (answer.id == question.correctAnswerId) {
                    //Correct andswer sequence
                    rightAnswer();
                  } else {
                    //Incorrect answer sequence
                    wrongAnswer();
                  }

                  //Highlight the correct answer
                  highlightCorrectAnswer(question.correctAnswerId)

                  //Create the next question button 
                  nextButton = document.createElement("button");
                  nextButton.id = "nextQuestionButton";
                  nextButton.classList.add('next-question');
                  nextButton.textContent = "Next"

                  //Add the button to the screen  
                  container = document.getElementById("question");
                  container.appendChild(nextButton);
                }

                //Add on-click behavior 
                nextButton.addEventListener('click', function(){
                  //Remove the current question: 
                  removeOldQuestion(question.correctAnswerId);
                  //Write the next question
                  startQuiz();
                })

              })  
            }) 
          } else {
            //Quiz is finished 
            displayCert();
          }
        }
        //Start the quiz
        startQuiz();
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
  //Remove the correct answer from the question pool.
  questionPool.splice(questionIndex, 1)
  return questionCard;
}

function getPossibleAnswers(questionPool) {
  //Get unique possible answers for the questions. 
  const possibleAnswers = [];
  for (let i = 0; i < 3; i++) {
    let answerCard;
    do {
      const answerIndex = randomNumber(questionPool.length);
      answerCard = questionPool[answerIndex];
    } while (possibleAnswers.includes(answerCard));
    possibleAnswers.push(answerCard);
  }
  return possibleAnswers;
}

function writeQuestion (cards){
  // Make a copy of all the cards we could write questions for.
  //Note: the spread operator will create a copy or the array.
  let questionPool = [...cards];

  //Filter old questions out of question pool 
  questionPool = questionPool.filter(item => !userScore.questions.includes(item));

  //Get the correct answer
  let correctAnswer = getCorrectAnswer(questionPool);

  //Remove the correct answer from the question pool
  questionPool = questionPool.filter(item => item !== correctAnswer);
  
  // Log the question in user data 
  userScore.questions.push(correctAnswer);

  // Increment question number 
  userScore.questionNumber++;

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
  }

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

function audioClickHandler(cardId){
  const audio = document.getElementById("sound" + cardId);
  audio.currentTime = 0;
  audio.play();
}

function addSound(cardId){
  //Create audio element 
  const audioElement = document.createElement("audio")
  audioElement.id= "sound"+cardId;
  audioElement.classList.add("question-audio");
  audioElement.preload = "auto";
  //audioElement.classList = "question"

  //Create source 
  const sourceElement = document.createElement("source");
  sourceElement.src = "audio/" + cardId + ".mp3";
  sourceElement.type = "audio/mpeg";

  audioElement.appendChild(sourceElement);
  document.getElementById("audio").appendChild(audioElement);

  const playButton = document.getElementById("question-sound");
  playButton.classList.remove("hidden"); // Remove the "hidden" class to display the button

  playButton.addEventListener("click", function(){
    audioClickHandler(cardId)
  });
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

function removeOldQuestion(cardId){
  //Remove the next question button: 
  document.getElementById("nextQuestionButton").remove();
  //Remove the answer cards 
  let elements = document.querySelectorAll(".answer")
  elements.forEach((element) => {
    element.remove();
  })
  //Hide the audio button
  let element = document.getElementById("question-sound")
  element.classList.toggle("hidden");
  //Remove the audio elements 
  elements = document.querySelectorAll(".question-audio")
  elements.forEach((element) => {
    element.removeEventListener("click", function(){
      audioClickHandler(cardId)
    });
    element.remove();
  })
}

function rightAnswer () {
  //play celebratiory chime 
  const sound = document.getElementById("correct-audio")
  sound.currentTime = 0;
  sound.play();
  //Update score
  userScore.score++;
} 

function wrongAnswer () {
  //play fail sound
  const sound = document.getElementById("incorrect-audio")
  sound.currentTime = 0;
  sound.play();
  //append missed question to user.score
  userScore.missedQuestions.push(question.correctAnswerId)
}

function highlightCorrectAnswer (answer){
  elements = document.querySelectorAll(".answer")
  elements.forEach((element) => {
    if (element.id !== question.correctAnswerId){
      element.classList.toggle("incorrect");
    }
  })
}

function displayCert() {
  const cert = document.getElementById("cert");
  cert.classList.toggle("hidden");
  cert.classList.toggle("visibleCert");

  // Add date, phases
  let string = "";
  for (let i = 0; i < userScore.phases.length; i++) {
    string = string + "Phase " + userScore.phases[i] + " ";
  }
  let element = document.createElement("p");
  element.textContent = string;
  const info = document.getElementById("info")
  info.appendChild(element);
  element.textContent = "Let's practice these ones again!"
  info.appendChild(element)

  // Add vanity stars
  if (userScore.score == 0) {
    //Display consolation prize
    let container = document.getElementById("stars");
    const star = document.createElement("img");
    star.src = "./img/consolation-star.png";
    star.classList.add("star");
    container.appendChild(star)
  } else {
    for (let i = 0; i < userScore.score; i++) {
      // Add stars
      let container = document.getElementById("stars");
      const star = document.createElement("img");
      star.src = "./img/star.png";
      star.classList.add("star");
      container.appendChild(star);
    }
  }
  

  // Add Missed cards
  const missedContainer = document.getElementById("missed");
  userScore.missedQuestions.forEach((fileName) => {
    // Create an image for the card
    const card = document.createElement("img");
    // Set the image source
    card.src = "img/" + fileName + ".png";
    // Apply card css class
    card.classList.add("card");
    // give the card an id
    const cardId = fileName;
    card.id = cardId;

    // Create audio element for the card
    // Create audio element
    const audioElement = document.createElement("audio");
    audioElement.id = "sound" + cardId;
    audioElement.preload = "auto";

    // Create source
    const sourceElement = document.createElement("source");
    sourceElement.src = "audio/" + cardId + ".mp3";
    sourceElement.type = "audio/mpeg";

    audioElement.appendChild(sourceElement);
    document.getElementById("audio").appendChild(audioElement);

    // Connect card to card's corresponding audio
    card.addEventListener("click", function () {
      const audio = document.getElementById("sound" + cardId);
      audio.currentTime = 0;
      audio.play();
    });

    // add card to the site
    missedContainer.appendChild(card);
  });
}






