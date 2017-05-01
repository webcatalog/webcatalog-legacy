import S3 from 'aws-sdk/clients/s3';
import express from 'express';

const s3Route = express.Router();

const s3 = new S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  region: 'us-east-1',
});

s3Route.get('/:key', (req, res, next) => {
  res.setHeader('Cache-Control', `public, max-age=${3600 * 24 * 30}`); // cache 1 month

  const imgStream = s3.getObject({
    Bucket: process.env.S3_BUCKET,
    Key: req.params.key,
  }).createReadStream().on('error', next);

  imgStream.pipe(res);
});

module.exports = s3Route;
