// eslint-disable-next-line import/no-unresolved
import {AWS_SECRET_ACCESS_KEY, AWS_ACCESS_KEY_ID, AWS_REGION} from '@env'
import aws from 'aws-sdk'

aws.config.update({
  // Your SECRET ACCESS KEY from AWS should go here,
  // Never share it!
  // Setup Env Variable, e.g: process.env.SECRET_ACCESS_KEY
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  // Not working key, Your ACCESS KEY ID from AWS should go here,
  // Never share it!
  // Setup Env Variable, e.g: process.env.ACCESS_KEY_ID
  accessKeyId: AWS_ACCESS_KEY_ID,

  region: AWS_REGION, // region of your bucket
})

export const s3 = new aws.S3()
