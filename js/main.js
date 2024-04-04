console.log("Web Game is working properly.");

// Class : Player
function Player(name, id, isStart, isActive) {
  this.name = name;
  this.id = id;
  this.isStart = isStart;
  this.isActive = isActive;
  this.numRemainingAnimals = 8;
}

// Class : Animal Pieces
function AnimalPiece(name, owner, power, isAlive, icon) {
  this.name = name;
  this.owner = owner;
  this.power = power;
  this.isAlive = isAlive;
  this.icon = icon;
  this.canEat = (prey) => { 
    console.log('ce', prey, this.power)
    return this.power > prey.power; 
  }
}

//* Global Variables (Start)

let playerList = []; // collect list of players name
let arrayOfAnimalPieces = [];

// * Global Variables (Game)

let occupiedSquares = []; // Update of occupy and non-occupied spaces

// selected piece will have animal piece name and parentId (white square)
let selectedPiece = { name: "", parentId: null };

let prevPiece = {name: "", parentId: null };

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

// use for finding nearby animal piece
let nearbyAnimals = [];

let surroundingDivs = {};

let currentSelection = '';  //id
let prevSelection = '';  //id

let activePlayer = {}; 

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

  //if player does not own clicked piece
  if (!playerIsOwner(event.target.id)) {
    if (selectedPiece.name.length > 0) {
      console.log('1')
      let isOwnerOfPrevPiece = playerIsOwner(selectedPiece.name)
      if (isOwnerOfPrevPiece) {
        let arr = selectedPiece.name.split('-')
        let predator = arrayOfAnimalPieces.find(piece => {
          if (piece.name === arr[2] && piece.owner === activePlayer.id) {
            return piece;
          }
        })
        let arr2 = event.target.id.split('-')
        let prey = arrayOfAnimalPieces.find(piece => {
          if (piece.name === arr2[2] && piece.owner !== activePlayer.id) {
            return piece
          }
        })
        killAnimal(predator, prey, event.target.parentNode.id)
        removeHighlight();
        endTurn();
        return;
      }
    } else {
      alert("Choose something you own");
      return;
    }
  } 
  console.log('2')
  if (selectedPiece.name === event.target.id) {
    removeHighlight(); // call remove Highlight function
    selectedPiece = { name: "", parentId: null };
    return;
  } else {
    if (selectedPiece.name.length > 0) {
      removeHighlight();
    }
    prevPiece.name = selectedPiece.name;
    prevPiece.parentId = selectedPiece.parentId;
    selectedPiece.name = event.target.id;
    selectedPiece.parentId = parseInt(event.target.parentNode.id); 
  }

  // if (selectedPiece.name.length > 0) {
  // } else {
  //   selectedPiece.name = event.target.id
  //   selectedPiece.parentId = parseInt(event.target.parentNode.id); 
  // }

  getSurroundingDivs(event.target.parentNode.id)
  highlightSurroundingDivs(surroundingDivs);
  
  // let isRightPlayer = isPlayerTurn(event.target.id)
  // if (!isRightPlayer) return

};


//* Game Move Logic for players (REMOVE TEXTS LATER)
//click chesspiece --> is active player the owner of the chesspiece ---> no ---> alert move is not allowed

//click chesspiece --> is active player the owner of the chesspiece ---> yes --> highlight surrounding --> click empty square -->check empty square is one of the surrounding sqs --> move to selected square --> end turn (switch active player)

//click chesspiece --> highlight surrounding --> click on another chesspiece --> is player the owner ---> yes --> highlight surrounding divs --> click empty square -->check empty square is one of the surrounding sqs --> move to selected square --> end turn (switch active player)

//click chesspiece --> highlight surrounding --> click on another chesspiece --> is player the owner ---> no ---> is chesspiece one in one of the surrounding space ---> yes --->  check can eat target chesspiece ---> yes --> move target chesspiece to side, move prev chesspiece to target square, deduct 1 from opponent --> end turn (switch active player)

//click chesspiece --> highlight surrounding --> click on another chesspiece --> is player the owner ---> no ---> is chesspiece one in one of the surrounding space ---> yes --->  check can eat target chesspiece ---> no --> alert move is not allowed 

//click chesspiece --> highlight surrounding --> click on another chesspiece --> is player the owner ---> no ---> is chesspiece one in one of the surrounding space ---> no --> alert move is not allowed


const playerIsOwner = (selectedPieceId) => {
  let arr = selectedPieceId.split('-')
  console.log('active', activePlayer, 'sel', selectedPieceId)
  return activePlayer.id === arr[1]
}

const isSurroundingSq = (squareId) => {
  let arr = Object.values(surroundingDivs)
  if (arr.indexOf(squareId) > -1) return true
  return false
}

// select Target Square function
const selectTargetSquare = (event) => {
  event.preventDefault();

  if (selectedPiece.name.length === 0) {
    console.log(`Target square ${event.target.id} selected.`);
    alert("Please select Animal Piece to continue.");
    return;
  }

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

const getSurroundingDivs = (parentDivId) => {
   // Calculate surrounding div IDs
   
    surroundingDivs.top = parseInt(parentDivId) - 7
    surroundingDivs.right = parseInt(parentDivId) + 1
    surroundingDivs.bottom = parseInt(parentDivId) + 7
    surroundingDivs.left = parseInt(parentDivId) - 1

  // Top Edge perimeter
  if (noTopSide.indexOf(parseInt(parentDivId)) > -1) {
    surroundingDivs.top = 0;
  }
  // Right Edge perimeter
  if (noRightSide.indexOf(parseInt(parentDivId)) > -1) {
    surroundingDivs.right = 0;
  }
  // Bottom Edge perimeter
  if (noBottomSide.indexOf(parseInt(parentDivId)) > -1) {
    surroundingDivs.bottom = 0;
  }
  // Left Edge perimeter
  if (noLeftSide.indexOf(parseInt(parentDivId)) > -1) {
    surroundingDivs.left = 0;
  }
}

// highlight SurroundingDiv function
const highlightSurroundingDivs = (arrayOfDivs) => {
  // Extract Div id into an array
  Object.values(arrayOfDivs).forEach((id) => {
    let currDiv = document.getElementById(id.toString());
    if (occupiedSquares.indexOf(id) > -1) {
      let childId = currDiv.childNodes[1].id
      let animal = arrayOfAnimalPieces.find(piece => {
        let arr = childId.split("-")
        if (piece.owner === arr[1] && piece.name === arr[2] ) {
          return piece
        }
      })

      nearbyAnimals.push(animal);
      console.log("nearbyanimals", nearbyAnimals)
    }
    if (currDiv) {
      currDiv.classList.add('highlighted');
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


//* assign Power Value to animal Piece for Player 1 and Player 2
// const assignAnimalPower = (selectedPiece) => {
//   switch (selectedPiece) {
//     case 'animal-P1-elephant':
//       return animalPower.elephant;
//     case 'animal-P2-elephant':
//       return animalPower.elephant;
//     case 'animal-P1-lion':
//       return animalPower.lion;
//     case 'animal-P2-lion':
//       return animalPower.lion;
//     case 'animal-P1-tiger':
//       return animalPower.tiger;
//     case 'animal-P2-tiger':
//       return animalPower.tiger;
//     case 'animal-P1-leopard':
//       return animalPower.leopard;
//     case 'animal-P2-leopard':
//       return animalPower.leopard;
//     case 'animal-P1-dog':
//       return animalPower.dog;
//     case 'animal-P2-dog':
//       return animalPower.dog;
//     case 'animal-P1-wolf':
//       return animalPower.wolf;
//     case 'animal-P2-wolf':
//       return animalPower.wolf;
//     case 'animal-P1-cat':
//       return animalPower.cat;
//     case 'animal-P2-cat':
//       return animalPower.cat;
//     case 'animal-P1-rat':
//       return animalPower.rat;
//     case 'animal-P2-rat':
//       return animalPower.rat;
//     default:
//       return null; // Default power if the animal name is not recognized
//   }
// };

//* assign Power Value to animal Piece for Player 1 and Player 2
// const assignAnimalIcon = (selectedPiece) => {
//   switch (selectedPiece) {
//     case 'animal-P1-elephant':
//       return animalSvg.elephantP1;
//     case 'animal-P2-elephant':
//       return animalSvg.elephantP2;
//     case 'animal-P1-lion':
//       return animalSvg.lionP1;
//     case 'animal-P2-lion':
//       return animalSvg.lionP2;
//     case 'animal-P1-tiger':
//       return animalSvg.tigerP1;
//     case 'animal-P2-tiger':
//       return animalSvg.tigerP2;
//     case 'animal-P1-leopard':
//       return animalSvg.leopardP1;
//     case 'animal-P2-leopard':
//       return animalSvg.leopardP2;
//     case 'animal-P1-dog':
//       return animalSvg.dogP1;
//     case 'animal-P2-dog':
//       return animalSvg.dogP2;
//     case 'animal-P1-wolf':
//       return animalSvg.wolfP1;
//     case 'animal-P2-wolf':
//       return animalSvg.wolfP2;
//     case 'animal-P1-cat':
//       return animalSvg.catP1;
//     case 'animal-P2-cat':
//       return animalSvg.catP2;
//     case 'animal-P1-rat':
//       return animalSvg.ratP1;
//     case 'animal-P2-rat':
//       return animalSvg.ratP2;
//     default:
//       return null; // Default power if the animal name is not recognized
//   }
// };


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
  activePlayer = selectedPlayer
  playerName.textContent = `Player '${selectedPlayer.name}' will start the gameplay.`;
  console.log('selectedPlayer', selectedPlayer);
}

//exit loading
const exitLoad = () => {
  playerSelection.style.display = "none";
  console.log('activeplayer', activePlayer)
  renderGameBoard();
}

//validate isPlayerTurn
const isPlayerTurn = (selectedId) => {
  let activePlayer = playerList.find(player => player.isActive)

  if (activePlayer.id === "P1" && selectedId.startsWith("animal-P1") || activePlayer.id === "P2" && selectedId.startsWith("animal-P2")) {
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
  if (event !== undefined) {
    event.preventDefault()
  }  
  playerList.forEach(player => {
    if (player.isActive) {
      player.isActive = false
    } else {
      player.isActive = true
      activePlayer = player
    }
    console.log('pl', player)
  })
  selectedPiece = { name: "", parentId: null };
  prevPiece = { name: "", parentId: null };
  console.log('endturn', playerList)
  nearbyAnimals = [];
  let wrapperDiv = document.getElementById('end-turn')
  wrapperDiv.style.display = 'none'
}

const initAnimalPieces = () => {
  let players = ["P1", "P2"];
  
  players.forEach(player => {
      for (let key in animalPower) {
        let token = new AnimalPiece(key, player, animalPower[key], true, "./svg/"+ player + "-" + key +".svg")
        arrayOfAnimalPieces.push(token)
      }
  }) 
  console.log('animalPieces', arrayOfAnimalPieces)
}

// =========================================================================

//* Game Logic

// Eliminate Animal
const killAnimal = (animal1, animal2, targetSqId) => {
  console.log('caneat', animal1.canEat(animal2))
  if(animal1.canEat(animal2)){
    let predator = document.getElementById("animal-" + animal1.owner + "-" + animal1.name)
    let killedAnimal = document.getElementById("animal-" + animal2.owner + "-" + animal2.name);
    let removeAnimal = document.getElementById("remove-animal");
    removeAnimal.appendChild(killedAnimal); 
    let targetSq = document.getElementById(targetSqId)
    targetSq.appendChild(predator)
    let opponent = playerList.find(player => {
      if (!player.isActive) return player
    })
    opponent.numRemainingAnimals -= 1
  } else {
    alert('Your teeth is not sharp enough!')
  }
};

// TODO: Determine Win conditions
// did AnimalEnterDen() -- Win 
// check OpponentRemainingPieces() -- if 0, opposing player Win


//* Optional -Extra consideration to add into the game
// canAnimalCrossRiver()
// canAnimalEnterRiver()
// didAnimalEnterTrap()

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
      animalPiece.style.backgroundImage = "url('" + piece.icon +"')";
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


// =====================================================================

// Initial clicks before game play starts

enter1btn.addEventListener("click", createPlayer);
enter2btn.addEventListener("click", createPlayer);
startbtn.addEventListener("click", function () {
  startPopup.style.display = "none"; // switch off Start-Popup
  playerSelection.style.display = "block"; // show loading...
  setTimeout(loadReveal, 1000); //show player to start (1000)
  setTimeout(exitLoad, 3000); //exit loading... and reveal gameboard (3000)
});