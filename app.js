console.log("Webpage is working properly.");

function Player(name, id, isStart, isActive) {
  this.name = name;
  this.id = id
  this.isStart = isStart
  this.isActive = isActive
}

function AnimalPiece(name, owner, power, isAlive, icon) {
  this.name = name;
  this.owner = owner;
  this.power = power;
  this.isAlive = isAlive
  this.icon = icon;
}

//* Global Variables (Start)
// collect list of players name
let playerList = [];
let arrayOfAnimalPieces = [];

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

// animal SVG icon
let animalSvg = {
  elephant: "svg/elephant.svg",
  lion: "svg/lion.svg",
  tiger: "svg/tiger.svg",
  leopard: "svg/leopard.svg",
  dog: "svg/dog.svg",
  wolf: "svg/wolf.svg",
  cat: "svg/cat.svg",
  rat: "svg/rat.svg",
}

// use for finding nearby animal piece
let nearbyAnimals = []

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

    //* assign animal power to selected piece (to remove code later)
    // selectedPiece.power = assignAnimalPower(selectedPiece.name);
    // console.log(selectedPiece.name, "has power:", selectedPiece.power);


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
  //occupiedSquares.indexOf(event.target.id) > -1

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
  console.log('new ap', animalPiece)
  let previousSelectedSquare = document.getElementById(selectedPiece.parentId);
  previousSelectedSquare.addEventListener("click", selectTargetSquare);
  event.target.appendChild(animalPiece);
  event.target.removeEventListener("click", selectTargetSquare);
  showEndTurnBtn()

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
    if (occupiedSquares.indexOf(id) > -1) {
      let childId = surroundingDiv.childNodes[1].id
      console.log("childNode", surroundingDiv.childNodes)
      nearbyAnimals.push(childId);
      console.log("nearbyanimals", nearbyAnimals)
    }
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

// assign Power Value to animal Piece for Player 1 and Player 2
const assignAnimalIcon = (selectedPiece) => {
  switch (selectedPiece) {
    case 'animal-P1-elephant':
      return animalSvg.elephantP1;
    case 'animal-P2-elephant':
      return animalSvg.elephantP2;
    case 'animal-P1-lion':
      return animalSvg.lionP1;
    case 'animal-P2-lion':
      return animalSvg.lionP2;
    case 'animal-P1-tiger':
      return animalSvg.tigerP1;
    case 'animal-P2-tiger':
      return animalSvg.tigerP2;
    case 'animal-P1-leopard':
      return animalSvg.leopardP1;
    case 'animal-P2-leopard':
      return animalSvg.leopardP2;
    case 'animal-P1-dog':
      return animalSvg.dogP1;
    case 'animal-P2-dog':
      return animalSvg.dogP2;
    case 'animal-P1-wolf':
      return animalSvg.wolfP1;
    case 'animal-P2-wolf':
      return animalSvg.wolfP2;
    case 'animal-P1-cat':
      return animalSvg.catP1;
    case 'animal-P2-cat':
      return animalSvg.catP2;
    case 'animal-P1-rat':
      return animalSvg.ratP1;
    case 'animal-P2-rat':
      return animalSvg.ratP2;
    default:
      return null; // Default power if the animal name is not recognized
  }
};

const createPlayer = (event) => {
  event.preventDefault()
  let elemId = event.target.id
  let input = document.getElementById(elemId + "-input")
  let btn = document.getElementById(elemId)
  let inputValue = input.value
  let player = new Player(inputValue, "", false, false)
  playerList.push(player)
  console.log('PL', playerList)
  if (playerList.length === 2) {
    startbtn.style.display = "block"
  }
  btn.style.display = "none"
}

// random select player name to start the game play
const randomSelectName = () => {
  let selectedIdx = Math.floor(Math.random() * playerList.length)
  console.log('r', selectedIdx)
  playerList.forEach((player, idx) => {
    if (selectedIdx === idx) {
      player.id = "P1"
      player.isStart = true
      player.isActive = true
    } else {
      player.id = "P2"
    }
  })
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

  if (activePlayer.id === "P1" && selectedId.startsWith("animal-P1")) {
    return true
  }
  if (activePlayer.id === "P2" && selectedId.startsWith("animal-P2")) {
    return true
  }
  alert("Please choose your own animal to move")
  return false
}

const showEndTurnBtn = () => {
  let wrapperDiv = document.getElementById('end-turn')
  let btn = document.getElementById('end-turn-btn')
  wrapperDiv.style.display = 'block'
  btn.addEventListener('click', endTurn)
  console.log('show')
}

const endTurn = (event) => {
  event.preventDefault()
  playerList.forEach(player => {
    if (player.isActive) {
      player.isActive = false
    } else {
      player.isActive = true
    }
  })
  let wrapperDiv = document.getElementById('end-turn')
  wrapperDiv.style.display = 'none'
}

// TODO: Attach animal SVG to each animal piece
const initAnimalPieces = () => {
  let players = ["P1", "P2"]
  players.forEach(player => {
    for (let key in animalPower) {
      let token = new AnimalPiece(key, player, animalPower[key], true)
      arrayOfAnimalPieces.push(token)
    }
  })
  console.log('animalPieces', arrayOfAnimalPieces)
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

const placeAnimalPiece = (pieceId, currIdx, targetArr) => {
  let animalPiece = null
  arrayOfAnimalPieces.forEach(piece => {
    let tempName = piece.owner + "-" + piece.name
    if (tempName === pieceId) {
      animalPiece = document.createElement("div");
      animalPiece.classList.add("animal");
      animalPiece.setAttribute("id", "animal-" + pieceId);
      animalPiece.addEventListener("click", selectAnimalPiece);
      targetArr.push((parseInt(currIdx) + 1));
    }
  })
  return animalPiece;
}

// render GameBoard function
const gameBoard = document.querySelector("#gameboard");
const renderGameBoard = () => {

  gameBoard.style.display = "flex";
  gameBoard.style.flexWrap = "wrap";

  initAnimalPieces();

  boardSetUps.forEach((boardSetUp, idx) => {
    //create white squares and append to gameBoard
    const square = document.createElement("div");
    square.style.fontSize = "10px"; // to remove later; now for num reference only
    square.innerText = idx + 1; // to remove later; now for num reference only
    square.classList.add("square");
    square.setAttribute("id", (idx + 1));
    gameBoard.append(square);

    //check for Color Squares and indicate on gameboard
    if (boardSetUp.length > 0) {
      //check for Animal Piece and place on gameboard
      square.classList.add(boardSetUp);
      square.setAttribute("id", (idx + 1));
      square.addEventListener("click", selectTargetSquare);
    } else {
      square.addEventListener("click", selectTargetSquare); // white Squares
    }
  
    let animalPiece = placeAnimalPiece(boardSetUp, idx, occupiedSquares);
    if (animalPiece !== null) {
      square.appendChild(animalPiece);
      square.removeEventListener('click', selectTargetSquare)
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
  setTimeout(loadReveal, 500); //show player to start (1000)
  setTimeout(exitLoad, 1000); //exit loading... and reveal gameboard (3000)
});








