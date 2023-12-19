// https://adventofcode.com/2023/day/18
// Day 18: Lavaduct Lagoon

import { readInput } from '../../common/index';

const digInstructions: Array<[string, number, string]> = readInput('days/day18/inputDemo2', '\n').map(
  (line) => line.split(' ') as [string, number, string],
);

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

function buildTerrain(digInstructions: Array<[string, number]>): { [x: string]: { [y: string]: string } } {
  const terrain: { [x: string]: { [y: string]: string } } = {};

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

  return terrain;
}

const part01Terrain = buildTerrain(digInstructions.map(([a, b]) => [a, b]));

console.log(getTerrainString(part01Terrain));

const part01 = Object.keys(part01Terrain).reduce((total, x) => {
  let count = total;

  for (const y of Object.keys(part01Terrain[x])) {
    if (part01Terrain[x][y] === '#' || part01Terrain[x][y] === '*') count += 1;
  }

  return count;
}, 0);
process.stdout.write(`Part 01: ${part01}\n`);

const updatedDigInstructions = digInstructions.map(([, , code]) => {
  const directionCode = code.slice(-2, -1);
  const length = Number.parseInt(code.slice(2, -2), 16);

  if (directionCode === '0') return ['R', length];
  if (directionCode === '1') return ['D', length];
  if (directionCode === '2') return ['L', length];
  if (directionCode === '3') return ['U', length];
});

type Point = {
  x: number;
  y: number;
  next?: Point;
  prev?: Point;
  id: number;
};

function printPolygon(firstPoint: Point) {
  let currentPoint = firstPoint;
  const matrix: Array<string[]> = [];

  do {
    const from = currentPoint;
    const to = currentPoint.next;

    for (let y = Math.min(from.y, to.y); y <= Math.max(from.y, to.y); y++) {
      for (let x = Math.min(from.x, to.x); x <= Math.max(from.x, to.x); x++) {
        if (!matrix[y]) matrix[y] = [];
        matrix[y][x] = '*';
      }
    }

    currentPoint = currentPoint.next;
  } while (currentPoint !== firstPoint);

  for (let i = 0; i < matrix.length; i++) {
    if (!matrix[i]) matrix[i] = [];
  }

  for (const row of matrix) {
    for (let i = 0; i < row.length; i++) {
      if (!row[i]) row[i] = '.';
    }
    console.log(row.join(''));
  }
}
function cleanPolygon(firstPoint: Point): Point {
  let referencePoint = firstPoint;
  let currentPoint = referencePoint;

  // Delete duplicated points
  do {
    if (currentPoint.x === currentPoint.next.x && currentPoint.y === currentPoint.next.y) {
      const pointToDelete = currentPoint.next;
      console.log('deleting duplicated point', pointToDelete.x, pointToDelete.y);
      pointToDelete.next.prev = pointToDelete.prev;
      pointToDelete.prev.next = pointToDelete.next;
      if (pointToDelete === referencePoint) referencePoint = currentPoint.prev;
    }
    currentPoint = currentPoint.next;
  } while (currentPoint !== referencePoint);

  currentPoint = referencePoint;
  // Delete redundant points
  do {
    if (
      currentPoint.y === currentPoint.prev.y &&
      currentPoint.y === currentPoint.next.y &&
      currentPoint !== currentPoint.next.next
    ) {
      const pointToDelete = currentPoint;
      console.log('deleting redundant point', pointToDelete.x, pointToDelete.y);
      pointToDelete.next.prev = pointToDelete.prev;
      pointToDelete.prev.next = pointToDelete.next;
    }
    currentPoint = currentPoint.next;
  } while (currentPoint !== referencePoint);

  return referencePoint;
}

let firstPoint: Point = { x: 0, y: 0, id: 0 };
let currentPoint = firstPoint;
const yCutsSet = new Set<number>();
let count = 1;
for (const instruction of digInstructions) {
  const [direction, length] = instruction;
  let { x, y } = currentPoint;

  if (direction === 'U') y -= Number(length);
  if (direction === 'R') x += Number(length);
  if (direction === 'D') y += Number(length);
  if (direction === 'L') x -= Number(length);

  console.log(x, y);

  if (x === 0 && y === 0) {
    currentPoint.next = firstPoint;
    firstPoint.prev = currentPoint;
  } else {
    const newPoint: Point = { x, y, id: count++ };
    currentPoint.next = newPoint;
    newPoint.prev = currentPoint;
    currentPoint = newPoint;
    yCutsSet.add(y);
  }
}

const yCuts = Array.from(yCutsSet).sort((a, b) => a - b);

printPolygon(firstPoint);

console.log(yCuts);

let area = 0;
for (let i = 0; i < yCuts.length - 1; i++) {
  const cut = yCuts[i];
  const nextCut = yCuts[i + 1];
  console.log('cut from', cut, 'to', nextCut);

  const cutPoints = [];

  let currentPoint = firstPoint;
  do {
    const p1 = currentPoint;
    const p2 = currentPoint.next;

    if (p1.y === p2.y && p1.y === cut) {
      cutPoints.push([p1, p2]);
    }

    currentPoint = currentPoint.next;
  } while (currentPoint !== firstPoint);

  for (const [from, to] of cutPoints) {
    const x = Math.abs(from.x - to.x) + 1;
    const y = Math.abs(cut - nextCut) + 1;

    area += x * y;

    from.y = nextCut;
    to.y = nextCut;

    firstPoint = cleanPolygon(firstPoint);
    printPolygon(firstPoint);
  }
}

const part02 = area;
process.stdout.write(`Part 02: ${part02}\n`);
