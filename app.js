console.log("Webpage is working properly.");

//* Global Variables (Start)
// collect list of players name
const namelist = [];

// * Global Variables (Game)
// Update of occupy and non-occupied spaces
let occupiedSquares = [];

// selected piece will have animal piece name and parentId (white square)
let selectedPiece = { name: "", parentId: null };

let animalPower = {
  elephant: 8,
  lion: 7,
  tiger: 6,
  leopard: 5,
  dog: 4,
  wolf: 3,
  cat: 2,
  rat: 1
};


// =========================================================================

//* Player Details (Start)

// introduction text
const intro = document.getElementById("intro");
intro.textContent = "To begin gameplay, enter 2 names in the input box below.";

// player to start
const playerName = document.getElementById("player-name");
playerName.textContent = "Please wait... Game is selecting player to start...";

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
  renderGameBoard();
}

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

// =========================================================================

//* Game Controls

// select Animal Piece and move options (highlight squares)
const selectAnimalPiece = (event) => {
  event.preventDefault();

  if (selectedPiece.name.length > 0) {
    removeHighlight(); // call remove Highlight function
    selectedPiece = { name: "", parentId: null };
    console.log("Animal Piece deselected", selectedPiece);
    return;
  } else {
    selectedPiece.name = event.target.id;
    let parentDivId = event.target.parentNode.id; //get parentID of current square
    selectedPiece.parentId = parseInt(parentDivId);
    console.log('Animal piece selected', selectedPiece);

    // Assign animal power to selected piece
    selectedPiece.power = assignAnimalPower(selectedPiece.name);
    console.log(selectedPiece.name, "has power:", selectedPiece.power);

    // call highlight SurroundingDivs function
    highlightSurroundingDivs(parentDivId);
  }
};

// select Target Square function
const selectTargetSquare = (event) => {
  event.preventDefault();
  if (selectedPiece.name.length === 0) {
    console.log(`Target square ${event.target.id} selected.`);
    alert("Please select Animal Piece to continue.");
    return;
  }

  //TODO: check if target is occupied

  let targetedSquare = event.target.id;
  console.log(`Move animal piece to square id ${event.target.id}.`);

  //push event target id into occupiedSquare[]
  occupiedSquares.push(parseInt(targetedSquare));
  console.log(`Added NEW Parent id ${event.target.id}`, occupiedSquares);

  //remove previous Parent id of selectedPiece from occupiedSquare array
  let parentId = parseInt(selectedPiece.parentId);
  let parentIdx = occupiedSquares.indexOf(parentId);
  console.log('Remove Parent id', parentId);
  occupiedSquares.splice(parentIdx, 1);
  console.log('after remove', occupiedSquares);

  //append selectedPiece >> New selected square
  let animalPiece = document.getElementById(selectedPiece.name);
  let previousSelectedSquare = document.getElementById(selectedPiece.parentId);
  previousSelectedSquare.addEventListener("click", selectTargetSquare);
  event.target.appendChild(animalPiece);
  event.target.removeEventListener("click", selectTargetSquare);

  //reset selectedPiece
  selectedPiece = { name: "", parentId: null };
  removeHighlight();
}

// =========================================================================

//* Helper Function

// highlight SurroundingDiv function
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
  Object.values(surroundingDiv).forEach((id) => {
    const surroundingDiv = document.getElementById(id.toString());
    if (surroundingDiv) {
      surroundingDiv.classList.add('highlighted');
    }
  });
};

// remove Highlight function
const removeHighlight = () => {
  const highlightedDivs = document.querySelectorAll('.highlighted');

  highlightedDivs.forEach((divSquare) => {
    divSquare.classList.remove('highlighted');
  });
};

// assign Power Value to animal Piece for Player 1 and Player 2
const assignAnimalPower = (selectedPiece) => {
  switch (selectedPiece) {
    case 'animal-P1-elephant':
      return animalPower.elephant;
    case 'animal-P2-elephant':
      return animalPower.elephant;
    case 'animal-P1-lion':
      return animalPower.lion;
    case 'animal-P2-lion':
      return animalPower.lion;
    case 'animal-P1-tiger':
      return animalPower.tiger;
    case 'animal-P2-tiger':
      return animalPower.tiger;
    case 'animal-P1-leopard':
      return animalPower.leopard;
    case 'animal-P2-leopard':
      return animalPower.leopard;
    case 'animal-P1-dog':
      return animalPower.dog;
    case 'animal-P2-dog':
      return animalPower.dog;
    case 'animal-P1-wolf':
      return animalPower.wolf;
    case 'animal-P2-wolf':
      return animalPower.wolf;
    case 'animal-P1-cat':
      return animalPower.cat;
    case 'animal-P2-cat':
      return animalPower.cat;
    case 'animal-P1-rat':
      return animalPower.rat;
    case 'animal-P2-rat':
      return animalPower.rat;
    default:
      return null; // Default power if the animal name is not recognized
  }
};

// =========================================================================

//* Game Logic

// compareAnimalPower()
const compareAnimalPower = () => {

}

// canAnimalCrossRiver()
// canAnimalEnterRiver()
// didAnimalEnterTrap()
// didAnimalEnterDen()
// checkOpponentRemainingPieces()

// =========================================================================

//* GameBoard Setup

// render GameBoard function
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

    //check for Animal Piece and place on gameboard
    if (tokens.indexOf(boardSetUp) > -1) {
      const animalPiece = document.createElement("div");
      animalPiece.setAttribute("id", "animal-" + boardSetUp);
      square.appendChild(animalPiece);
      animalPiece.addEventListener("click", selectAnimalPiece);
      occupiedSquares.push((idx + 1)); // all animal piece on white squares
      // console.log("Animal Pieces location:", occupiedSquares); // log purposes

      //check for Color Squares and indicate on gameboard
    } else if (boardSetUp.length > 0) {
      square.classList.add(boardSetUp);
      square.setAttribute("id", (idx + 1));
      square.addEventListener("click", selectTargetSquare);
    } else {
      square.addEventListener("click", selectTargetSquare); // white Squares
    }
  })
};

renderGameBoard(); // call function (can be removed)


// TODO: add image source to token pieces











