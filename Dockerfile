FROM node:14-alpine as node

RUN apk --update add tzdata && \
  cp /usr/share/zoneinfo/Europe/Paris /etc/localtime && \
  echo "Europe/Paris" > /etc/timezone && \
  apk del tzdata && rm -rf /var/cache/apk/*

FROM node as dependencies

RUN mkdir -p /app

WORKDIR /app

COPY ./package.json ./yarn.lock ./

RUN yarn install --production --frozen-lockfile --non-interactive && yarn cache clean

FROM dependencies as start

ENV NODE_ENV=production

COPY ./nuxt.config.js ./

COPY ./.nuxt ./.nuxt

ENV HOST 0.0.0.0

EXPOSE 4000

CMD [ "yarn", "start" ]
