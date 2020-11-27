# Test Graphql
Vamos a ver como testear un endpoint Graphql, para esto usamos:
- [Easygraphql load tester](https://github.com/EasyGraphQL/easygraphql-load-tester)
- [Artillery](https://artillery.io/docs/guides/overview/welcome.html#Stay-in-touch)

## Como iniciar
Primeros clonamos el repositorio y ejecutamos 
```
npm install
```
Luego iniciamos la prueba
```
npm run easygraphql-load-tester
```
# Configuración 
Primero configuramos artillery mediante el archivo **artillery.yml**
````
config:
  # Endpoint graphql
  target: 'https://developvizion3.southcentralus.cloudapp.azure.com:4000'
  phases:
    # Duración y carga de la prueba
    - duration: 10
      arrivalRate: 10
  processor: './index.js'
scenarios:
  - name: 'GraphQL Query load test'
    flow:
      - function: 'testCases'
      - loop:
          - post:
              url: '/'
              headers:
                # Parametros de headers http
                Authorization: "Bearer token"
                Accept-Encoding: "gzip"
              json:
                query: '{{ $loopElement.query }}'
                variables: '{{ $loopElement.variables }}'
          - log: '----------------------------------'
          - log: 'Sent a request to the {{ $loopElement.operation }}: {{ $loopElement.name }}'
          - log: 'And variables {{ $loopElement.variables }}'
        over: cases
```` 
Para ver más configuraciones ver [documentacion](https://artillery.io/docs/guides/overview/welcome.html#Stay-in-touch)

Vamos a configurar las peticiones Graphql, en el archivo schema.gql agregamos los tipos de datos (type), las Query y las Mutation 
````
type Query {
  users: [User]
}
type User {
  id: Int!
  userName: String!
  firstName: String!
  lastName: String!
  email: String!
  contactNumber: String
  status: Boolean
}
````
en la carpeta graphql tenemos que agregar archivos **.graphql** donde vamos a declarar las peticiones q vamos a realizar, por ejemplo ``PointsFull.graphql``
````
query PointsFull{
  points {
    avlid
    patente
    latitud
    fechaGPS
    estadoID
    velocidad
    odometroTotal
    odometroSoftware
    ultimaTransmision
  }
}
````
Por último, configuramos el archivo index.js
````
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
````
En el apartado ``selectedQueries: ['PointsFull']`` se configura que queries de la carpeta **/graphql** se va a utilizar para la prueba

También se pueden pasar argumentos a las llamadas, ver [documentacion](https://github.com/EasyGraphQL/easygraphql-load-tester) 

## Resultado de la prueba
````
 All virtual users finished
 Summary report @ 15:03:05(-0500) 2018-11-17
   Scenarios launched:  5
   Scenarios completed: 5
   Requests completed:  40
   RPS sent: 8.95
   Request latency:
     min: 1.2
     max: 13
     median: 2
     p95: 6
     p99: 13
   Scenario counts:
     GraphQL Query load test: 5 (100%)
   Codes:
     200: 40
````
    
