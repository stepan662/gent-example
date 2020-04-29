import * as dotenv from 'dotenv'
dotenv.config()

import * as path from 'path'
import * as express from 'express'
import * as cors from 'cors'
import * as swaggerUi from 'swagger-ui-express'
import * as yaml from 'yamljs'

import Worker from 'gent-core/lib/Worker'
import { OpenApiValidator } from 'express-openapi-validator'
import { createRouter } from './expressRouter'
import MongoModifier from './modifiers/mongoModifier'
import { MongoClient } from 'mongodb'
import simpleProcess from './simpleProcess'

const url = process.env.DB_CONNECTION

const swaggerDocument = yaml.load(path.join(__dirname, 'schema/schema.yaml'))

const app = express()

app.use('/ui', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use(cors())

app.use(express.json())

new OpenApiValidator({
  apiSpec: path.join(__dirname, 'schema/schema.yaml'),
  validateRequests: {
    allowUnknownQueryParameters: false,
  },
  validateResponses: true,
})
  .install(app)
  .then(() => {
    MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true }, (err, client) => {
      if (err) {
        console.error(`Failed to connect to the database. ${err.stack}`)
        process.exit(1)
      }

      const worker = new Worker(simpleProcess, new MongoModifier(client))

      worker.poll(1000)

      const router = createRouter(worker)
      app.use(router)

      app.listen(8080, () => {
        console.log('Server running on port 8080')
      })
    })
  })
