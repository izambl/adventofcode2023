// https://adventofcode.com/2023/day/10
// Day 10: Pipe Maze

import { readInput } from '../../common/index';

const input = readInput('days/day10/input01', '\n').map((row) => row.split('')) as Array<TileType[]>;

const pipeDescriptions: {
  [key in TileType]: { north: boolean; south: boolean; west: boolean; east: boolean; ascii: string };
} = {
  '|': { north: true, south: true, west: false, east: false, ascii: '│' },
  '-': { north: false, south: false, west: true, east: true, ascii: '─' },
  L: { north: true, south: false, west: false, east: true, ascii: '└' },
  J: { north: true, south: false, west: true, east: false, ascii: '┘' },
  '7': { north: false, south: true, west: true, east: false, ascii: '┐' },
  F: { north: false, south: true, west: false, east: true, ascii: '┌' },
  '.': { north: false, south: false, west: false, east: false, ascii: ' ' },
  S: { north: true, south: true, west: true, east: true, ascii: '▓' },
};

type TileType = '|' | '-' | 'L' | 'J' | '7' | 'F' | '.' | 'S';
type Tile = {
  north?: Tile;
  south?: Tile;
  west?: Tile;
  east?: Tile;
  type: TileType;
  partOfPipe: boolean;
  isInside: boolean;
};
type Map = { [key: string]: Tile };

const map: Map = {};
let startPosition: Tile = null;

// Create Map
for (const [y, row] of input.entries()) {
  for (const [x, tileDescription] of row.entries()) {
    const coordinate = `${String(x).padStart(3, '0')}:${String(y).padStart(3, '0')}`;

    const tile: Tile = {
      type: tileDescription,
      partOfPipe: false,
      isInside: false,
    };

    map[coordinate] = tile;
  }
}

// Fill Map
for (const mapTileKey of Object.keys(map)) {
  const mapTile = map[mapTileKey];
  const [mapX, mapY] = mapTileKey.split(':').map(Number);

  if (mapTile.type === 'S') {
    startPosition = mapTile;
    startPosition.partOfPipe = true;
  }

  if (pipeDescriptions[mapTile.type].north) {
    const mapPosition = map[`${String(mapX).padStart(3, '0')}:${String(mapY - 1).padStart(3, '0')}`];
    if (mapPosition && mapPosition.type !== '.') mapTile.north = mapPosition;
  }
  if (pipeDescriptions[mapTile.type].south) {
    const mapPosition = map[`${String(mapX).padStart(3, '0')}:${String(mapY + 1).padStart(3, '0')}`];
    if (mapPosition && mapPosition.type !== '.') mapTile.south = mapPosition;
  }
  if (pipeDescriptions[mapTile.type].west) {
    const mapPosition = map[`${String(mapX - 1).padStart(3, '0')}:${String(mapY).padStart(3, '0')}`];
    if (mapPosition && mapPosition.type !== '.') mapTile.west = mapPosition;
  }
  if (pipeDescriptions[mapTile.type].east) {
    const mapPosition = map[`${String(mapX + 1).padStart(3, '0')}:${String(mapY).padStart(3, '0')}`];
    if (mapPosition && mapPosition.type !== '.') mapTile.east = mapPosition;
  }
}

// Infer Start Type
if (startPosition.north?.south === startPosition) {
  if (startPosition.south?.north === startPosition) {
    startPosition.type = '|';
    delete startPosition.west;
    delete startPosition.east;
  }
  if (startPosition.west?.east === startPosition) {
    startPosition.type = 'J';
    delete startPosition.south;
    delete startPosition.east;
  }
  if (startPosition.east?.west === startPosition) {
    startPosition.type = 'L';
    delete startPosition.west;
    delete startPosition.south;
  }
} else if (startPosition.south?.north === startPosition) {
  if (startPosition.west?.east === startPosition) {
    startPosition.type = '7';
    delete startPosition.north;
    delete startPosition.east;
  }
  if (startPosition.east?.west === startPosition) {
    startPosition.type = 'F';
    delete startPosition.north;
    delete startPosition.west;
  }
} else if (startPosition.west?.east === startPosition) {
  if (startPosition.east?.west === startPosition) {
    startPosition.type = '-';
    delete startPosition.north;
    delete startPosition.south;
  }
}

let steps = 1;
let runner01: Tile;
const runnerVisits: Set<Tile> = new Set([startPosition]);

[runner01] = [startPosition.north, startPosition.south, startPosition.west, startPosition.east].filter(
  (direction) => !!direction,
);

// Walk all the pipe
while (runner01) {
  runnerVisits.add(runner01);
  runner01.partOfPipe = true;

  runner01 = [runner01.north, runner01.south, runner01.west, runner01.east].filter(
    (direction) => !!direction && !runnerVisits.has(direction),
  )[0];

  steps++;
}

const newMap: Array<Tile[]> = [];

let enclosedTiles = 0;
for (const mapTileKey of Object.keys(map)) {
  const mapTile = map[mapTileKey];
  const [mapX, mapY] = mapTileKey.split(':').map(Number);

  if (!newMap[mapY]) newMap[mapY] = [];
  newMap[mapY][mapX] = mapTile;
}

for (const row of newMap) {
  let isInside = false;
  let isUp = false;

  for (const tile of row) {
    const type = tile.partOfPipe ? tile.type : '.';

    if (type === '|') {
      isInside = !isInside;
    } else if (type === 'L' || type === 'F') {
      isUp = type === 'L';
    } else if (type === '7' || type === 'J') {
      if (isUp && type !== 'J') isInside = !isInside;
      if (!isUp && type !== '7') isInside = !isInside;

      isUp = false;
    }

    if (tile.partOfPipe) continue;

    if (isInside) {
      enclosedTiles++;
      tile.isInside = isInside;
    }
  }
}

console.log(
  newMap
    .map((line) =>
      line
        .map((tile) => {
          if (tile.isInside) return '*';
          return tile.partOfPipe ? pipeDescriptions[tile.type].ascii : ' ';
        })
        .join(''),
    )
    .join(' \n'),
);

const part01 = steps / 2;
process.stdout.write(`Part 01: ${part01.toString()}\n`);

const part02 = enclosedTiles;
process.stdout.write(`Part 02: ${part02.toString()}\n`);
