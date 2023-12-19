// https://adventofcode.com/2023/day/19
// Day 19: Aplenty

import { readInput } from '../../common/index';

const [workflowsInput, partsRatings] = readInput('days/day19/input01', '\n\n');

type WorkFlow = Array<string[]>;
type WorkFlows = { [key: string]: WorkFlow };
const workFlows: WorkFlows = workflowsInput.split('\n').reduce((allWorkflows, workflowLine) => {
  const [workflowKey, workflowFlow] = workflowLine.slice(0, -1).split('{');

  allWorkflows[workflowKey] = workflowFlow.split(',').map((flow) => {
    const flowValues = flow.split(/[<>:]/);
    if (flowValues.length === 3) {
      flowValues.push(flow.slice(1, 2));
    }
    return flowValues;
  });

  return allWorkflows;
}, {} as WorkFlows);

type Part = {
  x: number;
  m: number;
  a: number;
  s: number;
};
const parts: Part[] = partsRatings.split('\n').map((partString) => {
  let jsonString = partString.replace(/=/g, ':');
  jsonString = jsonString.replace(/x/g, '"x"');
  jsonString = jsonString.replace(/m/g, '"m"');
  jsonString = jsonString.replace(/a/g, '"a"');
  jsonString = jsonString.replace(/s/g, '"s"');

  return JSON.parse(jsonString);
});

function executeFlow(part: Part, workFlow: WorkFlow): string {
  for (const workFlowStep of workFlow) {
    if (workFlowStep.length === 1) return workFlowStep[0];
    const [category, quantity, nextWorkFlow, operator] = workFlowStep;

    if (operator === '<') {
      if (part[category as keyof Part] < Number(quantity)) return nextWorkFlow;
    } else {
      if (part[category as keyof Part] > Number(quantity)) return nextWorkFlow;
    }
  }
}

let part01 = 0;
for (const part of parts) {
  let currentFlow = 'in';

  while (currentFlow !== 'R' && currentFlow !== 'A') {
    currentFlow = executeFlow(part, workFlows[currentFlow]);
  }

  if (currentFlow === 'A') {
    part01 += part.x + part.m + part.a + part.s;
  }
}

process.stdout.write(`Part 01: ${part01}\n`);
