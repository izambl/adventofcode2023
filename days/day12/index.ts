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

function getPossibleStrings(conditionRecord: string[], condition: number[]): string[] {
  const defectiveMapLength = condition.reduce((total, actual) => total + actual) + condition.length - 1;

  const freePositions = conditionRecord.length - defectiveMapLength;
  const positionsToFill = condition.length + 1;

  const possiblePositions: Array<number[]> = [];

  function walk(maxSpaces: number, maxPositions: number, currentPosition = 0, currentArray: number[] = []) {
    for (let i = 0; i <= maxSpaces; i++) {
      const array = [...currentArray];
      array[currentPosition] = i;

      if (currentArray.reduce((total, actual) => total + actual, 0) > maxSpaces) return;

      if (currentPosition < maxPositions) {
        walk(maxSpaces, maxPositions, currentPosition + 1, array);
      } else {
        const arraySum = array.reduce((total, actual) => total + actual);
        if (arraySum === maxSpaces) {
          possiblePositions.push(array);
        }
      }
    }
  }

  walk(freePositions, positionsToFill - 1);

  const defectiveString = condition.map((num) => '#'.repeat(num));
  const testStrings = [];
  for (const possiblePositon of possiblePositions) {
    const workingString = possiblePositon.map((num) => '.'.repeat(num));
    const def = [...defectiveString];
    const newString = [];

    while (workingString.length) {
      newString.push(workingString.shift());
      if (def.length) {
        newString.push(def.shift());
        if (def.length !== 0) {
          newString.push('.');
        }
      }
    }
    testStrings.push(newString.join(''));
  }

  return testStrings;
}
function checkStringValidity(possibleString: string, conditionString: string): boolean {
  for (let i = 0; i < possibleString.length; i++) {
    if (possibleString[i] === '#') {
      if (conditionString[i] === '.') {
        return false;
      }
    }
    if (possibleString[i] === '.') {
      if (conditionString[i] === '#') {
        return false;
      }
    }
  }
  return true;
}

let countPart01 = 0;
for (const { conditionRecord, condition } of springs) {
  const possibleStrings = getPossibleStrings(conditionRecord, condition);
  const conditionRecordString = conditionRecord.join('');

  const validStrings = possibleStrings.reduce((total, possibleString) => {
    if (checkStringValidity(possibleString, conditionRecordString)) {
      return total + 1;
    }
    return total;
  }, 0);

  countPart01 += validStrings;
}
process.stdout.write(`Part 01: ${countPart01}\n`);

let countPart02 = 0;
for (const { conditionRecord: a, condition: b } of springs) {
  const [conditionRecord, condition] = copyConditions(a, b, 5);

  const possibleStrings = getPossibleStrings(conditionRecord, condition);
  const conditionRecordString = conditionRecord.join('');

  const validStrings = possibleStrings.reduce((total, possibleString) => {
    if (checkStringValidity(possibleString, conditionRecordString)) {
      return total + 1;
    }
    return total;
  }, 0);

  countPart02 += validStrings;
}
process.stdout.write(`Part 02: ${countPart02}\n`); // ?###????????
// ###, ##, #
// find every possible position for ###

//  ###
//      ###
//       ###
//        ###

// after, find every possible position for ##
