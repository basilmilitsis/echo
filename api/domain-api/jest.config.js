const preset = require('ts-jest/presets')
module.exports = {
    ...preset.defaults,
    moduleNameMapper: {
        '@root/(.*)': '<rootDir>/src/$1',
    }
}
