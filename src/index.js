import express from 'express';

const app = express();

app.set('port', (process.env.PORT || 5000));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});
