FROM node:14 AS builder
EXPOSE 9000

WORKDIR /app
COPY . .
RUN yarn install && yarn build
CMD ["yarn", "gatsby", "serve", "-H", "0.0.0.0"]
