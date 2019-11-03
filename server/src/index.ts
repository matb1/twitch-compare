import * as express from 'express';
import * as http from 'http';

const app: express.Express = express();

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

const server: http.Server = http.createServer(app);

server.listen(8080, () => {
  console.log('Listening on port 8080.');
});