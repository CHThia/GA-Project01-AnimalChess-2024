console.log("Webpage is working properly.");

//* Model
// collect list of players name
const namelist = [];

// Update of occupy and non-occupied spaces
let occupiedSquares = []

//* Function
// random select player name to start the game play
function randomSelectName() {
  return namelist[Math.floor(Math.random() * namelist.length)];
}

// loading and reveal player to start
function loadReveal() {
  const selectName = randomSelectName(); // exec randomSelectName()
  playerName.textContent = `Player '${selectName}' will start the gameplay.`;
  console.log(selectName);
}

//exit loading
function exitLoad() {
  playerSelection.style.display = "none";
  createGameBoard();
}

// player select to start gameplay
function playerStart() {
  if (selectName === namelist[0]) {
  }
}


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
  setTimeout(exitLoad, 2500); //exit loading...
  // reveal gameplay
});


//* Render
// render intro
const intro = document.getElementById("intro");
intro.textContent = "To begin gameplay, enter 2 names in the input box below.";

// render to show which player start first
const playerName = document.getElementById("player-name");
playerName.textContent = "Please wait... Game is selecting player to start...";

// render GameBoard
const gameBoard = document.querySelector("#gameboard");
const createGameBoard = () => {
  boardSetUps.forEach((boardSetUp, idx) => {
    //create default plain chess squarebox
    const square = document.createElement("div");
    square.classList.add("square");
    square.setAttribute("id", (idx + 1));
    gameBoard.append(square);

    //check if the boardSetup is a animal-piece
    if (tokens.indexOf(boardSetUp) > -1) {
      const animalPiece = document.createElement("div");
      animalPiece.setAttribute('id', "animal-" + boardSetUp)
      square.appendChild(animalPiece)
      animalPiece.addEventListener('click', selectAnimalPiece)

      //check if boardSetUp is an element on the chessboard
    } else if (boardSetUp.length > 0) {
      square.classList.add(boardSetUp)
    }

  })
  gameBoard.style.display = "flex";
  gameBoard.style.flexWrap = "wrap";
};

const selectAnimalPiece = (event) => {
  event.preventDefault()
  console.log('this is selected ' + event.target.id)
  //check parent div ID 

  //check if surrounding box is occupied

  //highlight box

}

//selectBox


createGameBoard()











//* Sample Reference
// function loadGameBoard() {
//   let numRow = 9;
//   let numColumn = 7;
//   for (let i = 0; i < numRow; i++) {
//     let row = document.createElement("div");
//     row.setAttribute("id", "r" + (i + 1));
//     row.setAttribute("class", "boardgame-row");
//     for (let j = 0; j < numColumn; j++) {
//       let column = document.createElement("div");
//       column.setAttribute("id", "r" + (i + 1) + "c" + (j + 1));
//       column.setAttribute("class", "boardgame-column");
//       column.innerText = ("r" + (i + 1) + "c" + (j + 1))
//       row.appendChild(column);
//     }
//     gameBoard.appendChild(row);
//   }
// }



