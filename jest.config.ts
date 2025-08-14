import type { Config } from 'jest'
import { createDefaultEsmPreset } from 'ts-jest'

const presetConfig = createDefaultEsmPreset()

const jestConfig: Config = {
  ...presetConfig,
  transform: {
    '^.+\\.m?tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  roots: ['./src/app/board/_tests'],
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
}

export default jestConfig
