import * as express from 'express';
import * as http from 'http';
import { container } from './inversify.config';
import { WebApi, WebApiToken } from './web-api';

const app: express.Express = express();
const server: http.Server = http.createServer(app);

const webApi: WebApi = container.get<WebApi>(WebApiToken);
webApi.installRoutes(server, app);

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});