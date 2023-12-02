// https://adventofcode.com/2023/day/1
// Day 2: Cube Conundrum

import { readInput } from '../../common/index';

interface GameConfig {
  [key: string]: Array<{ [color: string]: number }>;
}

const games = readInput('days/day02/input01', '\n');

const gameConfig: GameConfig = {};
for (const game of games) {
  const [gameNumberString, grabsString] = game.split(':');
  const [, gameNumber] = gameNumberString.split(' ');

  gameConfig[gameNumber] = [];
  const currentGame = gameConfig[gameNumber];

  const grabs = grabsString.trim().split(';');
  for (const grab of grabs) {
    const currentGrab: GameConfig[keyof GameConfig][number] = {};

    const colorsGrabbed = grab.split(',');
    for (const colorGrabbed of colorsGrabbed) {
      const [quantity, color] = colorGrabbed.trim().split(' ');
      currentGrab[color] = Number(quantity);
    }

    currentGame.push(currentGrab);
  }
}

const maxCubes: GameConfig[keyof GameConfig][number] = Object.freeze({
  red: 12,
  green: 13,
  blue: 14,
});
const part01 = Object.keys(gameConfig).reduce((total, gameNumber) => {
  const game = gameConfig[gameNumber];
  const isValidGame = game.every((grab) => {
    return Object.keys(grab).every((colorGrabbed) => {
      return grab[colorGrabbed] <= maxCubes[colorGrabbed];
    });
  });

  if (isValidGame) return total + Number(gameNumber);
  return total;
}, 0);

const part02 = Object.keys(gameConfig).reduce((total, gameNumber) => {
  const game = gameConfig[gameNumber];
  const minColors: { [color: string]: number } = {};
  for (const grab of game) {
    for (const color of Object.keys(grab)) {
      if (minColors[color] === undefined) minColors[color] = 0;

      if (minColors[color] < grab[color]) minColors[color] = grab[color];
    }
  }

  const [minColorA, minColorB, minColorC] = Object.values(minColors);

  return total + minColorA * minColorB * minColorC;
}, 0);

process.stdout.write(`Part 01: ${part01}\n`);
process.stdout.write(`Part 02: ${part02}\n`);
