/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

Promise.resolve()
  .then(async () => {
    const s3Path = 'webcatalog-legacy.env';
    const s3Client = new S3Client({
      region: 'us-east-2',
    });

    console.log('Uploading to S3:', s3Path);

    const command = new PutObjectCommand({
      Bucket: 'cdn-1.webcatalog.io',
      Key: s3Path,
      Body: Buffer.from(JSON.stringify(process.env), 'utf8'),
    });
    await s3Client.send(command);
  })
  .catch((err) => {
    console.log(err);
  });
