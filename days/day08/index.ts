// https://adventofcode.com/2023/day/8
// Day 8: Haunted Wasteland

import { readInput } from '../../common/index';

type Direction = 'L' | 'R';
type Node = { [key in Direction]: string };
type Map = { [key: string]: Node };
type Instruction = { direction: Direction; next?: Instruction };

const [instructionsSting, mapString] = readInput('days/day08/input01', '\n\n');
const instructions = instructionsSting.split('');
const map: Map = {};

// Build map
for (const nodeString of mapString.split('\n')) {
  const [from, rest] = nodeString.split(' = ');
  const [left, right] = rest.slice(1, -1).split(', ');

  map[from] = { L: left, R: right };
}

// Build instructions linked list
const firstInstruction: Instruction = { direction: instructions[0] as Direction };
let currentPoint = firstInstruction;
for (const [index, direction] of instructions.entries()) {
  if (index === 0) continue;
  const point: Instruction = { direction: direction as Direction };

  currentPoint.next = point;
  currentPoint = point;
}
currentPoint.next = firstInstruction;

let part01 = 0;
let currentInstruction = firstInstruction;
let currentMapPosition = 'AAA';
while (currentMapPosition !== 'ZZZ') {
  part01++;
  currentMapPosition = map[currentMapPosition][currentInstruction.direction];
  currentInstruction = currentInstruction.next;
}

const part02 = 0;

process.stdout.write(`Part 01: ${part01}\n`);
process.stdout.write(`Part 02: ${part02}\n`);
