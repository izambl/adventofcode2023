// https://adventofcode.com/2023/day/12
// Day 12: Hot Springs

import { readInput } from '../../common/index';

const input: Array<string[]> = readInput('days/day12/input01', '\n').map((row) => row.split(' '));
type Spring = { conditionRecord: string[]; condition: number[] };

const springs: Spring[] = input.map(([springsString, conditionString]) => {
  return { conditionRecord: springsString.split(''), condition: conditionString.split(',').map(Number) };
});

function buildCondition(condition: number[]): RegExp {
  let regexp = '^\\.*';

  regexp += condition.map((num) => '#'.repeat(num)).join('\\.+');

  regexp += '\\.*$';

  return new RegExp(regexp);
}

function walkCondition(
  record: string[],
  condition: RegExp,
  log: () => void,
  totalString = '',
  startPosition = 0,
): number {
  let string = totalString;

  for (let i = startPosition; i < record.length; i++) {
    const rec = record[i];

    if (rec === '.' || rec === '#') {
      string += rec;
    }
    if (rec === '?') {
      walkCondition(record, condition, log, `${string}#`, i + 1);
      walkCondition(record, condition, log, `${string}.`, i + 1);
      break;
    }
  }

  if (string.length === record.length && string.match(condition)) {
    log();
  }

  return 1;
}

let validArrangement = 0;
function log() {
  validArrangement += 1;
}
for (const { conditionRecord, condition } of springs) {
  walkCondition(conditionRecord, buildCondition(condition), log);
}

const part01 = validArrangement;
process.stdout.write(`Part 01: ${part01}\n`);

const part02 = 1;
process.stdout.write(`Part 02: ${part02}\n`);
