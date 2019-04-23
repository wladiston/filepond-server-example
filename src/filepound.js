// eslint-disable-next-line import/no-unresolved
import {AWS_BUCKET, AWS_ENDPOINT} from '@env'
import express from 'express'
import bodyParser from 'body-parser'
import rp from 'request-promise-native'
import upload from './multer'
import {s3} from './aws'

// eslint-disable-next-line babel/new-cap
const router = express.Router()
const textParser = bodyParser.text({type: 'text/plain'})

/**
 * Delete the file passed by the payload
 * see: https://pqina.nl/filepond/docs/patterns/api/server/#revert
 */
router.delete('/', textParser, (req, res) => {
  s3.deleteObject({Bucket: AWS_BUCKET, Key: req.body}, err => {
    if (err) return res.send(err.stack)
    else return res.send()
  })
})

/**
 * Saves the file passed using the filepond filed
 * see: https://pqina.nl/filepond/docs/patterns/api/server/#process
 */
router.post('/', upload.single('filepond'), (req, res) => {
  return res.send(req.file.key)
})

/**
 * Used to download a file from a URL and upload it to as a normal process file
 * see: https://pqina.nl/filepond/docs/patterns/api/server/#fetch
 * @param {*} req Express request
 * @param {*} res Express response
 */
const fetch = async (req, res) => {
  const url = req.query.fetch
  const postURL = `${req.protocol}://${req.get('host') + req.originalUrl}`
  const options = {
    method: 'POST',
    url: postURL,
    formData: {filepond: rp(url)},
  }
  const result = await rp(options)
  const header = await rp({
    url: `${AWS_ENDPOINT}/${result}`,
    method: 'GET',
    resolveWithFullResponse: true,
  })

  const headers = {
    'Access-Control-Expose-Headers':
      'Content-Disposition, Content-Length, X-Content-Transfer-Id',
    'X-Content-Transfer-Id': result,
  }
  res.set(headers)
  return res.send(header.body)
}

/**
 * This is basicaly a router for the GET methods
 */
router.get('/', (req, res) => {
  if (req.query.fetch) {
    return fetch(req, res)
  } else {
    return res.send()
  }
})

export default router
