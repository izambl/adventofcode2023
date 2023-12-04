// https://adventofcode.com/2023/day/4
// Day 4: Scratchcards

import { intersection } from 'lodash';
import { readInput } from '../../common/index';

const cards = readInput('days/day04/input01', '\n');

interface Games {
  [index: string]: { winning: Array<number>; player: Array<number> };
}

const games: Games = {};

for (const card of cards) {
  const [game, numbers] = card.split(':');
  const [, gameNumber] = game.trim().replace(/\s+/g, ' ').split(' ');

  const [winningNums, playerNums] = numbers.split('|');

  const winningNumbers = winningNums.trim().replace(/\s+/g, ' ').split(' ').map(Number);
  const playerNumbers = playerNums.trim().replace(/\s+/g, ' ').split(' ').map(Number);

  games[gameNumber] = { winning: winningNumbers, player: playerNumbers };
}

const part01 = Object.keys(games).reduce((total: number, gameNumber: string): number => {
  const game = games[gameNumber];
  const winningMatches = intersection(game.winning, game.player);

  if (winningMatches.length === 0) return total;

  const score = Number.parseInt('1'.padEnd(winningMatches.length, '0'), 2);

  return total + score;
}, 0);

const part02 = 0;

process.stdout.write(`Part 01: ${part01}\n`);
process.stdout.write(`Part 02: ${part02}\n`);
