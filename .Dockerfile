FROM node:20-alpine as development

RUN apt-get update && apt-get install -y openssl

WORKDIR /app

COPY --chown=node:node package*.json ./

RUN npm install

COPY --chown=node:node . .

RUN npm run build --if-present

CMD ["npm", "run", "start:dev"]

FROM node:20-alpine as build

RUN apt-get update && apt-get install -y openssl

WORKDIR /app

COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=development /app/node_modules ./node_modules
COPY --chown=node:node . .

RUN npm run build --if-present

ENV NODE_ENV production

RUN npm ci --omit=dev && npm cache clean --force

USER node

FROM node:20-alpine as production

RUN apk upgrade --update-cache --available && \
    apk add openssl && \
    rm -rf /var/cache/apk/*

WORKDIR /app

COPY --chown=node:node package*.json ./
COPY --chown-node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/dist ./dist
COPY --chown=node:node --from=build /app/prisma ./prisma

RUN npx prisma generate

EXPOSE 3000

CMD ["node", "dist/main.js"]