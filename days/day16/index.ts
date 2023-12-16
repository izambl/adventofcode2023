// https://adventofcode.com/2023/day/16
// Day 16: The Floor Will Be Lava

import { Dir } from 'fs';
import { readInput } from '../../common/index';

const rawTerrain = readInput('days/day16/input01', '\n').map((row) => row.split(''));

type MapTileType = '|' | '-' | '\\' | '/' | '.';
type Directions = 'north' | 'west' | 'south' | 'east';
type MapTile = {
  [key in Directions]: MapTile | null;
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

function getEnergizedTiles(tile: MapTile, direction: Directions): number {
  const beams: Set<{ tile: MapTile; direction: Directions }> = new Set([{ tile, direction }]);
  const tilesVisitedCache: { [key: string]: { [key in Directions]?: true } } = {};
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

const part02 = 2;
process.stdout.write(`Part 02: ${part02}\n`);
