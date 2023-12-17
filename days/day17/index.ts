// https://adventofcode.com/2023/day/17
// Day 17: Clumsy Crucible

import { readInput } from '../../common/index';

const input = readInput('days/day17/inputDemo', '\n').map((row) => row.split(''));

type Direction = 'north' | 'west' | 'south' | 'east';
type MapTile = {
  [key in Direction]: MapTile | null;
} & { heatLose: number; id: string };

const directionSides: { [key in Direction]: [Direction, Direction] } = {
  north: ['east', 'west'],
  south: ['east', 'west'],
  east: ['south', 'north'],
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
function generateMap(firstMapTile: MapTile, debug = false): string {
  let mapString = '';

  let currentTile = firstMapTile;

  while (currentTile) {
    let columnBlock = currentTile;

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
        mapString += columnBlock.heatLose;
      }

      if (debug && columnBlock.east) mapString += '>';

      columnBlock = columnBlock.east;
    }

    mapString += '\n';
    currentTile = currentTile.south;
  }

  return mapString;
}

const [startPosition, goalPosition] = createLinkedMap(input);

console.log(generateMap(startPosition));

const visitedMap: { [key: string]: { [key in Direction]?: number } } = {};
let count = 0;
function walk(startPosition: MapTile, direction: Direction, heatLost: number) {
  console.log(++count);
  if (!visitedMap[startPosition.id]) visitedMap[startPosition.id] = {};
  visitedMap[startPosition.id][direction] = heatLost;

  if (startPosition === goalPosition) {
    count--;
    return;
  }

  let currentTile = startPosition;
  let currentHeatLost = heatLost;

  let walkingDistance = 3;
  while (walkingDistance--) {
    if (!currentTile[direction]) break;

    currentTile = currentTile[direction];
    currentHeatLost += currentTile.heatLose;

    if (visitedMap[currentTile.id]?.[direction] && visitedMap[currentTile.id][direction] <= currentHeatLost) continue;

    for (const dir of directionSides[direction]) {
      //if (visitedMap[currentTile.id]?.[dir] && visitedMap[currentTile.id][dir] <= currentHeatLost) continue;
      walk(currentTile, dir, currentHeatLost);
    }
  }
  count--;
}

walk(startPosition, 'east', 0);

const part01 = Math.min(...Object.values(visitedMap[goalPosition.id]));
process.stdout.write(`Part 02: ${part01}\n`);

const part02 = 0;
process.stdout.write(`Part 02: ${part02}\n`);
