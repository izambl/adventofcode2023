// https://adventofcode.com/2023/day/11
// Day 11: Cosmic Expansion

import { readInput } from '../../common/index';

const rawUniverse: Array<string[]> = readInput('days/day11/input01', '\n').map((row) => row.split(''));
type Space = { isGalaxy: boolean; x: number; y: number };
type Universe = Array<Space[]>;

function cosmicExpansion(universe: Array<string[]>) {
  const columnsToExpand = [];
  const rowsToExpand = [];
  for (let i = 0; i < universe[0].length; i++) {
    if (universe.every((row) => row[i] === '.')) {
      columnsToExpand.push(i);
    }
  }
  for (const [index, row] of universe.entries()) {
    if (row.every((space) => space === '.')) {
      rowsToExpand.push(index);
    }
  }

  const rowLength = universe[0].length;
  for (const [i, rowToExpand] of rowsToExpand.entries()) {
    const newRow = [...Array(rowLength)].map(() => '.');
    universe.splice(rowToExpand + i, 0, newRow);
  }

  for (const [i, columnToExpand] of columnsToExpand.entries()) {
    for (const row of universe) {
      row.splice(columnToExpand + i, 0, '.');
    }
  }

  // console.log(universe.map((line) => line.join('')).join('\n'));
}
function findDistance(from: [number, number], to: [number, number]): number {
  let [xa, ya] = from;
  const [xb, yb] = to;
  let steps = 0;

  while (xa !== xb || ya !== yb) {
    steps++;
    if (Math.abs(xa - xb) >= Math.abs(ya - yb)) {
      xa += xa < xb ? 1 : -1;
    } else {
      ya += ya < yb ? 1 : -1;
    }
  }
  return steps;
}

cosmicExpansion(rawUniverse);

const universe: Universe = [];
const galaxyMap: Space[] = [];
for (const [y, row] of rawUniverse.entries()) {
  for (const [x, space] of row.entries()) {
    if (!universe[y]) universe[y] = [];

    const spaceItem = { isGalaxy: space === '#', x, y };
    universe[y][x] = spaceItem;

    if (spaceItem.isGalaxy) galaxyMap.push(spaceItem);
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

const part01 = totalDistances;
process.stdout.write(`Part 01: ${part01.toString()}\n`);

const part02 = 0;
process.stdout.write(`Part 02: ${part02.toString()}\n`);
