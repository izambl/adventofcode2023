// https://adventofcode.com/2023/day/1
// Day 1: Trebuchet?!

import { readInput } from '../../common/index';

const part01Input = readInput('days/day01/input01', '\n');

function digitToDigit(digit: string): string {
  switch (digit) {
    case 'one':
      return '1';
    case 'two':
      return '2';
    case 'three':
      return '3';
    case 'four':
      return '4';
    case 'five':
      return '5';
    case 'six':
      return '6';
    case 'seven':
      return '7';
    case 'eight':
      return '8';
    case 'nine':
      return '9';
    default:
      return digit;
  }
}

function findMatches(line: string): string[] {
  const targets = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const matches = [];
  for (let i = 0; i < line.length; i++) {
    for (const target of targets) {
      if (line.startsWith(target, i)) {
        matches.push(target);
      }
    }
  }

  return matches;
}

let part01 = 0;
for (const line of part01Input) {
  const lineArray = [...line];
  const firstDigit = lineArray.find((character) => !Number.isNaN(Number(character)));
  const lastDigit = lineArray.reverse().find((character) => !Number.isNaN(Number(character)));

  part01 += Number(`${firstDigit}${lastDigit}`);
}

let part02 = 0;
for (const line of part01Input) {
  const matches = findMatches(line);
  const firstDigit = matches.at(0);
  const lastDigit = matches.at(-1);

  part02 += Number(`${digitToDigit(firstDigit)}${digitToDigit(lastDigit)}`);
}

process.stdout.write(`Part 01: ${part01}\n`);
process.stdout.write(`Part 02: ${part02}\n`);
