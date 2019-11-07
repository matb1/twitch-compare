# Use this Dockerfile to build the production Docker image for deployment

# Build stage
FROM node:12-alpine AS build-env
RUN npm install -g @angular/cli
ADD server /app/twitch-compare/server
ADD client /app/twitch-compare/client
RUN cd /app/twitch-compare/server && rm -rf node_modules && npm i && npm run build && npm prune --production
RUN cd /app/twitch-compare/client && rm -rf node_modules && npm i && npm run build_prod

# Production stage
FROM node:12-alpine
WORKDIR /app/twitch-compare
COPY --from=build-env /app/twitch-compare/client/dist/client /app/twitch-compare/client/dist/client
COPY --from=build-env /app/twitch-compare/server/dist /app/twitch-compare/server/dist
COPY --from=build-env /app/twitch-compare/server/node_modules /app/twitch-compare/server/node_modules
COPY --from=build-env /app/twitch-compare/server/package.json /app/twitch-compare/server/package.json
CMD ["node", "/app/twitch-compare/server/dist/index.js"]