'use strict'

const fs = require('fs')
const path = require('path')
const LoadTesting = require('easygraphql-load-tester')
const { fileLoader } = require('merge-graphql-schemas')

const schema = fs.readFileSync(path.join(__dirname, 'schema.gql'), 'utf8')
const queries = fileLoader(path.join(__dirname, './graphql'))


const easyGraphQLLoadTester = new LoadTesting(schema)

const testCases = easyGraphQLLoadTester.artillery({
  customQueries: queries,
  onlyCustomQueries: true,
  selectedQueries: ['PointsFull'],
  queryFile: true,
})

module.exports = { testCases }
