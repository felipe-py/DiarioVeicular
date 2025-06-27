/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts', '**/*.test.ts'],

  // ADICIONE ESTA LINHA:
  // Ela diz ao Jest para carregar o dotenv antes de executar os testes.
  setupFiles: ['dotenv/config'],
};