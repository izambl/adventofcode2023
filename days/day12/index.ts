// https://adventofcode.com/2023/day/12
// Day 12: Hot Springs

import { readInput } from '../../common/index';

const input: Array<string[]> = readInput('days/day12/input01', '\n').map((row) => row.split(' '));
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

  regexp.push('^[\\.?]*');
  regexp.push(condition.map((num) => `[?#]{${num}}`).join('[\\.?]+'));
  regexp.push('[\\.?]*$');

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

function walkCondition2(string: string, testCondition: RegExp, validCondition: RegExp, log: () => void) {
  if (!testCondition.test(string)) return;

  if (string.indexOf('?') === -1) {
    if (validCondition.test(string)) {
      log();
      return;
    }
  } else {
    walkCondition2(string.replace('?', '#'), testCondition, validCondition, log);
    walkCondition2(string.replace('?', '.'), testCondition, validCondition, log);
  }
}

let validArrangement = 0;
for (const { conditionRecord, condition } of springs) {
  walkCondition2(conditionRecord.join(''), buildTestCondition(condition), buildFinalCondition(condition), () => {
    validArrangement++;
  });
}
const part01 = validArrangement;
process.stdout.write(`Part 01: ${part01}\n`);

let validArrangement2 = 0;
let count = 0;
for (const { conditionRecord, condition } of springs) {
  const [newConditionRecord, newCondition] = copyConditions(conditionRecord, condition, 5);

  walkCondition2(
    newConditionRecord.join(''),
    buildTestCondition(newCondition),
    buildFinalCondition(newCondition),
    () => {
      validArrangement2++;
    },
  );

  console.log(++count, 'of', springs.length, `[${validArrangement2}]`);
}

const part02 = validArrangement2;
process.stdout.write(`Part 02: ${part02}\n`);
