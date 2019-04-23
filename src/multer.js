// eslint-disable-next-line import/no-unresolved
import {AWS_BUCKET} from '@env'
import url from 'url'
import path from 'path'
import uuid from 'uuid/v4'
import multer from 'multer'
import multerS3 from 'multer-s3'
import {s3} from './aws'

const stripExtraData = (filename) => {
  try {
    const parsed = url.parse(filename);
    return path.basename(parsed.pathname).replace(/[/\\?%*:|"<>]/g, '-');
  } catch {
    // if fails to convert the filename then generate a new random name
    return uuid()
  }
}

const upload = multer({
  storage: multerS3({
    s3,
    bucket: AWS_BUCKET,
    acl: 'public-read',
    cacheControl: 'max-age=86400',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => {
      cb(null, {originalname: file.originalname, temp: 'true'})
    },
    key: (req, file, cb) => {
      cb(null, `${uuid()}/${stripExtraData(file.originalname)}`)
    },
  }),
})

export default upload
