// Variable for which deck the user wants to use
let whatDeck ="";


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
      console.log("File names: "+imageList) 
      return imageList;
    })
    // Handle errors
    .catch(error => console.error(error));
}

function toggleHome(){
  const elements = document.querySelectorAll(".intro")
  elements.forEach((element) => {
    element.classList.toggle("hidden")
    console.log("toggled")
  })
}

function removeCards(){
  let elements = document.querySelectorAll(".card")
  elements.forEach((element) => {
    element.remove();
  })
  elements = document.querySelectorAll(".audio")
  elements.forEach((element) => {
    element.remove();
  })
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

function displayCards(deck) {
  //Get all possible cards, filter to only display the ones we want
  getImageList().then(imageList => {
    const filteredList = imageList.filter(name => name.startsWith(deck));
    console.log("cards filtered. List:" +filteredList);

    //For each card, create a button with that card image: 
    filteredList.forEach(fileName =>{
      //Create an image for the card
      const card = document.createElement('img');
      //Set the image source 
      card.src = "img/"+fileName;
      //Apply card css class
      card.classList.add("card");
      //give the card an id
      const cardId = fileName.replace(".png", "")
      card.id = cardId;

      //Create audio element for the card
      addSound(cardId);

      //Connect card to card's corresponding audio 
      card.addEventListener("click", function(){
        const audio = document.getElementById("sound"+cardId);
        audio.currentTime = 0;
        audio.play();
      })

      //add card to the site
      document.getElementById("cards").appendChild(card);
    })  
  });
}

const deckButtons = document.querySelectorAll('.deck_button');
deckButtons.forEach(function(button){
	// What to do when a deck is selected
	button.addEventListener('click', function(){
		whatDeck = button.id.replace("deck","")
		console.log("Button click, id:" + whatDeck);
    toggleHome();
		//display requested cards 
    displayCards(whatDeck)
	})
})

document.getElementById("back").addEventListener("click", function(){
  toggleHome()
  removeCards()
})