// https://adventofcode.com/2023/day/19
// Day 19: Aplenty

import { inspect } from 'util';
import { readInput } from '../../common/index';

type Part = {
  x: number;
  m: number;
  a: number;
  s: number;
};
type Category = 'x' | 'm' | 'a' | 's';
type Operator = '<' | '>';
type Condition = [Category, Operator, number];
type Rule = {
  condition: Condition;
  if: Rule | string;
  else: Rule | string;
};

function normalizeRule(rule: Rule): Rule {
  if (rule.if !== 'R' && rule.if !== 'A') {
    rule.if = typeof rule.if === 'string' ? normalizeRule(rulesDict[rule.if]) : normalizeRule(rule.if);
  }

  if (rule.else !== 'R' && rule.else !== 'A') {
    rule.else = typeof rule.else === 'string' ? normalizeRule(rulesDict[rule.else]) : normalizeRule(rule.else);
  }

  return rule;
}

const [workflowsInput, partsRatings] = readInput('days/day19/inputDemo', '\n\n');
const parts: Part[] = partsRatings.split('\n').map((partString) => {
  let jsonString = partString.replace(/=/g, ':');
  jsonString = jsonString.replace(/x/g, '"x"');
  jsonString = jsonString.replace(/m/g, '"m"');
  jsonString = jsonString.replace(/a/g, '"a"');
  jsonString = jsonString.replace(/s/g, '"s"');

  return JSON.parse(jsonString);
});

const rulesDict: { [key: string]: Rule } = {};

for (const workFlow of workflowsInput.split('\n')) {
  const [workflowKey, workflowFlow] = workFlow.slice(0, -1).split('{');

  const ruleParts = workflowFlow.split(',');

  const elsePart = ruleParts.pop();
  const firstPart = ruleParts.pop();
  const [condition, ifPart] = firstPart.split(':');
  let newRule: Rule = {
    condition: [condition[0] as Category, condition[1] as Operator, Number(condition.slice(2))],
    if: ifPart,
    else: elsePart,
  };

  while (ruleParts.length) {
    const firstPart = ruleParts.pop();
    const [condition, ifPart] = firstPart.split(':');
    newRule = {
      condition: [condition[0] as Category, condition[1] as Operator, Number(condition.slice(2))],
      if: ifPart,
      else: newRule,
    };
  }

  rulesDict[workflowKey] = newRule;
}

const startRule = normalizeRule(rulesDict.in);

console.log(inspect(startRule, false, null, true));

let part01b = 0;
for (const part of parts) {
  let currentResult: Rule | string = startRule;
  const { x, m, a, s } = part;

  while (typeof currentResult !== 'string') {
    const [category, operator, value]: Condition = currentResult.condition;
    if (operator === '>') {
      currentResult = part[category] > value ? currentResult.if : currentResult.else;
    } else {
      currentResult = part[category] < value ? currentResult.if : currentResult.else;
    }
  }

  if (currentResult === 'A') {
    part01b += x + m + a + s;
  }
}

process.stdout.write(`Part 01b: ${part01b}\n`);
