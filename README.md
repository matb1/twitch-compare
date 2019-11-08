# twitch-compare
Web dashboard for comparing the viewer count of Twitch games in real-time.


# Web API
**twitch-compare** exposes a simple web API, supporting both HTTP requests and WebSockets (via Socket.IO).

## HTTP GET `/twitch/stats{?gameId*}`
- Get the stats from one or more games streamed on Twitch.
- Returns an array of stats of the form `{ gameId: string, viewerCount: number }`
- Example response: `[{"gameId":"460630","viewerCount":7498},{"gameId":"497078","viewerCount":32}]`
> Multiple `gameId` query parameters can be provided, e.g., `/twitch/stats?gameId=460630&gameId=506274`. If `gameId` is not provided, the returned stats are for *Assassin's Creed Odyssey*, *Far Cry 5*, and *Tom Clancy's Rainbow Six: Siege*

## WSS `/twitch/stats`
- Get the real-time stats for *Assassin's Creed Odyssey*, *Far Cry 5*, and *Tom Clancy's Rainbow Six: Siege*.
- Returns an array of stats of the form `{ gameId: string, viewerCount: number }`
- Example message: `[{"gameId":"460630","viewerCount":5453},{"gameId":"506274","viewerCount":257},{"gameId":"497078","viewerCount":44}]`

> The WebSocket API is available via the Socket.IO protocol by connecting to `/` and registering to `/twitch/stats` messages.

> The **twitch-compare** client uses the WebSocket API to fetch the stats from the backend in real-time.

# Development

Development for **twitch-compare** is simplified by using a Dockerized development environment. By using the [Visual Studio Code](https://code.visualstudio.com/) editor and the *Remote - Containers* extension (`ms-vscode-remote.remote-containers`), it is easy to get started with development. Simply open the editor and you should be prompted to open the workspace in a Docker container already set up with node.js and the Angular CLI. For more information, see the `Dockerfile` and `devcontainer.json` files under `/.devcontainer`. You can also read the Visual Studio Code documentation on [developing inside a container](https://code.visualstudio.com/docs/remote/containers).
> Development is still possible without using the dev container, by installing node.js and the Angular CLI on your development PC.

**twitch-compare** has two parts: a web server (under `/server`) and a web UI (under `/client`). Before running **twitch-compare** you need to build both parts.

## Building and testing the client
1. `cd client`

2. `npm i`

3. `npm run build`

4. `npm run test`

## Building and testing the server
1. `cd server`

2. `npm i`

3. `npm run build`

4. `npm run test`

## Running twitch-compare
After both the client and server are built, you can run **twitch-compare** with the following commands:

1. `cd server`

2. `npm run start`

> **IMPORTANT** You need to set the `TWITCH_CLIENT_ID` environment variable with your Twitch developer client ID. Failure to do so will prevent the server from making successful calls to the [Twitch API](https://dev.twitch.tv/docs/api).

> The listening port of the server can be configured with the `PORT` environment variable. It uses 8080 by default. Remember to update the app port in `/.devcontainer/devcontainer.json` if you are using the dev container.

## Building the production image
**twitch-compare** is deployed in a Docker container. The Dockerfile used to build the production image is at the root of the project (`/Dockerfile`).

`docker build -t twitch-compare .`

You can then instantiate a new container from this image with the `docker run` command.

`docker run -e TWITCH_CLIENT_ID=mytwitchclientid -p 8080:8080 twitch-compare`

> These commands need to run outside of the dev container.