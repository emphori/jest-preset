'use strict';

const fs = require('fs');
const glob = require('glob');
const path = require('path');

const { name, main } = readPackageJSON();

let moduleDirectories = [];
let moduleNameMapper = {};

if (fs.existsSync('lerna.json')) {
  moduleDirectories = getLernaRepoPackagesRoot();
  moduleNameMapper = getLernaRepoPackagesMap();
}

moduleDirectories = [
  ...moduleDirectories,
  'node_modules'
];

moduleNameMapper = {
  ...moduleNameMapper,
  [`^${name}$`]: path.join('<rootDir>', main || '')
}

module.exports = {
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'lib/**/*.{js,ts}',
    'src/main/**/*.{js,ts}'
  ],
  projects: [
    {
      preset: 'ts-jest',
      testRegex: '\\w+\\.spec\\.ts$',
      moduleDirectories,
      moduleNameMapper,
      globals: {
        'ts-jest': {
          'diagnostics': {
            'ignoreCodes': [
              'TS151001'
            ]
          }
        }
      }
    },
    {
      testRegex: '\\w+\\.spec\\.js$',
      moduleDirectories,
      moduleNameMapper
    }
  ]
};

function getLernaRepoPackagesRoot() {
  return readLernaJSON().packages;
}

function getLernaRepoPackagesMap() {
  const packagesMap = {};

  for (const packageRoot of getLernaRepoPackagesRoot()) {
    for (const packageDir of glob.sync(packageRoot)) {
      const { name, main } = readPackageJSON(packageDir);

      packagesMap[`^${name}$`] = path.join('<rootDir>', packageDir, main || '');
    }
  }

  return packagesMap;
}

function readLernaJSON(root = '.') {
  return JSON.parse(fs.readFileSync(`${root}/lerna.json`));
}

function readPackageJSON(root = '.') {
  return JSON.parse(fs.readFileSync(`${root}/package.json`));
}
