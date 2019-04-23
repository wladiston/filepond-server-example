// eslint-disable-next-line import/no-unresolved
import {PORT, ALLOWED_ORIGINS} from '@env'
import express from 'express'
import cors from 'cors'
import filepond from './filepound'

const port = PORT || 4000
const server = express()
server.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true)
      if (origin !== ALLOWED_ORIGINS) {
        const msg =
          'The CORS policy for this site does not ' +
          'allow access from the specified Origin.'
        return callback(new Error(msg), false)
      }
      return callback(null, true)
    },
  }),
)

// set filepound routes
server.use('/fileupload', filepond)

server.listen(port, err => {
  if (err) throw err
  // eslint-disable-next-line no-console
  console.log(`> Ready on http://localhost:${port}`)
})
