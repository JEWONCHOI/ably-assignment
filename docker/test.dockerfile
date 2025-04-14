FROM node:20-alpine AS test

WORKDIR /app

COPY package*.json ./
RUN npm install --silent

RUN apk add --no-cache bash

COPY . .
RUN chmod +x ./wait-for-it.sh
RUN chmod +x ./run-migration-and-test.sh

CMD ["./run-migration-and-test.sh"]
