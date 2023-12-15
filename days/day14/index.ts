// https://adventofcode.com/2023/day/14
// Day 14: Parabolic Reflector Dish

import { readInput } from '../../common/index';

const rawTerrain = readInput('days/day14/input01', '\n').map((row) => row.split(''));

type MapSpotType = '#' | 'O' | '.';
type Directions = 'north' | 'west' | 'south' | 'east';
type MapSpot = {
  [key in Directions]: MapSpot | null;
} & { type: MapSpotType };
const opositeDirections: { [key in Directions]: Directions } = {
  north: 'south',
  west: 'east',
  south: 'north',
  east: 'west',
};

const northWall: MapSpot[] = [];
const cubeRocks: MapSpot[] = [];
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
    };

    if (mapSpot.type === '#') cubeRocks.push(mapSpot);

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
    south: null,
    east: null,
  };
  const southWallBlock: MapSpot = {
    type: '#',
    north: null,
    west: null,
    south: null,
    east: null,
  };

  mapSpotMap[x][-1] = northWallBlock;
  mapSpotMap[x][rawTerrain.length] = southWallBlock;

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
    east: null,
  };
  const eastWallBlock: MapSpot = {
    type: '#',
    north: null,
    west: null,
    south: null,
    east: null,
  };

  mapSpotMap[-1][y] = westWallBlock;
  mapSpotMap[rawTerrain[0].length][y] = eastWallBlock;

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

function generateMap(debug = false): string {
  let mapString = '';
  let rowBlock = mapSpotMap[-1][-1];

  while (rowBlock) {
    let columnBlock = rowBlock;

    while (columnBlock) {
      if (debug && columnBlock.west) mapString += '<';

      if (debug) {
        if (columnBlock.north && columnBlock.south) {
          mapString += '↕';
        } else if (columnBlock.north) {
          mapString += '↑';
        } else if (columnBlock.south) {
          mapString += '↓';
        } else {
          mapString += '*';
        }
      } else {
        mapString += columnBlock.type;
      }

      if (debug && columnBlock.east) mapString += '>';

      columnBlock = columnBlock.east;
    }

    mapString += '\n';
    rowBlock = rowBlock.south;
  }

  return mapString;
}

function switchPositions(a: MapSpot, b: MapSpot) {
  const aType = a.type;
  const bType = b.type;

  a.type = bType;
  b.type = aType;
}

function tiltMap(tiltDirection: Directions) {
  const pullTilesFrom = opositeDirections[tiltDirection];

  for (const cubeRock of cubeRocks) {
    const openSpaces: MapSpot[] = [];
    let currentPosition = cubeRock[pullTilesFrom];

    while (currentPosition && currentPosition.type !== '#') {
      if (currentPosition.type === '.') openSpaces.push(currentPosition);

      if (currentPosition.type === 'O' && openSpaces.length) {
        const opensSpace = openSpaces.shift();

        switchPositions(currentPosition, opensSpace);

        continue;
      }

      currentPosition = currentPosition[pullTilesFrom];
    }
  }
}

function countPressureOnTheNorthWall(): number {
  let rowBlock = mapSpotMap[-1][-1];
  let total = 0;
  let row = rawTerrain.length + 1;

  while (rowBlock) {
    let columnBlock = rowBlock;

    while (columnBlock) {
      if (columnBlock.type === 'O') {
        total += row;
      }
      columnBlock = columnBlock.east;
    }

    row -= 1;
    rowBlock = rowBlock.south;
  }

  return total;
}

console.log(generateMap());

let count = 0;
const mapsCache: { [key: string]: number } = {};

let part01 = 0;
let countCycle = 0;
const cycleValues = [];
while (count++ < 1000) {
  tiltMap('north');
  if (!part01) {
    part01 = countPressureOnTheNorthWall();
  }
  tiltMap('west');
  tiltMap('south');
  tiltMap('east');
  const map = generateMap();
  if (!mapsCache[map]) {
    mapsCache[map] = 1;
  } else {
    mapsCache[map]++;
  }

  if (mapsCache[map] === 2) {
    countCycle++;
    cycleValues.push(countPressureOnTheNorthWall());
  }
  if (mapsCache[map] === 3) {
    break;
  }
}

console.log(generateMap());

process.stdout.write(`Part 01: ${part01}\n`);

const part02 = cycleValues[(1_000_000_000 - count) % cycleValues.length];
process.stdout.write(`Part 02: ${part02}\n`);
