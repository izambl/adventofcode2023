// https://adventofcode.com/2023/day/12
// Day 12: Hot Springs

import { cloneDeep, find } from 'lodash';
import { flipArray, readInput } from '../../common/index';

type Terrain = Array<string[]>;

const terrains: Terrain[] = readInput('days/day13/input01', '\n\n').map((terrain) =>
  terrain.split('\n').map((row) => row.split('')),
);

function findMirrorVertex(terrain: Terrain, skipMiddle: number | null = null): number | null {
  const terrainStrings = terrain.map((terrainElements) => terrainElements.join(''));

  for (let middle = 1; middle < terrain.length; middle++) {
    if (skipMiddle && skipMiddle === middle) continue;
    let goodPair = true;
    // console.log('MIDDLE', middle);

    for (let i = 0; i < middle; i++) {
      const [a, b] = [middle - 1 - i, middle + i];
      if (b === terrainStrings.length) break;

      // console.log(a, b, terrainStrings[a], terrainStrings[b], terrainStrings[a] === terrainStrings[b]);
      if (terrainStrings[a] !== terrainStrings[b]) {
        goodPair = false;
        break;
      }
    }

    if (goodPair) return middle;
  }

  return null;
}

let part01 = 0;
for (const terrain of terrains) {
  const vertical = findMirrorVertex(terrain);

  if (vertical) {
    part01 += vertical * 100;
  } else {
    const horizontal = findMirrorVertex(flipArray(terrain));
    if (horizontal) {
      part01 += horizontal;
    } else {
      console.log('NOT FOUND');
      console.log(terrain.map((terrainElements) => terrainElements.join('')).join('\n'));
    }
  }
}

process.stdout.write(`Part 01: ${part01}\n`);

function hasSmudge(stringA: string[], stringB: string[]): boolean {
  let differences = 0;

  for (let i = 0; i < stringA.length; i++) {
    if (stringA[i] !== stringB[i]) {
      differences += 1;
    }
  }

  if (differences > 1) return false;
  return true;
}

function findSmudges(terrain: Terrain): Terrain[] {
  const smudgedTerrains: Terrain[] = [];
  const terrainStrings = terrain.map((terrainElements) => terrainElements.join(''));

  for (let middle = 1; middle < terrain.length; middle++) {
    for (let i = 0; i < middle; i++) {
      const [a, b] = [middle - 1 - i, middle + i];
      if (b === terrainStrings.length) break;

      if (terrainStrings[a] !== terrainStrings[b]) {
        if (hasSmudge(terrain[a], terrain[b])) {
          const smudgedTerrain = cloneDeep(terrain);

          smudgedTerrain[a] = terrainStrings[b].split('');

          // console.log('SMUDGE LINE', a, b);

          smudgedTerrains.push(smudgedTerrain);
        }
      }
    }
  }

  return smudgedTerrains;
}

function smudgidize(terrain: Terrain): number {
  const originalHorizontalMirrorVertex = findMirrorVertex(terrain);
  const horizontalSmudgedTerrains = findSmudges(terrain);
  const originalVerticalMirrorVertex = findMirrorVertex(flipArray(terrain));
  const verticalSmudgedTerrains = findSmudges(flipArray(terrain));
  const resultsH: number[] = [];
  const resultsV: number[] = [];

  for (const horizontalSmudgedTerrain of horizontalSmudgedTerrains) {
    const result = findMirrorVertex(horizontalSmudgedTerrain, originalHorizontalMirrorVertex);
    if (result) resultsH.push(result);
  }
  for (const verticalSmudgedTerrain of verticalSmudgedTerrains) {
    const result = findMirrorVertex(verticalSmudgedTerrain, originalVerticalMirrorVertex);
    if (result) resultsV.push(result);
  }

  // console.log(resultsH, resultsV);
  // console.log(horizontalSmudgedTerrains[1].map((t) => t.join('')).join('\n'));

  if (resultsH.length) return resultsH[0] * 100;
  return resultsV[0];
}

const part02 = terrains.reduce((total, terrain) => smudgidize(terrain) + total, 0);
process.stdout.write(`Part 02: ${part02}\n`);
