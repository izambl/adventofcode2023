// https://adventofcode.com/2023/day/21
// Day 21: Step Counter

import { readInput } from '../../common/index';

const rawGarden = readInput('days/day21/input01', '\n').map((line) => line.split(''));

type Direction = 'north' | 'west' | 'south' | 'east';
type MapTile = {
  [key in Direction]: MapTile | null;
} & { id: string; type: string };

export function createLinkedMap(rawMap: Array<string[]>): [MapTile, MapTile] {
  const mapSpotMap: { [xKey: string]: { [yKey: string]: MapTile } } = {};
  let startPosition: MapTile;
  let id = 0;

  for (const [y, row] of rawMap.entries()) {
    for (const [x, tile] of row.entries()) {
      const mapSpot: MapTile = {
        north: null,
        west: null,
        south: null,
        east: null,
        type: tile,
        id: String(++id),
      };

      if (tile === 'S') {
        startPosition = mapSpot;
        startPosition.type = '.';
      }

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

  return [startPosition, mapSpotMap[0][0]];
}
function generateMap(firstMapTile: MapTile, startPosition: MapTile, paintPath: Set<MapTile>): string {
  let mapString = '';

  let currentTile = firstMapTile;

  while (currentTile) {
    let columnBlock = currentTile;

    while (columnBlock) {
      mapString +=
        columnBlock === startPosition
          ? '\x1b[1m\x1b[33mS\x1b[0m'
          : paintPath.has(columnBlock)
            ? '\x1b[1m\x1b[33mO\x1b[0m'
            : columnBlock.type;

      columnBlock = columnBlock.east;
    }

    mapString += '\n';
    currentTile = currentTile.south;
  }

  return mapString;
}

const [startPosition, corner] = createLinkedMap(rawGarden);

function walk(
  startPosition: MapTile,
  maxSteps: number,
  stepNumber: number,
  visitedTiles: Map<MapTile, true>,
  tilesCache: { [index: string]: true },
): Map<MapTile, true> {
  if (stepNumber > maxSteps) return;

  const walkKey = `${startPosition.id}:${stepNumber}`;
  if (tilesCache[walkKey]) return;

  tilesCache[walkKey] = true;

  if (stepNumber === maxSteps) {
    visitedTiles.set(startPosition, true);
  }

  for (const direction of ['north', 'west', 'south', 'east'] as Direction[]) {
    if (startPosition[direction]?.type === '.') {
      walk(startPosition[direction], maxSteps, stepNumber + 1, visitedTiles, tilesCache);
    }
  }

  return visitedTiles;
}

const visitedTiles = walk(startPosition, 64, 0, new Map<MapTile, true>(), {});

console.log(generateMap(corner, startPosition, new Set(visitedTiles.keys())));

const part01 = visitedTiles.size;
process.stdout.write(`Part 01: ${part01}\n`);

const part02 = 2;
process.stdout.write(`Part 02: ${part02}\n`);
