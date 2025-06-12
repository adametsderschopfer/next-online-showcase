import * as migration_20250612_201455_init from './20250612_201455_init';

export const migrations = [
  {
    up: migration_20250612_201455_init.up,
    down: migration_20250612_201455_init.down,
    name: '20250612_201455_init'
  },
];
