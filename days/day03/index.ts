// https://adventofcode.com/2023/day/1
// Day 3: Gear Ratios

import { readInput } from '../../common/index';

const schema = readInput('days/day03/input01', '\n');

type Num = [number, string];

const numbersPositions: Num[] = [];
const positionsOfSymbols: { [index: string]: string } = {};
const positionsOfNumbers: { [index: string]: Num } = {};
const gearPositions: string[] = [];
const gearAdjacents: Array<Set<Num>> = [];

for (let y = 0; y < schema.length; y++) {
  const line = schema[y];

  const numbersMatches = line.matchAll(/(\d+)/g);
  const symbolsMatches = line.matchAll(/[^\d\.]/g);

  for (const numberMatch of numbersMatches) {
    const num: Num = [Number(numberMatch[0]), `${numberMatch.index}:${y}`];
    numbersPositions.push(num);

    for (let index = numberMatch.index; index < numberMatch.index + String(numberMatch[0]).length; index++) {
      positionsOfNumbers[`${index}:${y}`] = num;
    }
  }
  for (const symbolMatch of symbolsMatches) {
    positionsOfSymbols[`${symbolMatch.index}:${y}`] = symbolMatch[0];
    if (symbolMatch[0] === '*') {
      gearPositions.push(`${symbolMatch.index}:${y}`);
    }
  }
}

const part01 = numbersPositions.reduce((total, numberPosition) => {
  const [number, position] = numberPosition;
  const [x, y] = position.split(':').map(Number);

  const startY = y - 1;
  const startX = x - 1;
  const endY = y + 1;
  const endX = x + String(number).length;

  for (let xx = startX; xx <= endX; xx++) {
    for (let yy = startY; yy <= endY; yy++) {
      const position = `${xx}:${yy}`;
      if (positionsOfSymbols[position]) return total + number;
    }
  }

  return total;
}, 0);

for (const gearPosition of gearPositions) {
  const adjacents = new Set<Num>();
  const [x, y] = gearPosition.split(':').map(Number);

  if (positionsOfNumbers[`${x - 1}:${y - 1}`]) adjacents.add(positionsOfNumbers[`${x - 1}:${y - 1}`]);
  if (positionsOfNumbers[`${x - 1}:${y}`]) adjacents.add(positionsOfNumbers[`${x - 1}:${y}`]);
  if (positionsOfNumbers[`${x - 1}:${y + 1}`]) adjacents.add(positionsOfNumbers[`${x - 1}:${y + 1}`]);
  if (positionsOfNumbers[`${x}:${y - 1}`]) adjacents.add(positionsOfNumbers[`${x}:${y - 1}`]);
  if (positionsOfNumbers[`${x}:${y + 1}`]) adjacents.add(positionsOfNumbers[`${x}:${y + 1}`]);
  if (positionsOfNumbers[`${x + 1}:${y - 1}`]) adjacents.add(positionsOfNumbers[`${x + 1}:${y - 1}`]);
  if (positionsOfNumbers[`${x + 1}:${y}`]) adjacents.add(positionsOfNumbers[`${x + 1}:${y}`]);
  if (positionsOfNumbers[`${x + 1}:${y + 1}`]) adjacents.add(positionsOfNumbers[`${x + 1}:${y + 1}`]);

  gearAdjacents.push(adjacents);
}

const part02 = gearAdjacents.reduce((total, adjacents) => {
  if (adjacents.size !== 2) return total;

  const [[number1], [number2]] = Array.from(adjacents);

  return total + number1 * number2;
}, 0);

process.stdout.write(`Part 01: ${part01}\n`);
process.stdout.write(`Part 02: ${part02}\n`);
