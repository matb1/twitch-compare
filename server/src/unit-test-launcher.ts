const Jasmine = require('jasmine');

const runner = new Jasmine();
runner.loadConfigFile('jasmine.json');
runner.execute();