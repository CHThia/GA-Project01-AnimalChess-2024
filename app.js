console.log("Hello World");

//* Test input
// let player1NameInput = document.getElementById("player1Name_input");
// function display() {
//   let text = player1NameInput.value;
//   document.getElementById("instruction").innerText = text;
// }
// start = document.getElementById("start");
// start.addEventListener('click', display);


//* Model
// collect list of players name
const namelist = ["one", "two", "three"];


//* Function
// random select player name to start the game play
function randomSelectName() {
  return namelist[Math.floor(Math.random() * namelist.length)];
}
// TEST function to select from array
console.log(randomSelectName());

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
let startPopup = document.getElementById("start-popup");
start.addEventListener("click", function () {
  startPopup.style.display = "none"; // switch off Start-Popup
  // run the random player selection
  // show who is the main player
  // reveal gameplay
});

//* Render
// render intro
const intro = document.getElementById("intro");
intro.textContent = "To begin gameplay, enter 2 names in the input box below.";
intro.style.fontWeight = "bold";
// render to show which player start first
// render GameBoard and Animal Items



