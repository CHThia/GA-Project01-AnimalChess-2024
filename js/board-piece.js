//*----- constants -----*//

// gameboard setup
const boardSetUps = [
  "P2-lion", "", "traps", "beastDen", "traps", "", "P2-tiger",
  "", "P2-dog", "", "traps", "", "P2-cat", "",
  "P2-rat", "", "P2-leopard", "", "P2-wolf", "", "P2-elephant",
  "", "river", "river", "", "river", "river", "",
  "", "river", "river", "", "river", "river", "",
  "", "river", "river", "", "river", "river", "",
  "P1-elephant", "", "P1-wolf", "", "P1-leopard", "", "P1-rat",
  "", "P1-cat", "", "traps", "", "P1-dog", "",
  "P1-tiger", "", "traps", "beastDen", "traps", "", "P1-lion"
];

// set gameboard perimeter
const noTopSide = [1, 2, 3, 4, 5, 6, 7,];
const noRightSide = [7, 14, 21, 28, 35, 42, 49, 56, 63];
const noBottomSide = [57, 58, 59, 60, 61, 62, 63];
const noLeftSide = [1, 8, 15, 22, 29, 36, 43, 50, 57];

// define squares with special element
const colorSquares = ["traps", "beastDen", "river"];

