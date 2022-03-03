FROM node:fermium-stretch-slim AS builder
EXPOSE 9000

WORKDIR /app
COPY . .
RUN echo "GATSBY_IO_URL=https://www.substrate.io\nGATSBY_DOCS_URL=http://localhost:9000" \
  > .env.production
RUN yarn install && yarn build
CMD ["yarn", "gatsby", "serve", "-H", "0.0.0.0"]
