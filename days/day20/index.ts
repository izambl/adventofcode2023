// https://adventofcode.com/2023/day/20
// Day 20: Pulse Propagation

import { readInput } from '../../common/index';

const input = readInput('days/day20/inputDemo1', '\n');

interface Module {
  destinations: Set<Module>;
  inputs: Set<Module>;
  name: string;
  type: string;
  pulsesSent: { false: number; true: number };
  receive: (pulse: boolean, from: string) => void;
  process: () => void;
  addInput: (input: Module) => void;
}

class Broadcast implements Module {
  destinations: Set<Module> = new Set();
  inputs: Set<Module> = new Set();
  name: string;
  pulsesSent: { false: number; true: number } = { false: 0, true: 0 };
  receivedPulse = false;
  type = 'Broadcast';

  constructor(name: string) {
    this.name = name;
  }

  receive(pulse: boolean, from: string) {
    this.receivedPulse = pulse;
    console.log(`[${this.type}:${this.name}] receives ${pulse} from ${from}`);
    this.process();
  }

  process() {
    for (const destination of this.destinations) {
      console.log(`[${this.type}:${this.name}] sends ${this.receivedPulse} to ${destination.name}`);
      this.pulsesSent[String(this.receivedPulse) as keyof typeof this.pulsesSent] += 1;
      destination.receive(this.receivedPulse, this.name);
    }
  }

  addInput(module: Module) {
    this.inputs.add(module);
  }
}

class FlipFlop implements Module {
  destinations: Set<Module> = new Set();
  inputs: Set<Module> = new Set();
  name: string;
  pulsesSent: { false: number; true: number } = { false: 0, true: 0 };
  receivedPulses: boolean[] = [];
  status = false;
  type = 'FlipFlop';

  constructor(name: string) {
    this.name = name;
  }

  receive(pulse: boolean, from: string) {
    this.receivedPulses.push(pulse);
    console.log(`[${this.type}:${this.name}] receives ${pulse} from ${from}`);
    this.process();
  }

  process() {
    for (const pulse of this.receivedPulses) {
      if (pulse === true) return;

      this.status = !this.status;

      for (const destination of this.destinations) {
        this.pulsesSent[String(this.status) as keyof typeof this.pulsesSent] += 1;
        destination.receive(this.status, this.name);
      }
    }
  }

  addInput(module: Module) {
    this.inputs.add(module);
  }
}

class Conjunction implements Module {
  destinations: Set<Module> = new Set();
  inputs: Set<Module> = new Set();
  name: string;
  pulsesSent: { false: number; true: number } = { false: 0, true: 0 };
  receivedPulses: boolean[] = [];
  receivedPulsesValues: { [key: string]: boolean } = {};
  type = 'Conjunction';

  constructor(name: string) {
    this.name = name;
  }

  receive(pulse: boolean, from: string) {
    this.receivedPulses.push(pulse);
    this.receivedPulsesValues[from] = false;
    console.log(`[${this.type}:${this.name}] receives ${pulse} from ${from}`);
    this.process();
  }

  process() {
    const pulse = !Object.values(this.receivedPulsesValues).every((pulse) => pulse === true);

    for (const destination of this.destinations) {
      this.pulsesSent[String(pulse) as keyof typeof this.pulsesSent] += 1;
      destination.receive(pulse, this.name);
    }
  }

  addInput(module: Module) {
    this.inputs.add(module);
    this.receivedPulsesValues[module.name] = false;
  }
}

const modulesMap: { [index: string]: Module } = {};

// Create modules
for (const line of input) {
  const [moduleString] = line.split(' -> ');

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
  const [moduleString, destinationModulesString] = line.split(' -> ');

  const moduleName = moduleString.slice(1);
  const destinationModules = destinationModulesString.split(', ');

  const module = modulesMap[moduleName];

  for (const destinationName of destinationModules) {
    module.destinations.add(modulesMap[destinationName]);
    modulesMap[destinationName].addInput(module);
  }
}

modulesMap.roadcaster.receive(false, 'Thelu');

for (const module of Object.values(modulesMap)) {
  console.log(module.pulsesSent);
}

const part01 = 0;
process.stdout.write(`Part 01: ${part01}\n`);
