FROM node:14-alpine

RUN apk --update add tzdata && \
  cp /usr/share/zoneinfo/Europe/Paris /etc/localtime && \
  echo "Europe/Paris" > /etc/timezone && \
  apk del tzdata && rm -rf /var/cache/apk/*

RUN mkdir -p /app

WORKDIR /app

COPY ./package.json ./package-lock.json ./nuxt.config.js ./
COPY ./node_modules ./node_modules/
COPY ./.nuxt ./.nuxt

ENV NODE_ENV=production
ENV HOST 0.0.0.0

EXPOSE 4000

CMD [ "npm", "start" ]
