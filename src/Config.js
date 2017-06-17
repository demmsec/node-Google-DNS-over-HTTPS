const fs = require('fs');
const path = require('path');

const configPath = path.resolve(__dirname, '../config.json');
const configJson = fs.readFileSync(configPath);
const config = JSON.parse(configJson);

module.exports = config;
