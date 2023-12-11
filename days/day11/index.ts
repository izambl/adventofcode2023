// https://adventofcode.com/2023/day/11
// Day 11: Cosmic Expansion

import { readInput } from '../../common/index';

const rawUniverse: Array<string[]> = readInput('days/day11/input01', '\n').map((row) => row.split(''));
type Space = { isGalaxy: boolean; x: number; y: number };
type Universe = Array<Space[]>;

function findDistance(from: [number, number], to: [number, number]): number {
  const [xa, ya] = from;
  const [xb, yb] = to;

  return Math.abs(xa - xb) + Math.abs(ya - yb);
}
function findDistances(universe: Universe): number {
  const galaxyMap: Space[] = [];
  for (const row of universe) {
    for (const space of row) {
      if (space.isGalaxy) galaxyMap.push(space);
    }
  }

  const distancesFound: Set<string> = new Set();
  let totalDistances = 0;
  for (const [indexFrom, galaxyFrom] of galaxyMap.entries()) {
    for (const [indexTo, galaxyTo] of galaxyMap.entries()) {
      if (galaxyFrom === galaxyTo) continue;
      const distanceKey = [indexFrom, indexTo].sort().join(':');
      if (distancesFound.has(distanceKey)) continue;

      const distance = findDistance([galaxyFrom.x, galaxyFrom.y], [galaxyTo.x, galaxyTo.y]);
      distancesFound.add(distanceKey);
      totalDistances += distance;
    }
  }

  return totalDistances;
}
function cosmicExpansion(universe: Universe, pow = 2): Universe {
  const columnsToExpand = [];
  const rowsToExpand = [];
  const expandedUniverse = JSON.parse(JSON.stringify(universe));

  for (let i = 0; i < universe[0].length; i++) {
    if (universe.every((row) => !row[i].isGalaxy)) {
      columnsToExpand.push(i);
    }
  }
  for (const [index, row] of universe.entries()) {
    if (row.every((space) => !space.isGalaxy)) {
      rowsToExpand.push(index);
    }
  }

  for (const rowToExpand of rowsToExpand) {
    for (let i = rowToExpand; i < universe.length; i++) {
      for (const space of universe[i]) {
        if (!space.isGalaxy) continue;
        space.y += pow;
      }
    }
  }

  for (const columnToExpand of columnsToExpand) {
    for (const row of universe) {
      for (let i = columnToExpand; i < row.length; i++) {
        const space = row[i];
        if (!space.isGalaxy) continue;
        space.x += pow;
      }
    }
  }

  return universe;
}

const universe: Universe = [];
for (const [y, row] of rawUniverse.entries()) {
  for (const [x, space] of row.entries()) {
    if (!universe[y]) universe[y] = [];

    const spaceItem = { isGalaxy: space === '#', x, y };
    universe[y][x] = spaceItem;
  }
}

const part01Universe = cosmicExpansion(universe, 2 - 1);
const part01 = findDistances(part01Universe);
process.stdout.write(`Part 01: ${part01.toString()}\n`);

const part02Universe = cosmicExpansion(universe, 1000000 - 2);
const part02 = findDistances(part02Universe);
process.stdout.write(`Part 02: ${part02.toString()}\n`);
