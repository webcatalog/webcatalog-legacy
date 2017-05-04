import AWS from 'aws-sdk';
import S3 from 'aws-sdk/clients/s3';
import express from 'express';

const s3Route = express.Router();

const s3 = new S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  region: 'us-east-1',
});

s3Route.get('/:name.:ext', (req, res, next) => {
  res.setHeader('Cache-Control', `public, max-age=${3600 * 24 * 30}`); // cache 1 month

  if (['png', 'webp', 'icns', 'ico'].indexOf(req.params.ext) < 0) {
    next(new Error('404'));
    return;
  }

  s3.getObject({
    Bucket: process.env.S3_BUCKET,
    Key: `${req.params.name}.${req.params.ext}`,
  }, (err, data) => {
    if (err) {
      next(err.code === 'NoSuchKey' ? new Error('404') : err);
    } else {
      res.setHeader('Last-Modified', data.LastModified);
      res.setHeader('Content-Length', data.ContentLength);
      res.setHeader('ETag', data.ETag);
      res.setHeader('Content-Type', data.ContentType);
      const imgStream = AWS.util.buffer.toStream(data.Body);
      imgStream.pipe(res);
    }
  });
});

module.exports = s3Route;
