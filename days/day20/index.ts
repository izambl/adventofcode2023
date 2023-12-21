// https://adventofcode.com/2023/day/20
// Day 20: Pulse Propagation

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
let outputReceivedLowPulse = false;
const debug = false;

abstract class AbstractModule implements Module {
  destinations: Set<Module> = new Set();
  name: string;
  inputs: Set<Module> = new Set();
  pulsesReceived: { false: number; true: number } = { false: 0, true: 0 };
  type = '';

  constructor(name: string) {
    this.name = name;
  }

  addInput(module: Module) {
    this.inputs.add(module);
  }

  printStatus() {
    return `[${this.type}:${this.name}]`;
  }

  abstract receive(pulse: boolean, from: string): void;
}

class Broadcast extends AbstractModule implements Module {
  type = 'Broadcast';

  receive(pulse: boolean, from: string) {
    debug && console.log(`${from} -${pulse ? 'high' : 'low'}-> ${this.name}`);

    this.pulsesReceived[String(pulse) as keyof typeof this.pulsesReceived] += 1;

    sendQueue.push(() => {
      for (const destination of this.destinations) {
        destination.receive(pulse, this.name);
      }
    });
  }
}

class FlipFlop extends AbstractModule implements Module {
  status = false;
  type = 'FlipFlop';

  receive(pulse: boolean, from: string) {
    debug && console.log(`${from} -${pulse ? 'high' : 'low'}-> ${this.name}`);

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

  printStatus() {
    return `[${this.type}:${this.name}] status: ${this.status ? 'on' : 'off'}`;
  }
}

class Conjunction extends AbstractModule implements Module {
  inputsMemories: { [key: string]: boolean } = {};
  type = 'Conjunction';

  receive(pulse: boolean, from: string) {
    debug && console.log(`${from} -${pulse ? 'high' : 'low'}-> ${this.name}`);

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

class Output extends AbstractModule implements Module {
  type = 'Output';

  receive(pulse: boolean, from: string) {
    debug && console.log(`${from} -${pulse ? 'high' : 'low'}-> ${this.name}`);

    if (pulse === false) {
      outputReceivedLowPulse = true;
    }

    this.pulsesReceived[String(pulse) as keyof typeof this.pulsesReceived] += 1;
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

let clickCount = 0;
let part01 = 0;
while (clickCount < 1000) {
  clickCount += 1;
  modulesMap.roadcaster.receive(false, 'Thelu');
  while (sendQueue.length) {
    sendQueue.shift()();
  }

  if (clickCount % 1000000 === 0) {
    console.log('exit  click', clickCount);
  }

  if (clickCount === 1000) {
    let highPulses = 0;
    let lowPulses = 0;
    for (const module of Object.values(modulesMap)) {
      highPulses += module.pulsesReceived.true;
      lowPulses += module.pulsesReceived.false;
    }
    part01 = highPulses * lowPulses;
  }
}

process.stdout.write(`Part 01: ${part01}\n`);

const part02 = clickCount;
process.stdout.write(`Part 02: ${part02}\n`);
// LCM solution
// Get all inputs for the input of the output
// Find the cycles of those inputs being High
// Get the LCM of those
// Profit
