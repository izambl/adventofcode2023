// https://adventofcode.com/2023/day/8
// Day 8: Haunted Wasteland

import { readInput } from '../../common/index';

type Direction = 'L' | 'R';
type Node = { [key in Direction]: string };
type Map = { [key: string]: Node };
type Point = { direction: Direction; next?: Point };

const [instructionsSting, mapString] = readInput('days/day08/input01', '\n\n');
const instructions = instructionsSting.split('');
const map: Map = {};

for (const nodeString of mapString.split('\n')) {
  const [from, rest] = nodeString.split(' = ');
  const [left, right] = rest.slice(1, -1).split(', ');

  map[from] = { L: left, R: right };
}

const startPoint: Point = { direction: instructions[0] as Direction };
let currentPoint = startPoint;
for (const [index, direction] of instructions.entries()) {
  if (index === 0) continue;
  const point: Point = { direction: direction as Direction };

  currentPoint.next = point;
  currentPoint = point;
}
currentPoint.next = startPoint;

let part01 = 0;
currentPoint = startPoint;
let currentMapPosition = 'AAA';
while (currentMapPosition !== 'ZZZ') {
  part01++;
  currentMapPosition = map[currentMapPosition][currentPoint.direction];
  currentPoint = currentPoint.next;
}

const part02 = 0;

process.stdout.write(`Part 01: ${part01}\n`);
process.stdout.write(`Part 02: ${part02}\n`);
