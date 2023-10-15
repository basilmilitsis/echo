const preset = require('ts-jest/presets')
module.exports = {
    ...preset.defaults,
    moduleNameMapper: {
        '@root/(.*)': '<rootDir>/src/$1',
    },
    setupFiles: ["<rootDir>/jest.env.js"],
    globals: {
        "ts-jest": {
            "tsConfig": "./tsconfig.test.json"
        }
    }
}
