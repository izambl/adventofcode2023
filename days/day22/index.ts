// https://adventofcode.com/2023/day/22
// Day 22: Sand Slabs

import { readInput } from '../../common/index';

const input = readInput('days/day22/input01', '\n');

class SandSlab {
  fromX: number;
  fromY: number;
  fromZ: number;
  toX: number;
  toY: number;
  toZ: number;

  id: string;

  xs: number[] = [];
  ys: number[] = [];
  zs: number[] = [];

  constructor(fromX: number, fromY: number, fromZ: number, toX: number, toY: number, toZ: number, id: number) {
    this.fromX = fromX;
    this.fromY = fromY;
    this.fromZ = fromZ;
    this.toX = toX;
    this.toY = toY;
    this.toZ = toZ;
    this.id = String(id);

    this.expandDimensions();
  }

  expandDimensions() {
    for (let x = Math.min(this.fromX, this.toX); x <= Math.max(this.fromX, this.toX); x++) {
      this.xs.push(x);
    }
    for (let y = Math.min(this.fromY, this.toY); y <= Math.max(this.fromY, this.toY); y++) {
      this.ys.push(y);
    }
    for (let z = Math.min(this.fromZ, this.toZ); z <= Math.max(this.fromZ, this.toZ); z++) {
      this.zs.push(z);
    }
  }

  fall(floors = 1) {
    this.fromZ -= floors;
    this.toZ = -floors;

    this.zs = this.zs.map((z) => z - floors);
  }

  get ids() {
    return String.fromCharCode(Number(this.id));
  }

  get minZ() {
    return this.zs[0];
  }
}

class Space {
  space: {
    [x: string]: { [y: string]: { [z: string]: SandSlab } };
  } = {};
  sandSlabs = new Set<SandSlab>();

  placeSlab(sandSlab: SandSlab) {
    for (const x of sandSlab.xs) {
      for (const y of sandSlab.ys) {
        for (const z of sandSlab.zs) {
          if (!this.space[x]) this.space[x] = {};
          if (!this.space[x][y]) this.space[x][y] = {};

          this.space[x][y][z] = sandSlab;
          this.sandSlabs.add(sandSlab);
        }
      }
    }
  }

  whoIsDown(sandSlab: SandSlab): SandSlab[] {
    const down = new Set<SandSlab>();
    for (const x of sandSlab.xs) {
      for (const y of sandSlab.ys) {
        for (const z of sandSlab.zs) {
          if (this.space[x]?.[y]?.[z - 1] && this.space[x][y][z - 1] !== sandSlab) {
            down.add(this.space[x][y][z - 1]);
          }
        }
      }
    }

    return Array.from(down);
  }

  whoIsUp(sandSlab: SandSlab): SandSlab[] {
    const down = new Set<SandSlab>();
    for (const x of sandSlab.xs) {
      for (const y of sandSlab.ys) {
        for (const z of sandSlab.zs) {
          if (this.space[x]?.[y]?.[z + 1] && this.space[x][y][z + 1] !== sandSlab) {
            down.add(this.space[x][y][z + 1]);
          }
        }
      }
    }

    return Array.from(down);
  }

  removeSlab(sandSlab: SandSlab) {
    for (const x of sandSlab.xs) {
      for (const y of sandSlab.ys) {
        for (const z of sandSlab.zs) {
          this.space[x][y][z] = null;
          this.sandSlabs.delete(sandSlab);
        }
      }
    }
  }

  clone(): Space {
    const newSpace = new Space();

    for (const sandSlab of this.sandSlabs) {
      newSpace.placeSlab(sandSlab);
    }

    return newSpace;
  }
}

const sandSlabs: SandSlab[] = [];
const space = new Space();

// Construct sand slabs
let id = 65;
for (const line of input) {
  const [[x, y, z], [x2, y2, z2]] = line.split('~').map((coord) => coord.split(',').map(Number));

  const sandSlab = new SandSlab(x, y, z, x2, y2, z2, id++);
  sandSlabs.push(sandSlab);
  space.placeSlab(sandSlab);
}
// Order slabs by height
sandSlabs.sort((a, b) => a.zs[0] - b.zs[0]);

function applyGravity(sandSlabs: SandSlab[]): boolean {
  let movement = false;

  for (const sandSlab of sandSlabs) {
    if (sandSlab.minZ <= 1) {
      continue;
    }

    const down = space.whoIsDown(sandSlab);
    if (down.length === 0) {
      movement = true;
      space.removeSlab(sandSlab);
      sandSlab.fall();
      space.placeSlab(sandSlab);
    }
  }

  return movement;
}

// move everything to a stable position
let gravityApplied = true;
do {
  gravityApplied = applyGravity(sandSlabs);
} while (gravityApplied);

let canDisintegrate = 0;
const supportingSandSlabs = new Set<SandSlab>();
for (const sandSlab of sandSlabs) {
  const up = space.whoIsUp(sandSlab);

  const hasExtraSupport = up.every((upSandSlab) => {
    const down = space.whoIsDown(upSandSlab);
    return down.length > 1;
  });

  if (hasExtraSupport) {
    canDisintegrate += 1;
  } else {
    supportingSandSlabs.add(sandSlab);
  }
}

console.log(Array.from(supportingSandSlabs).map((x) => x.id));

const part01 = canDisintegrate;
process.stdout.write(`Part 01: ${part01}\n`);

const part02 = 2;
process.stdout.write(`Part 02: ${part02}\n`);
