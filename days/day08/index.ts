// https://adventofcode.com/2023/day/8
// Day 8: Haunted Wasteland

import { findLCM, readInput } from '../../common/index';

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

function processMap(map: Map, startPosition: string, winCondition: (position: string) => boolean): number {
  let steps = 0;
  let currentMapPosition = startPosition;
  let currentInstruction = firstInstruction;

  while (!winCondition(currentMapPosition)) {
    steps++;
    currentMapPosition = map[currentMapPosition][currentInstruction.direction];
    currentInstruction = currentInstruction.next;
  }

  return steps;
}

const part01WinCondition = (position: string) => position === 'ZZZ';

const part02StartPositions = Object.keys(map).filter((position) => position.match(/A$/));
const part02WinCondition = (position: string) => position.match(/Z$/) !== null;

const part01 = processMap(map, 'AAA', part01WinCondition);
process.stdout.write(`Part 01: ${part01}\n`);

const part02 = findLCM(part02StartPositions.map((startPosition) => processMap(map, startPosition, part02WinCondition)));
process.stdout.write(`Part 02: ${part02.toString()}\n`);
