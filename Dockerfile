FROM node:10-slim

USER node

RUN mkdir -p /home/node/sis-est-api-node-express

WORKDIR /home/node/sis-est-api-node-express

COPY --chown=node package*.json ./

RUN npm install

COPY --chown=node . .

ENV NODE_ENV=development APP_PORT=3000 APP_HOST=0.0.0.0 JWT_SECRET=secret

CMD [ "npm", "start" ]
