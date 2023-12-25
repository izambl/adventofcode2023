// https://adventofcode.com/2023/day/23
// Day 23: A Long Walk

import { max } from 'lodash';
import { readInput } from '../../common/index';

const rawMap = readInput('days/day23/input01', '\n').map((line) => line.split(''));

type Direction = 'north' | 'west' | 'south' | 'east';
type MapTile = {
  [key in Direction]: MapTile | null;
} & { id: string; type: string };

export function createLinkedMap(rawMap: Array<string[]>): [MapTile, MapTile, MapTile] {
  const mapSpotMap: { [xKey: string]: { [yKey: string]: MapTile } } = {};
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

  return [
    mapSpotMap[1][0],
    mapSpotMap[Object.keys(mapSpotMap).length - 2][Object.keys(mapSpotMap[0]).length - 1],
    mapSpotMap[0][0],
  ];
}
function generateMap(
  firstMapTile: MapTile,
  startPosition: MapTile,
  goalPosition: MapTile,
  paintPath: Set<MapTile>,
): string {
  let mapString = '';

  let currentTile = firstMapTile;

  while (currentTile) {
    let columnBlock = currentTile;

    while (columnBlock) {
      mapString +=
        columnBlock === startPosition
          ? paintPath.has(startPosition)
            ? '\x1b[1m\x1b[32mS\x1b[0m'
            : '\x1b[1m\x1b[33mS\x1b[0m'
          : columnBlock === goalPosition
            ? paintPath.has(goalPosition)
              ? '\x1b[1m\x1b[32mG\x1b[0m'
              : '\x1b[1m\x1b[33mG\x1b[0m'
            : paintPath.has(columnBlock)
              ? '\x1b[1m\x1b[32mO\x1b[0m'
              : columnBlock.type;

      columnBlock = columnBlock.east;
    }

    mapString += '\n';
    currentTile = currentTile.south;
  }

  return mapString;
}

const [startPosition, goalPosition, corner] = createLinkedMap(rawMap);

const slopeToDirection: { [key: string]: Direction } = {
  '^': 'north',
  '<': 'west',
  v: 'south',
  '>': 'east',
};

console.log(generateMap(corner, startPosition, goalPosition, new Set()));

function getPossibleDirections(currentPosition: MapTile, currentPath: MapTile[], useSlopes: boolean): Direction[] {
  const allowedDirection: Direction[] = useSlopes
    ? currentPosition.type === '.'
      ? ['north', 'west', 'south', 'east']
      : [slopeToDirection[currentPosition.type]]
    : ['north', 'west', 'south', 'east'];

  return allowedDirection.filter((direction) => {
    return (
      !!currentPosition[direction] &&
      currentPosition[direction].type !== '#' &&
      !currentPath.includes(currentPosition[direction])
    );
  });
}

let maxLength = -Infinity;
function walk(currentPosition: MapTile, goalPosition: MapTile, currentPath: MapTile[], useSlopes = false) {
  // console.log(generateMap(corner, startPosition, goalPosition, new Set(currentPath)));
  currentPath.push(currentPosition);

  if (currentPosition === goalPosition) {
    maxLength = Math.max(maxLength, currentPath.length);
    console.log('ARRIVED', maxLength);

    //console.log(generateMap(corner, startPosition, goalPosition, new Set(currentPath)));
    return;
  }

  let position = currentPosition;
  let possibleDirections = getPossibleDirections(currentPosition, currentPath, useSlopes);
  while (possibleDirections.length === 1) {
    position = position[possibleDirections[0]];
    currentPath.push(position);

    if (position === goalPosition) {
      if (currentPath.length > maxLength) {
        maxLength = currentPath.length;
        console.log('ARRIVED', maxLength);
      }
      return;
    }

    possibleDirections = getPossibleDirections(position, currentPath, useSlopes);
  }

  for (const direction of possibleDirections as Direction[]) {
    walk(position[direction], goalPosition, [...currentPath], useSlopes);
  }
}

walk(startPosition, goalPosition, [], false);

const part01 = maxLength - 1;
process.stdout.write(`Part 01: ${part01}\n`);

const part02 = 2;
process.stdout.write(`Part 02: ${part02}\n`);
