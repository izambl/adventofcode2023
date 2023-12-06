// https://adventofcode.com/2023/day/6
// Day 6: Wait For It

import { readInput } from '../../common/index';

type Race = { time: number; bestDistance: number };
const racesInput = readInput('days/day06/input01', '\n').map((race) => {
  const [, times] = race.split(':');
  return times.trim().replace(/\s+/g, ' ').split(' ').map(Number);
});

function getPossibleWins(races: Race[]): number[] {
  return races.map(({ time, bestDistance }) => {
    let wins = 0;
    let buttonTime = time;

    while (buttonTime) {
      const velocity = buttonTime;
      const timeToRace = time - buttonTime;
      const distance = velocity * timeToRace;

      if (distance > bestDistance) wins++;

      buttonTime--;
    }
    return wins;
  });
}

const racesPart01: Race[] = [];
for (const [i] of racesInput[0].entries()) {
  racesPart01.push({ time: racesInput[0][i], bestDistance: racesInput[1][i] });
}

const racePart02 = racesInput.map((raceInput) => Number(raceInput.join('')));
const racesPart02 = [{ time: racePart02[0], bestDistance: racePart02[1] }];

const possibleWinsPart01 = getPossibleWins(racesPart01);
const possibleWinsPart02 = getPossibleWins(racesPart02);

const part01 = possibleWinsPart01.reduce((total, possibleWin) => total * possibleWin, 1);
const part02 = possibleWinsPart02[0];

process.stdout.write(`Part 01: ${part01}\n`);
process.stdout.write(`Part 02: ${part02}\n`);
