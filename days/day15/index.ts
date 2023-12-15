// https://adventofcode.com/2023/day/15
// Day 15: Lens Library

import { readInput } from '../../common/index';

const steps = readInput('days/day15/input01', ',');

function getHash(initialValue: number, asciiValue: number): number {
  const value = ((initialValue + asciiValue) * 17) % 256;

  return value;
}
function runHash(input: string): number {
  let currentValue = 0;
  for (const char of input) {
    currentValue = getHash(currentValue, char.charCodeAt(0));
  }

  return currentValue;
}

const part01 = steps.reduce((total, step) => total + runHash(step), 0);
process.stdout.write(`Part 01: ${part01}\n`);

type Lens = { label: string; focalLength: number };
const boxes: Array<Lens[]> = [];
const labels = steps.map((step) => step.match(/^([a-z]+)([=-])(\d*)/).slice(1, 4));

for (const [label, operator, focalLength] of labels) {
  const boxNumber = runHash(label);

  if (!boxes[boxNumber]) boxes[boxNumber] = [];

  const box = boxes[boxNumber];

  if (operator === '=') {
    const lens = box.find((lens) => lens.label === label);

    if (lens) {
      lens.focalLength = Number(focalLength);
    } else {
      box.push({ label, focalLength: Number(focalLength) });
    }
  } else {
    const lensIndex = box.findIndex((lens) => lens.label === label);

    if (lensIndex !== -1) {
      box.splice(lensIndex, 1);
    }
  }
}

const part02 = boxes.reduce((total, box, boxNumber) => {
  let boxTotal = 0;

  for (const [lensIndex, lens] of box.entries()) {
    boxTotal += (lensIndex + 1) * lens.focalLength * (boxNumber + 1);
  }

  return boxTotal + total;
}, 0);
process.stdout.write(`Part 02: ${part02}\n`);
