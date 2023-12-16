// https://adventofcode.com/2023/day/16
// Day 16: The Floor Will Be Lava

import { readInput } from '../../common/index';

const rawTerrain = readInput('days/day16/input01', '\n').map((row) => row.split(''));

type MapTileType = '|' | '-' | '\\' | '/' | '.';
type Direction = 'north' | 'west' | 'south' | 'east';
type MapTile = {
  [key in Direction]: MapTile | null;
} & { type: MapTileType; id: string };

function createLinkedMap(rawMap: Array<string[]>): MapTile {
  const mapSpotMap: { [xKey: string]: { [yKey: string]: MapTile } } = {};
  let id = 0;

  for (const [y, row] of rawMap.entries()) {
    for (const [x, tile] of row.entries()) {
      const mapSpot: MapTile = {
        type: tile as MapTileType,
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

  return mapSpotMap[0][0];
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
        mapString += columnBlock.type;
      }

      if (debug && columnBlock.east) mapString += '>';

      columnBlock = columnBlock.east;
    }

    mapString += '\n';
    currentTile = currentTile.south;
  }

  return mapString;
}

const firstTile = createLinkedMap(rawTerrain);

function getEnergizedTiles(tile: MapTile, direction: Direction): number {
  const beams: Set<{ tile: MapTile; direction: Direction }> = new Set([{ tile, direction }]);
  const tilesVisitedCache: { [key: string]: { [key in Direction]?: true } } = {};
  while (beams.size) {
    for (const beam of beams) {
      if (!tilesVisitedCache[beam.tile.id]) tilesVisitedCache[beam.tile.id] = {};
      tilesVisitedCache[beam.tile.id][beam.direction] = true;

      switch (beam.tile.type) {
        case '-':
          if (beam.direction !== 'east' && beam.direction !== 'west') {
            beam.direction = 'west';
            beams.add({ tile: beam.tile, direction: 'east' });
          }
          break;
        case '|':
          if (beam.direction !== 'north' && beam.direction !== 'south') {
            beam.direction = 'north';
            beams.add({ tile: beam.tile, direction: 'south' });
          }
          break;
        case '/':
          if (beam.direction === 'west') beam.direction = 'south';
          else if (beam.direction === 'east') beam.direction = 'north';
          else if (beam.direction === 'north') beam.direction = 'east';
          else if (beam.direction === 'south') beam.direction = 'west';
          break;
        case '\\':
          if (beam.direction === 'west') beam.direction = 'north';
          else if (beam.direction === 'east') beam.direction = 'south';
          else if (beam.direction === 'north') beam.direction = 'west';
          else if (beam.direction === 'south') beam.direction = 'east';
          break;
      }

      beam.tile = beam.tile[beam.direction];

      if (!beam.tile || tilesVisitedCache[beam.tile.id]?.[beam.direction]) {
        beams.delete(beam);
      }
    }
  }

  return Object.keys(tilesVisitedCache).length;
}

console.log(generateMap(firstTile));

const part01 = getEnergizedTiles(firstTile, 'east');
process.stdout.write(`Part 01: ${part01}\n`);

function getEdgesAndDirections(firstTile: MapTile): Array<[MapTile, Direction]> {
  const edgesAndDirections: Array<[MapTile, Direction]> = [];
  let currentTile = firstTile;

  while (currentTile) {
    let columnBlock = currentTile;

    while (columnBlock) {
      if (!columnBlock.north && !columnBlock.west) {
        edgesAndDirections.push([columnBlock, 'south']);
        edgesAndDirections.push([columnBlock, 'east']);
      } else if (!columnBlock.north && !columnBlock.east) {
        edgesAndDirections.push([columnBlock, 'south']);
        edgesAndDirections.push([columnBlock, 'west']);
      } else if (!columnBlock.south && !columnBlock.east) {
        edgesAndDirections.push([columnBlock, 'north']);
        edgesAndDirections.push([columnBlock, 'west']);
      } else if (!columnBlock.west && !columnBlock.south) {
        edgesAndDirections.push([columnBlock, 'north']);
        edgesAndDirections.push([columnBlock, 'east']);
      } else if (!columnBlock.north) {
        edgesAndDirections.push([columnBlock, 'south']);
      } else if (!columnBlock.west) {
        edgesAndDirections.push([columnBlock, 'east']);
      } else if (!columnBlock.south) {
        edgesAndDirections.push([columnBlock, 'north']);
      } else if (!columnBlock.east) {
        edgesAndDirections.push([columnBlock, 'west']);
      }

      columnBlock = columnBlock.east;
    }

    currentTile = currentTile.south;
  }

  return edgesAndDirections;
}

const possibleEnergizedTiles = getEdgesAndDirections(firstTile).map(([edgeTile, direction]) =>
  getEnergizedTiles(edgeTile, direction),
);

const part02 = Math.max(...possibleEnergizedTiles);
process.stdout.write(`Part 02: ${part02}\n`);
