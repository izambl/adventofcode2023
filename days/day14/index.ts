// https://adventofcode.com/2023/day/14
// Day 14: Parabolic Reflector Dish

import { readInput } from '../../common/index';

const rawTerrain = readInput('days/day14/input01', '\n').map((row) => row.split(''));

type MapSpotType = '#' | 'O' | '.';
type Directions = 'north' | 'west' | 'south' | 'east';
type MapSpot = {
  [key in Directions]: MapSpot | null;
} & { type: MapSpotType; x: number; y: number };
const opositeDirections: { [key in Directions]: Directions } = {
  north: 'south',
  west: 'east',
  south: 'north',
  east: 'west',
};

const northWall: MapSpot[] = [];
const cubeRocks: MapSpot[] = [];
const roundRocks: MapSpot[] = [];
const mapSpotMap: { [xKey: string]: { [yKey: string]: MapSpot } } = {};

// Build map - phase 1, create map spots
for (const [y, row] of rawTerrain.entries()) {
  for (const [x, tile] of row.entries()) {
    const mapSpot: MapSpot = {
      type: tile as MapSpotType,
      north: null,
      west: null,
      south: null,
      east: null,
      x,
      y,
    };

    if (mapSpot.type === '#') cubeRocks.push(mapSpot);
    if (mapSpot.type === 'O') roundRocks.push(mapSpot);

    if (!mapSpotMap[x]) mapSpotMap[x] = {};

    mapSpotMap[x][y] = mapSpot;
  }
}

// Build map - phase 2, surround with a wall
mapSpotMap[-1] = {};
mapSpotMap[rawTerrain[0].length] = {};
for (let x = 0; x < rawTerrain[0].length; x++) {
  const northWallBlock: MapSpot = {
    type: '#',
    north: null,
    west: null,
    south: mapSpotMap[x][0],
    east: null,
    x: x,
    y: -1,
  };
  const southWallBlock: MapSpot = {
    type: '#',
    north: mapSpotMap[x][rawTerrain.length - 1],
    west: null,
    south: null,
    east: null,
    x: x,
    y: rawTerrain.length,
  };

  mapSpotMap[x][-1] = northWallBlock;
  mapSpotMap[x][rawTerrain.length] = southWallBlock;

  mapSpotMap[x][0].north = northWallBlock;
  mapSpotMap[x][rawTerrain.length - 1].south = southWallBlock;

  cubeRocks.push(northWallBlock);
  cubeRocks.push(southWallBlock);

  northWall.push(northWallBlock);
}
for (let y = -1; y <= rawTerrain.length; y++) {
  const westWallBlock: MapSpot = {
    type: '#',
    north: null,
    west: null,
    south: null,
    east: mapSpotMap[0][y],
    x: -1,
    y: y,
  };
  const eastWallBlock: MapSpot = {
    type: '#',
    north: null,
    west: mapSpotMap[0][rawTerrain.length - 1],
    south: null,
    east: null,
    x: rawTerrain[0].length,
    y: y,
  };

  mapSpotMap[-1][y] = westWallBlock;
  mapSpotMap[rawTerrain[0].length][y] = eastWallBlock;

  mapSpotMap[0][y].west = westWallBlock;
  mapSpotMap[rawTerrain.length - 1][y].east = eastWallBlock;

  cubeRocks.push(westWallBlock);
  cubeRocks.push(eastWallBlock);
}

// Build map - phase 3, link all the tiles
for (let x = -1; x <= rawTerrain[0].length; x++) {
  for (let y = -1; y <= rawTerrain.length; y++) {
    const mapSpot = mapSpotMap[x][y];

    mapSpot.north = mapSpotMap[x]?.[y - 1] || null;
    mapSpot.west = mapSpotMap[x - 1]?.[y] || null;
    mapSpot.south = mapSpotMap[x]?.[y + 1] || null;
    mapSpot.east = mapSpotMap[x + 1]?.[y] || null;
  }
}

function printMap(firstBlock: MapSpot) {
  let mapString = '';
  let rowBlock = firstBlock;

  while (rowBlock) {
    let columnBlock = rowBlock;

    while (columnBlock) {
      mapString += columnBlock.type;
      columnBlock = columnBlock.east;
    }

    mapString += '\n';
    rowBlock = rowBlock.south;
  }

  console.log(mapString);
}

function switchPositions(a: MapSpot, b: MapSpot) {
  const aNorth = a.north;
  const aWest = a.west;
  const aSouth = a.south;
  const aEast = a.east;
  const bNorth = b.north;
  const bWest = b.west;
  const bSouth = b.south;
  const bEast = b.east;
  const aX = a.x;
  const aY = a.y;
  const bX = b.x;
  const bY = b.y;

  a.north = bNorth;
  bNorth.south = a;
  a.west = bWest;
  bWest.east = a;
  a.south = bSouth;
  bSouth.north = a;
  a.east = bEast;
  bEast.west = a;

  b.north = aNorth;
  aNorth.south = b;
  b.west = aWest;
  aWest.east = b;
  b.south = aSouth;
  aSouth.north = b;
  b.east = aEast;
  aEast.west = b;

  a.x = bX;
  a.y = bY;
  b.x = aX;
  b.y = aY;
}

function tiltMap(north: Directions) {
  const south = opositeDirections[north];

  for (const cubeRock of cubeRocks) {
    const openSpaces: MapSpot[] = [];
    let currentPosition = cubeRock[south];

    while (currentPosition && currentPosition.type !== '#') {
      if (currentPosition.type === '.') openSpaces.push(currentPosition);

      if (currentPosition.type === 'O' && openSpaces.length) {
        const opensSpace = openSpaces.shift();
        switchPositions(currentPosition, opensSpace);

        currentPosition = opensSpace;
        continue;
      }

      currentPosition = currentPosition[south];
    }
  }
}

printMap(northWall[0].west);
tiltMap('north');
printMap(northWall[0].west);

const part01 = roundRocks.reduce((total, rock) => total + (rawTerrain.length - rock.y), 0);
process.stdout.write(`Part 01: ${part01}\n`);

const part02 = 0;
process.stdout.write(`Part 02: ${part02}\n`);
