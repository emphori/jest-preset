'use strict';

const fs = require('fs');

const config = {
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: [
    "lib/**/*.{js,ts}",
    "src/main/**/*.{js,ts}"
  ]
};

if (fs.existsSync('tsconfig.json')) {
  console.log('TS project detected');

  config.preset = 'ts-jest';
  config.globals = {
    "ts-jest": {
      "diagnostics": {
        "ignoreCodes": [
          "TS151001"
        ]
      }
    }
  }
}

if (fs.existsSync('packages')) {
  console.log('Monorepo detected');

  config.collectCoverageFrom = [
    "packages/*/lib/**/*.{js,ts}",
    "packages/*/src/main/**/*.{js,ts}"
  ],

  config.moduleNameMapper = {};

  for (const dir of fs.readdirSync("packages")) {
    const { name } = JSON.parse(fs.readFileSync(`packages/${dir}/package.json`));

    config.moduleNameMapper[`^${name}/([a-z]+)$`] = `<rootDir>/packages/${dir}/$1`;
  }
}

module.exports = config;
