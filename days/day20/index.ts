// https://adventofcode.com/2023/day/20
// Day 20: Pulse Propagation

import { send } from 'process';
import { readInput } from '../../common/index';

const input = readInput('days/day20/input01', '\n');

interface Module {
  destinations: Set<Module>;
  inputs: Set<Module>;
  name: string;
  type: string;
  pulsesReceived: { false: number; true: number };
  receive: (pulse: boolean, from: string) => void;
  addInput: (input: Module) => void;
  printStatus: () => string;
}

const sendQueue: Array<() => void> = [];

class Broadcast implements Module {
  destinations: Set<Module> = new Set();
  inputs: Set<Module> = new Set();
  name: string;
  pulsesReceived: { false: number; true: number } = { false: 0, true: 0 };
  type = 'Broadcast';

  constructor(name: string) {
    this.name = name;
  }

  receive(pulse: boolean, from: string) {
    console.log(`${from} -${pulse ? 'high' : 'low'}-> ${this.name}`);

    this.pulsesReceived[String(pulse) as keyof typeof this.pulsesReceived] += 1;

    sendQueue.push(() => {
      for (const destination of this.destinations) {
        destination.receive(pulse, this.name);
      }
    });
  }

  addInput(module: Module) {
    this.inputs.add(module);
  }

  printStatus() {
    return `[${this.type}:${this.name}]`;
  }
}

class FlipFlop implements Module {
  destinations: Set<Module> = new Set();
  inputs: Set<Module> = new Set();
  name: string;
  pulsesReceived: { false: number; true: number } = { false: 0, true: 0 };
  status = false;
  type = 'FlipFlop';

  constructor(name: string) {
    this.name = name;
  }

  receive(pulse: boolean, from: string) {
    console.log(`${from} -${pulse ? 'high' : 'low'}-> ${this.name}`);

    this.pulsesReceived[String(pulse) as keyof typeof this.pulsesReceived] += 1;

    if (pulse === true) {
      return;
    }
    this.status = !this.status;

    sendQueue.push(() => {
      for (const destination of this.destinations) {
        destination.receive(this.status, this.name);
      }
    });
  }

  addInput(module: Module) {
    this.inputs.add(module);
  }

  printStatus() {
    return `[${this.type}:${this.name}] status: ${this.status ? 'on' : 'off'}`;
  }
}

class Conjunction implements Module {
  destinations: Set<Module> = new Set();
  inputs: Set<Module> = new Set();
  name: string;
  pulsesReceived: { false: number; true: number } = { false: 0, true: 0 };
  inputsMemories: { [key: string]: boolean } = {};
  type = 'Conjunction';

  constructor(name: string) {
    this.name = name;
  }

  receive(pulse: boolean, from: string) {
    console.log(`${from} -${pulse ? 'high' : 'low'}-> ${this.name}`);

    this.pulsesReceived[String(pulse) as keyof typeof this.pulsesReceived] += 1;

    this.inputsMemories[from] = pulse;

    const pulseToSend = !Object.values(this.inputsMemories).every((pulse) => pulse === true);

    sendQueue.push(() => {
      for (const destination of this.destinations) {
        destination.receive(pulseToSend, this.name);
      }
    });
  }

  addInput(module: Module) {
    this.inputs.add(module);
    this.inputsMemories[module.name] = false;
  }

  printStatus() {
    console.log(this.inputsMemories);
    return `[${this.type}:${this.name}]`;
  }
}

class Output implements Module {
  destinations: Set<Module> = new Set();
  inputs: Set<Module> = new Set();
  name: string;
  pulsesReceived: { false: number; true: number } = { false: 0, true: 0 };
  status = false;
  type = 'Output';

  constructor(name: string) {
    this.name = name;
  }

  receive(pulse: boolean, from: string) {
    console.log(`${from} -${pulse ? 'high' : 'low'}-> ${this.name}`);

    this.pulsesReceived[String(pulse) as keyof typeof this.pulsesReceived] += 1;
  }

  addInput(module: Module) {
    this.inputs.add(module);
  }

  printStatus() {
    return `[${this.type}:${this.name}]`;
  }
}

const modulesMap: { [index: string]: Module } = {};

// Create modules
for (const line of input) {
  const [moduleString] = line.split('->').map((sides) => sides.trim());

  const moduleType = moduleString[0];
  const moduleName = moduleString.slice(1);

  if (moduleType === '%') {
    modulesMap[moduleName] = new FlipFlop(moduleName);
  } else if (moduleType === '&') {
    modulesMap[moduleName] = new Conjunction(moduleName);
  } else {
    modulesMap[moduleName] = new Broadcast(moduleName);
  }
}

// Add inputs and destinations
for (const line of input) {
  const [moduleString, destinationModulesString] = line.split(' -> ').map((sides) => sides.trim());

  const moduleName = moduleString.slice(1);
  const destinationModules = destinationModulesString?.split(', ') ?? [];

  const module = modulesMap[moduleName];

  for (const destinationName of destinationModules) {
    let destinationModule = modulesMap[destinationName];

    if (!destinationModule) {
      destinationModule = new Output(destinationName);
      modulesMap[destinationName] = destinationModule;
    }

    module.destinations.add(modulesMap[destinationName]);
    modulesMap[destinationName].addInput(module);
  }
}

for (const _ of Array(1000)) {
  modulesMap.roadcaster.receive(false, 'Thelu');
  while (sendQueue.length) {
    sendQueue.shift()();
  }

  console.log('\n-----\n');
  for (const module of Object.values(modulesMap)) {
    console.log(module.printStatus());
  }
  console.log('\n-----\n');
}

let highPulses = 0;
let lowPulses = 0;
for (const module of Object.values(modulesMap)) {
  highPulses += module.pulsesReceived.true;
  lowPulses += module.pulsesReceived.false;
}

const part01 = highPulses * lowPulses;
process.stdout.write(`Part 01: ${part01}\n`);
