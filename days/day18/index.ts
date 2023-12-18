// https://adventofcode.com/2023/day/18
// Day 18: Lavaduct Lagoon

import { dir } from 'console';
import { readInput } from '../../common/index';

const digInstructions = readInput('days/day18/input01', '\n').map((line) => line.split(' '));

const terrain: { [x: string]: { [y: string]: string } } = {};

function getTerrainString(terrain: { [x: string]: { [y: string]: string } }): string {
  const rows = Object.keys(terrain[0]).sort((a, b) => Number(a) - Number(b));
  const columns = Object.keys(terrain).sort((a, b) => Number(a) - Number(b));
  let terrainString = '';

  for (const y of rows) {
    for (const x of columns) {
      terrainString += terrain[x][y];
    }

    terrainString += '\n';
  }

  return terrainString;
}

terrain[0] = {};
terrain[0][0] = '#';
let currentX = 0;
let currentY = 0;
const topLeftCorner = [0, 0];
const bottomRightCorner = [0, 0];

// Build dig perimeter
for (const digInstruction of digInstructions) {
  const [direction, length] = digInstruction;

  for (const _ of Array(Number(length))) {
    if (direction === 'U') currentY -= 1;
    if (direction === 'R') currentX += 1;
    if (direction === 'D') currentY += 1;
    if (direction === 'L') currentX -= 1;

    if (!terrain[currentX]) terrain[currentX] = {};
    terrain[currentX][currentY] = '#';
  }

  if (currentX < topLeftCorner[0]) topLeftCorner[0] = currentX;
  if (currentY < topLeftCorner[1]) topLeftCorner[1] = currentY;
  if (currentX > bottomRightCorner[0]) bottomRightCorner[0] = currentX;
  if (currentY > bottomRightCorner[1]) bottomRightCorner[1] = currentY;
}

// Fill terrain spaces
for (let x = topLeftCorner[0]; x <= bottomRightCorner[0]; x++) {
  for (let y = topLeftCorner[1]; y <= bottomRightCorner[1]; y++) {
    if (!terrain[x][y]) {
      terrain[x][y] = '.';
    }
  }
}

// Fill dig interior spaces
for (const x of Object.keys(terrain).sort((a, b) => Number(a) - Number(b))) {
  //
  let inside = false;
  let railingOpen: -1 | 0 | 1 = 0;

  for (const y of Object.keys(terrain[x]).sort((a, b) => Number(a) - Number(b))) {
    // Found a wall
    if (terrain[x][y] === '#') {
      // Section cross
      if (terrain[Number(x) - 1]?.[y] === '#' && terrain[Number(x) + 1]?.[y] === '#') {
        inside = !inside;
      }
      //
      else if (terrain[Number(x) - 1]?.[y] === '#') {
        if (railingOpen === 0) railingOpen = -1;
        else {
          if (railingOpen === 1) {
            inside = !inside;
          }
          railingOpen = 0;
        }
      }
      //
      else if (terrain[Number(x) + 1]?.[y] === '#') {
        if (railingOpen === 0) railingOpen = 1;
        else {
          if (railingOpen === -1) {
            inside = !inside;
          }
          railingOpen = 0;
        }
      }
      // Walking along the wall
      else {
      }
    }

    if (inside && terrain[x][y] === '.') {
      terrain[x][y] = '*';
    }
  }
}

console.log(getTerrainString(terrain));

const part01 = Object.keys(terrain).reduce((total, x) => {
  let count = total;

  for (const y of Object.keys(terrain[x])) {
    if (terrain[x][y] === '#' || terrain[x][y] === '*') count += 1;
  }

  return count;
}, 0);
process.stdout.write(`Part 01: ${part01}\n`);
