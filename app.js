console.log("Webpage is working properly.");



//* Global Variables
// collect list of players name
const namelist = [];

// Update of occupy and non-occupied spaces
let occupiedSquares = [];

// selected piece will have animal piece name and parentId (white square)
let selectedPiece = { name: "", parentId: null };




//* Function
// random select player name to start the game play
const randomSelectName = () => {
  return namelist[Math.floor(Math.random() * namelist.length)];
}

// loading and reveal player to start
const loadReveal = () => {
  const selectName = randomSelectName(); // exec randomSelectName()
  playerName.textContent = `Player '${selectName}' will start the gameplay.`;
  console.log(selectName);
}

//exit loading
const exitLoad = () => {
  playerSelection.style.display = "none";
  createGameBoard();
}

// player select to start gameplay
const playerStart = () => { };

// function to highlight surrounding divs
const highlightSurroundingDivs = (parentDivId) => {
  // Calculate surrounding div IDs
  let surroundingDiv = {
    top: parseInt(parentDivId) - 7,
    right: parseInt(parentDivId) + 1,
    bottom: parseInt(parentDivId) + 7,
    left: parseInt(parentDivId) - 1,
  };
  // Top Edge perimeter
  if (noTopSide.indexOf(parseInt(parentDivId)) > -1) {
    surroundingDiv.top = 0;
  }
  // Right Edge perimeter
  if (noRightSide.indexOf(parseInt(parentDivId)) > -1) {
    surroundingDiv.right = 0;
  }
  // Bottom Edge perimeter
  if (noBottomSide.indexOf(parseInt(parentDivId)) > -1) {
    surroundingDiv.bottom = 0;
  }
  // Left Edge perimeter
  if (noLeftSide.indexOf(parseInt(parentDivId)) > -1) {
    surroundingDiv.left = 0;
  }
  // Extract Div id into an array
  Object.values(surroundingDiv).forEach(id => {
    const surroundingDiv = document.getElementById(id.toString());
    if (surroundingDiv) {
      surroundingDiv.classList.add('highlighted');
    }
  });
};
// Remove Highlight divs
const removeHighlight = () => {
  const highlightedDivs = document.querySelectorAll('.highlighted');

  highlightedDivs.forEach(div => {
    div.classList.remove('highlighted')
  });
};


//* Handler
// get player 1 name input
let name1Input = document.getElementById("name1-input")
let enter1 = document.getElementById("enter-name1");

enter1.addEventListener("click", function () {
  let name1 = name1Input.value;
  namelist.push(name1);
  enter1.style.display = "none"; // player 1 input confirm!!
  // console.log(name1);
  console.log("Name of Players", namelist);
});

// get player 2 name input
let name2Input = document.getElementById("name2-input")
let enter2 = document.getElementById("enter-name2");
let start = document.getElementById("start");

enter2.addEventListener("click", function () {
  let name2 = name2Input.value;
  namelist.push(name2);
  enter2.style.display = "none"; // player 2 input confirm!!
  intro.textContent = "Click the 'START' button to begin gameplay.";
  start.style.display = "block"; // reveal Click to play button
  // console.log(name2);
  console.log("Name of Players", namelist);
});

// click play button to begin gameplay
const startPopup = document.getElementById("start-popup");
const playerSelection = document.getElementById("player-selection");

start.addEventListener("click", function () {
  startPopup.style.display = "none"; // switch off Start-Popup
  playerSelection.style.display = "block"; // show loading...
  setTimeout(loadReveal, 1000); //show player to start
  setTimeout(exitLoad, 2500); //exit loading... and reveal gameboard
});

//Handler select square
const selectTargetSquare = (event) => {
  event.preventDefault();
  //TODO: check if target is colored square
  //TODO:check if move is allowed

  console.log(`White Square id ${event.target.id} is selected.`);
  //push event target id into occupiedSquares

  occupiedSquares.push(parseInt(event.target.id));
  console.log('add piece', occupiedSquares);

  //remove selectedPiece ParentId from occupiedSquare
  let parentId = parseInt(selectedPiece.parentId)
  let parentIdx = occupiedSquares.indexOf(parentId)
  console.log('parent idx', parentIdx)
  occupiedSquares.splice(parentIdx, 1)
  console.log('after remove', occupiedSquares)

  //append selectedPiece div to selected div
  let animalPiece = document.getElementById(selectedPiece.name);
  let oldSpace = document.getElementById(selectedPiece.parentId);
  oldSpace.addEventListener("click", selectTargetSquare);
  event.target.appendChild(animalPiece);
  console.log('Test', selectedPiece);
  event.target.removeEventListener("click", selectTargetSquare);

  //reset selectedPiece
  selectedPiece = { name: "", parentId: null };
  removeHighlight()
}

// Handle select color square
const selectColorSquare = (event) => {
  event.preventDefault();
  console.log(`Color square is ${event.target.id}.`);
}

// Handle select animal piece
const selectAnimalPiece = (event) => {
  event.preventDefault();

  if (selectedPiece.name.length > 0) {
    removeHighlight();
    selectedPiece = { name: "", parentId: null };
  } else {
    selectedPiece.name = event.target.id;

    //check parent div ID 
    const parentDivId = event.target.parentNode.id;
    selectedPiece.parentId = parseInt(parentDivId);

    console.log('selectedPiece', selectedPiece);

    // Highlight surrounding divs
    highlightSurroundingDivs(parentDivId);
  }
};

//* Render
// render introduction text
const renderIntro = document.getElementById("intro");
renderIntro.textContent = "To begin gameplay, enter 2 names in the input box below.";

// render player to start text
const renderPlayerName = document.getElementById("player-name");
renderPlayerName.textContent = "Please wait... Game is selecting player to start...";

// render GameBoard
const gameBoard = document.querySelector("#gameboard");
const renderGameBoard = () => {

  gameBoard.style.display = "flex";
  gameBoard.style.flexWrap = "wrap";

  boardSetUps.forEach((boardSetUp, idx) => {
    //create white squares and append to gameBoard
    const square = document.createElement("div");
    square.style.fontSize = "10px"; // to remove later; now for num reference only
    square.innerText = idx + 1; // to remove later; now for num reference only
    square.classList.add("square");
    square.setAttribute("id", (idx + 1));
    gameBoard.append(square);

    //check for animal-piece and place on gameboard
    if (tokens.indexOf(boardSetUp) > -1) {
      const animalPiece = document.createElement("div");
      animalPiece.setAttribute('id', "animal-" + boardSetUp);
      square.appendChild(animalPiece);
      animalPiece.addEventListener('click', selectAnimalPiece);
      occupiedSquares.push((idx + 1)); // question to ask
      console.log('pieces in OS ', occupiedSquares); // question to ask

      //check for color squares and indicate on gameboard
    } else if (boardSetUp.length > 0) {
      square.classList.add(boardSetUp);
      square.setAttribute("id", boardSetUp + (idx + 1));
      square.addEventListener("click", selectTargetSquare);
    } else {
      square.addEventListener("click", selectTargetSquare);
    }
  })
};

// Call Function
renderGameBoard();


//Global Variables


//For creating Gameboard
//renderGameBoard()
// TODO: add image source to token pieces


//For game controls
//selectAnimalPiece()
//selectTargetSquare()


// Game Logic
// compareAnimalPower()
// canAnimalCrossRiver()
// didAnimalEnterTrap()
// didAnimalEnterDen()
// checkOpponentRemainingPieces()


//helper functions
//highlightSurroundingDiv()
//removeHighlight()
//checkIsTargetSquareColored() --- not yet












