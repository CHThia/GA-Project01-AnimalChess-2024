console.log("Webpage is working properly.");

function Player(name, isStart, isActive) {
  this.name = name;
  this.isStart = isStart
  this.isActive = isActive
}

function AnimalPiece(name, color, power, isAlive) {
  this.name = name;
  this.color = color;
  this.power = power;
  this.isAlive = isAlive
}


//* Global Variables (Start)
// collect list of players name
let playerList = [];
let arrayOfAnimalPiece = [];


// * Global Variables (Game)
// Update of occupy and non-occupied spaces
let occupiedSquares = [];

// selected piece will have animal piece name and parentId (white square)
let selectedPiece = { name: "", parentId: null };

// give animal piece Power value
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

let enter1btn = document.getElementById("name1");
let enter2btn = document.getElementById("name2");
let startbtn = document.getElementById("start");

// click play button to begin gameplay
const startPopup = document.getElementById("start-popup");
const playerSelection = document.getElementById("player-selection");


// =========================================================================

//* Game Controls

// select Animal Piece and move options (highlight squares)
const selectAnimalPiece = (event) => {
  event.preventDefault();

  let isRightPlayer = isPlayerTurn(event.target.id)
  if (!isRightPlayer) return

  // Toggle select animal piece
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

    // assign animal power to selected piece
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


const createPlayer = (event) => {
  event.preventDefault()
  let elemId = event.target.id
  let input = document.getElementById(elemId + "-input")
  let inputValue = input.value
  let player = new Player(inputValue, false, false)
  playerList.push(player)
  console.log('PL', playerList)
  if (playerList.length === 2) {
    startbtn.style.display = "block"
  }
}

// random select player name to start the game play
const randomSelectName = () => {
  let selectedIdx = Math.floor(Math.random() * playerList.length)
  playerList[selectedIdx].isStart = true
  playerList[selectedIdx].isActive = true
  return playerList[selectedIdx];
}


// loading and reveal player to start
const loadReveal = () => {
  const selectedPlayer = randomSelectName(); // exec randomSelectName()
  playerName.textContent = `Player '${selectedPlayer.name}' will start the gameplay.`;
  console.log('selectedPlayer', selectedPlayer);
}

//exit loading
const exitLoad = () => {
  playerSelection.style.display = "none";
  renderGameBoard();
}

//validate isPlayerTurn
const isPlayerTurn = (selectedId) => {
  let activePlayer = playerList.find(player => player.isActive)

  if (activePlayer.isStart && selectedId.startsWith("animal-P1")) {
    return true
  }
  if (!activePlayer.isStart && selectedId.startsWith("animal-P2")) {
    return true
  }
  alert("Please choose your own animal to move")
  return false
}

// =========================================================================

//* Game Logic

// compareAnimalPower()
const compareAnimalPower = (attackerPower, defenderPower) => {
  if (attackerPower > defenderPower) {
    return 'attacker'; // Attacker wins
  } else if (attackerPower < defenderPower) {
    return 'defender'; // Defender wins
  } else {
    return 'tie'; // It's a tie
  }
};

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
      animalPiece.classList.add("animal");
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

// renderGameBoard(); // call function (can be removed)


// TODO: add image source to token pieces



// =====================================================================

enter1btn.addEventListener("click", createPlayer);
enter2btn.addEventListener("click", createPlayer);
startbtn.addEventListener("click", function () {
  startPopup.style.display = "none"; // switch off Start-Popup
  playerSelection.style.display = "block"; // show loading...
  setTimeout(loadReveal, 1000); //show player to start
  setTimeout(exitLoad, 3000); //exit loading... and reveal gameboard
});








