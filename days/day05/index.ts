// https://adventofcode.com/2023/day/5
// Day 5: If You Give A Seed A Fertilizer

import { readInput } from '../../common/index';

const almanacInput = readInput('days/day05/inputDemo', '\n\n');

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

const seedsPath: number[][] = seeds.map((seed): number[] => {
  const path: number[] = [seed];

  for (const step of almanac) {
    const source = path.at(-1);

    const mapping = step.maps.find(([, [sourceRangeFrom, sourceRangeTo]]) => {
      if (source >= sourceRangeFrom && source <= sourceRangeTo) return true;

      return false;
    });

    if (!mapping) {
      path.push(source);
      continue;
    }

    const [[, destinationRangeTo], [, sourceRangeTo]] = mapping;

    path.push(destinationRangeTo - (sourceRangeTo - source));
  }

  return path;
});

const part01 = Math.min(...seedsPath.map((sp) => sp.at(-1)));
const part02 = 0;

process.stdout.write(`Part 01: ${part01}\n`);
process.stdout.write(`Part 02: ${part02}\n`);
