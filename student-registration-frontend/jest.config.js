module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^.+\\.(css|scss|sass)$': 'identity-obj-proxy',
    '^.+\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js'
  },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest']
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(react-icons|@mui|@emotion|@testing-library|lodash-es)/)'
  ]
};
