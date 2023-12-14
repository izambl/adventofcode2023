// https://adventofcode.com/2023/day/14
// Day 14: Parabolic Reflector Dish

import { readInput } from '../../common/index';

type RockType = 'Round' | 'Cube';
type Rock = {
  x: number;
  y: number;
  type: RockType;
};
type RockInLane = {
  rock: Rock;
  next: RockInLane | null;
  prev: RockInLane | null;
};
type Lane = {
  firstRock: RockInLane;
  lastAdded: RockInLane;
  rockCount: number;
};

const rawTerrain = readInput('days/day14/input01', '\n').map((row) => row.split(''));

const roundRocks: Rock[] = [];
const lanes: { [laneNumber: string]: Lane } = {};

function printLanes() {
  for (const laneNumner of Object.keys(lanes)) {
    const laneString = [];
    const lane = lanes[laneNumner];
    let currentRock = lane.firstRock;
    while (currentRock) {
      laneString[currentRock.rock.y] = currentRock.rock.type === 'Cube' ? '#' : 'O';
      currentRock = currentRock.next;
    }
    for (let i = 0; i < laneString.length; i++) {
      if (!laneString[i]) {
        laneString[i] = ' ';
      }
    }

    console.log(laneString.join(''));
  }
}

// Build lanes
for (const [y, row] of rawTerrain.entries()) {
  for (const [x, tile] of row.entries()) {
    if (tile !== '.') {
      const rock: Rock = {
        x: Number(x),
        y: Number(y),
        type: tile === '#' ? 'Cube' : 'Round',
      };
      if (rock.type === 'Round') roundRocks.push(rock);

      const rockInLane: RockInLane = { rock, next: null, prev: null };
      if (!lanes[rock.x]) {
        lanes[rock.x] = {
          firstRock: rockInLane,
          lastAdded: rockInLane,
          rockCount: 1,
        };
      } else {
        rockInLane.prev = lanes[rock.x].lastAdded;
        lanes[rock.x].lastAdded.next = rockInLane;
        lanes[rock.x].lastAdded = rockInLane;
        lanes[rock.x].rockCount += 1;
      }
    }
  }
}

// ProcessLanes
for (const laneNumber of Object.keys(lanes)) {
  const lane = lanes[laneNumber];

  let currentRock = lane.firstRock;
  while (currentRock) {
    if (currentRock.rock.type === 'Round') {
      // Roll Rock
      if (currentRock.prev) {
        const valueDiff = currentRock.rock.y - currentRock.prev.rock.y;
        currentRock.rock.y = currentRock.prev.rock.y + 1;
      } else if (currentRock.rock.y !== 0) {
        currentRock.rock.y = 0;
      }
    }
    currentRock = currentRock.next;
  }
}

printLanes();

const part01 = roundRocks.reduce((total, rock) => total + (rawTerrain.length - rock.y), 0);
process.stdout.write(`Part 01: ${part01}\n`);

const part02 = 0;
process.stdout.write(`Part 02: ${part02}\n`);
