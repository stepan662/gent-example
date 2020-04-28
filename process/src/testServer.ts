import * as dotenv from 'dotenv'
dotenv.config()

import * as path from 'path'
import * as express from 'express'
import * as cors from 'cors'
import * as swaggerUi from 'swagger-ui-express'
import * as yaml from 'yamljs'

import Worker from 'gent-core/lib/Worker'
import LocalModifier from 'gent-core/lib/tools/LocalModifier'

import { OpenApiValidator } from 'express-openapi-validator'
import { createRouter } from './expressRouter'
import simpleProcess from './simpleProcess'

const swaggerDocument = yaml.load(path.join(__dirname, 'schema/schema.yaml'))

const worker = new Worker(simpleProcess, new LocalModifier())
const gentRouter = createRouter(worker)

const app = express()

app.use('/ui', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use(cors())

app.use(express.json())

new OpenApiValidator({
  apiSpec: path.join(__dirname, 'schema/schema.yaml'),
  validateRequests: true,
  validateResponses: false,
})
  .install(app)
  .then(() => {
    worker.poll(100)

    app.use(gentRouter)

    app.listen(8080)
  })
