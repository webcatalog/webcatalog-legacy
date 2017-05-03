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

  let contentType;
  switch (req.params.ext) {
    case 'png': {
      contentType = 'image/png';
      break;
    }
    case 'webp': {
      contentType = 'image/webp';
      break;
    }
    case 'ico': {
      contentType = 'image/vnd.microsoft.icon'; // real ico, not favicon image/x-icon
      break;
    }
    case 'icns': {
      contentType = 'image/icns';
      break;
    }
    default: {
      contentType = 'application/octet-stream';
    }
  }
  res.setHeader('Content-Type', contentType);

  const imgStream = s3.getObject({
    Bucket: process.env.S3_BUCKET,
    Key: `${req.params.name}.${req.params.ext}`,
  }).createReadStream().on('error', next);

  imgStream.pipe(res);
});

module.exports = s3Route;
