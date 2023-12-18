// https://adventofcode.com/2023/day/17
// Day 17: Clumsy Crucible

import { max, min } from 'lodash';
import { readInput } from '../../common/index';

const input = readInput('days/day17/input01', '\n').map((row) => row.split(''));

type Direction = 'north' | 'west' | 'south' | 'east';
type MapTile = {
  [key in Direction]: MapTile | null;
} & { heatLose: number; id: string };

const directionSides: { [key in Direction]: [Direction, Direction] } = {
  north: ['west', 'east'],
  south: ['east', 'west'],
  east: ['north', 'south'],
  west: ['south', 'north'],
};

function createLinkedMap(rawMap: Array<string[]>): [MapTile, MapTile] {
  const mapSpotMap: { [xKey: string]: { [yKey: string]: MapTile } } = {};
  let id = 0;

  for (const [y, row] of rawMap.entries()) {
    for (const [x, tile] of row.entries()) {
      const mapSpot: MapTile = {
        heatLose: Number(tile),
        north: null,
        west: null,
        south: null,
        east: null,
        id: String(++id),
      };

      if (!mapSpotMap[x]) mapSpotMap[x] = {};

      mapSpotMap[x][y] = mapSpot;
    }
  }

  for (let x = 0; x < rawMap[0].length; x++) {
    for (let y = 0; y < rawMap.length; y++) {
      const mapTile = mapSpotMap[x][y];

      mapTile.north = mapSpotMap[x]?.[y - 1] || null;
      mapTile.west = mapSpotMap[x - 1]?.[y] || null;
      mapTile.south = mapSpotMap[x]?.[y + 1] || null;
      mapTile.east = mapSpotMap[x + 1]?.[y] || null;
    }
  }

  return [mapSpotMap[0][0], mapSpotMap[rawMap[0].length - 1][rawMap.length - 1]];
}
function generateMap(firstMapTile: MapTile, paintPath: Set<MapTile>): string {
  let mapString = '';

  let currentTile = firstMapTile;

  while (currentTile) {
    let columnBlock = currentTile;

    while (columnBlock) {
      mapString += paintPath.has(columnBlock) ? `\x1b[1m\x1b[33m${columnBlock.heatLose}\x1b[0m` : columnBlock.heatLose;

      columnBlock = columnBlock.east;
    }

    mapString += '\n';
    currentTile = currentTile.south;
  }

  return mapString;
}

const [startPosition, goalPosition] = createLinkedMap(input);

const walkCalls: Array<[MapTile, Direction, number, number, Set<MapTile>]> = [];
let minHeatLoss = Infinity;
let minPath: Set<MapTile> = null;
const callsCache: { [key: string]: number } = {};
function walk(
  enterPosition: MapTile,
  direction: Direction,
  maxWalkDistance: number,
  heatLost: number,
  currentPath: Set<MapTile>,
) {
  const currentHeatLost = heatLost + enterPosition.heatLose;
  if (currentHeatLost > minHeatLoss) return;

  const callKey = `${enterPosition.id}:${direction}:${maxWalkDistance}`;
  if (callsCache[callKey] && callsCache[callKey] <= currentHeatLost) return;
  callsCache[callKey] = currentHeatLost;

  if (currentPath.has(enterPosition)) return;
  currentPath.add(enterPosition);

  if (enterPosition === goalPosition) {
    if (currentHeatLost < minHeatLoss) {
      minPath = currentPath;
      minHeatLoss = currentHeatLost;
      console.log('Arrived part01', minHeatLoss, walkCalls.length);
    }
    return;
  }

  // Go Straight
  if (maxWalkDistance) {
    if (enterPosition[direction]) {
      walkCalls.push([enterPosition[direction], direction, maxWalkDistance - 1, currentHeatLost, new Set(currentPath)]);
    }
  }

  const [ccw, cw] = directionSides[direction];
  // 90 counter clockwise
  if (enterPosition[ccw]) {
    walkCalls.push([enterPosition[ccw], ccw, 2, currentHeatLost, new Set(currentPath)]);
  }
  // 90 clockwise
  if (enterPosition[cw]) {
    walkCalls.push([enterPosition[cw], cw, 2, currentHeatLost, new Set(currentPath)]);
  }
}

walkCalls.push(
  [startPosition.south, 'south', 2, 0, new Set<MapTile>([startPosition])],
  [startPosition.east, 'east', 2, 0, new Set<MapTile>([startPosition])],
);
// while (walkCalls.length) {
//   const [position, direction, maxWalkDistance, heatLoss, currentPath] = walkCalls.pop();
//   walk(position, direction, maxWalkDistance, heatLoss, currentPath);
// }

// console.log(generateMap(startPosition, minPath));

// const part01 = minHeatLoss;
// process.stdout.write(`Part 01: ${part01}\n`);

const walkCalls2: Array<[MapTile, Direction, number, number, Set<MapTile>]> = [];
let minHeatLoss2 = Infinity;
let minPath2: Set<MapTile> = null;
const callsCache2: { [key: string]: number } = {};
function walk2(
  enterPosition: MapTile,
  direction: Direction,
  maxWalkDistance: number,
  heatLost: number,
  currentPath: Set<MapTile>,
) {
  const currentHeatLost = heatLost + enterPosition.heatLose;
  if (currentHeatLost > minHeatLoss2) return;

  const callKey = `${enterPosition.id}:${direction}:${maxWalkDistance}`;
  if (callsCache2[callKey] && callsCache2[callKey] <= currentHeatLost) return;
  callsCache2[callKey] = currentHeatLost;

  if (currentPath.has(enterPosition)) return;
  currentPath.add(enterPosition);

  if (enterPosition === goalPosition) {
    if (currentHeatLost < minHeatLoss2) {
      minPath2 = currentPath;
      minHeatLoss2 = currentHeatLost;
      console.log('Arrived part02', minHeatLoss2, walkCalls2.length);
    }
    return;
  }

  // Go Straight
  if (maxWalkDistance) {
    if (enterPosition[direction]) {
      walkCalls2.push([
        enterPosition[direction],
        direction,
        maxWalkDistance - 1,
        currentHeatLost,
        new Set(currentPath),
      ]);
    }
  }

  const [ccw, cw] = directionSides[direction];

  // 90 counter clockwise
  if (enterPosition[ccw]) {
    let currentPosition = enterPosition;
    let heatLoss = currentHeatLost;
    const newPath = new Set(currentPath);

    let processCcw = true;
    for (const _ of Array(3)) {
      currentPosition = currentPosition[ccw];
      if (!currentPosition) {
        processCcw = false;
        break;
      }
      heatLoss += currentPosition.heatLose;
      if (newPath.has(currentPosition)) {
        processCcw = false;
        break;
      }
      newPath.add(currentPosition);
    }

    if (processCcw && currentPosition?.[ccw]) walkCalls2.push([currentPosition[ccw], ccw, 6, heatLoss, newPath]);
  }
  // 90 clockwise
  if (enterPosition[cw]) {
    let currentPosition = enterPosition;
    let heatLoss = currentHeatLost;
    const newPath = new Set(currentPath);

    let processCw = true;
    for (const _ of Array(3)) {
      currentPosition = currentPosition[cw];
      if (!currentPosition) {
        processCw = false;
        break;
      }
      heatLoss += currentPosition.heatLose;
      if (newPath.has(currentPosition)) {
        processCw = false;
        break;
      }
      newPath.add(currentPosition);
    }

    if (processCw && currentPosition?.[cw]) walkCalls2.push([currentPosition[cw], cw, 6, currentHeatLost, newPath]);
  }
}

startPosition.east.heatLose + startPosition.east.east.heatLose + startPosition.east.east.east.heatLose;
walkCalls2.push(
  [
    startPosition.east.east.east.east,
    'east',
    6,
    startPosition.east.heatLose + startPosition.east.east.heatLose + startPosition.east.east.east.heatLose,
    new Set<MapTile>([startPosition, startPosition.east, startPosition.east.east, startPosition.east.east.east]),
  ],
  [
    startPosition.south.south.south.south,
    'south',
    6,
    startPosition.south.heatLose + startPosition.south.south.heatLose + startPosition.south.south.south.heatLose,
    new Set<MapTile>([startPosition, startPosition.south, startPosition.south.south, startPosition.south.south.south]),
  ],
);
while (walkCalls2.length) {
  const [position, direction, maxWalkDistance, heatLoss, currentPath] = walkCalls2.pop();
  walk2(position, direction, maxWalkDistance, heatLoss, currentPath);
}

console.log(generateMap(startPosition, minPath2));

const part02 = Array.from(minPath2).reduce((total, tile) => total + tile.heatLose, 0) - startPosition.heatLose;
process.stdout.write(`Part 02: ${part02}\n`);
