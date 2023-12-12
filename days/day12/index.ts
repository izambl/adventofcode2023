// https://adventofcode.com/2023/day/12
// Day 12: Hot Springs

import { readInput } from '../../common/index';

const input: Array<string[]> = readInput('days/day12/inputDemo', '\n').map((row) => row.split(' '));
type Spring = { conditionRecord: string[]; condition: number[] };

const springs: Spring[] = input.map(([springsString, conditionString]) => {
  return { conditionRecord: springsString.split(''), condition: conditionString.split(',').map(Number) };
});

function buildFinalCondition(condition: number[]): RegExp {
  const regexp: string[] = [];

  regexp.push('^\\.*');
  regexp.push(condition.map((num) => `#{${num}}`).join('\\.+'));
  regexp.push('\\.*$');

  return new RegExp(regexp.join(''));
}

function buildTestCondition(condition: number[]): RegExp {
  const regexp: string[] = [];

  regexp.push('^\\.*');
  regexp.push(condition.map((num) => `[?#]{${num}}`).join('\\.+'));
  regexp.push('\\.*$');

  return new RegExp(regexp.join(''));
}

function copyConditions(conditionRecord: string[], condition: number[], times: number): [string[], number[]] {
  const newConditionRecord = [...Array(times)]
    .map(() => conditionRecord.join(''))
    .join('?')
    .split('');
  const newCondition = [...Array(times)]
    .map(() => condition.join(','))
    .join(',')
    .split(',')
    .map(Number);

  return [newConditionRecord, newCondition];
}

function walkCondition(
  record: string[],
  condition: RegExp,
  log: () => void,
  totalString = '',
  startPosition = 0,
): number {
  let string = totalString;
  if (record.length - startPosition + string.length !== record.length) {
    return 1;
  }

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
  walkCondition(conditionRecord, buildFinalCondition(condition), log);
}
const part01 = validArrangement;
process.stdout.write(`Part 01: ${part01}\n`);

let validArrangement2 = 0;
function log2() {
  validArrangement2 += 1;
}
for (const { conditionRecord, condition } of springs) {
  const [newConditionRecord, newCondition] = copyConditions(conditionRecord, condition, 5);

  walkCondition(newConditionRecord, buildFinalCondition(newCondition), log2);
  console.log(validArrangement2);
}

const part02 = validArrangement2;
process.stdout.write(`Part 02: ${part02}\n`);
