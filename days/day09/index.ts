// https://adventofcode.com/2023/day/9
// Day 9: Mirage Maintenance

import { readInput } from '../../common/index';

const input = readInput('days/day09/input01', '\n').map((line) => line.split(' ').map(Number));

function readNextValue(sequence: number[]): number {
  const newSequence = [];
  const difference = 0;

  for (let i = 1; i < sequence.length; i++) {
    const difference = sequence[i] - sequence[i - 1];
    newSequence.push(difference);
  }

  if (newSequence.every((number) => number === 0)) {
    return sequence.at(-1) + difference;
  }

  return sequence.at(-1) + readNextValue(newSequence);
}

function readPreviousValue(sequence: number[]): number {
  const newSequence = [];
  const difference = 0;

  for (let i = 1; i < sequence.length; i++) {
    const difference = sequence[i] - sequence[i - 1];
    newSequence.push(difference);
  }

  if (newSequence.every((number) => number === 0)) {
    return sequence.at(0) - difference;
  }

  return sequence.at(0) - readPreviousValue(newSequence);
}

const part01 = input.map(readNextValue).reduce((total, nextValue) => total + nextValue, 0);
process.stdout.write(`Part 01: ${part01}\n`);

const part02 = input.map(readPreviousValue).reduce((total, nextValue) => total + nextValue, 0);
process.stdout.write(`Part 02: ${part02.toString()}\n`);
