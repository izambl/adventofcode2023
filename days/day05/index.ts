// https://adventofcode.com/2023/day/5
// Day 5: If You Give A Seed A Fertilizer

import { readInput } from '../../common/index';

const almanacInput = readInput('days/day05/input01', '\n\n');

const seeds = almanacInput.shift().split(': ')[1].split(' ').map(Number);

type Almanac = Array<{ name: string; maps: Array<[[number, number], [number, number]]> }>;

const almanac: Almanac = [];

for (const almanacEntry of almanacInput) {
  const [name, mapsEntries] = almanacEntry.split(' map:\n');

  const maps = mapsEntries.split('\n').map((mapEntry): [[number, number], [number, number]] => {
    const [destination, source, length] = mapEntry.split(' ').map(Number);

    return [
      [destination, destination + length - 1],
      [source, source + length - 1],
    ];
  });

  almanac.push({
    name,
    maps,
  });
}

function getLocation(seed: number): number {
  let location = seed;

  for (const step of almanac) {
    const source = location;

    const mapping = step.maps.find(([, [sourceRangeFrom, sourceRangeTo]]) => {
      if (source >= sourceRangeFrom && source <= sourceRangeTo) return true;

      return false;
    });

    if (!mapping) {
      location = source;
      continue;
    }

    const [[, destinationRangeTo], [, sourceRangeTo]] = mapping;

    location = destinationRangeTo - (sourceRangeTo - source);
  }

  return location;
}

let part01 = Infinity;
for (const seed of seeds) {
  part01 = Math.min(part01, getLocation(seed));
}

process.stdout.write(`Part 01: ${part01}\n`);

const seedsInputPart02 = [...seeds];
const seedsPart02 = [];

while (seedsInputPart02.length) {
  const from = seedsInputPart02.shift();
  const length = seedsInputPart02.shift();

  seedsPart02.push({ from: from, to: from + length - 1, len: from + length - from });
}

let part02 = Infinity;
for (const { from, to, len } of seedsPart02) {
  console.log(`Current min: ${part02}`);

  for (let seed = from; seed <= to; seed++) {
    part02 = Math.min(part02, getLocation(seed));
  }
}

process.stdout.write(`Part 02: ${part02}\n`);
