import * as express from 'express';
import * as http from 'http';
import { container } from './inversify.config';
import { WebApi, WebApiToken } from './web-api';

const app: express.Express = express();

const webApi: WebApi = container.get<WebApi>(WebApiToken);
webApi.installRoutes(app);

const server: http.Server = http.createServer(app);

server.listen(8080, () => {
  console.log('Listening on port 8080.');
});