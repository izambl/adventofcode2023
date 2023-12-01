const day = process.argv[2];

if (!day) {
  console.error('Please specify a day');
  process.exit(1);
}

import(`./day${day}`);
