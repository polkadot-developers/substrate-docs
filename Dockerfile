FROM node:fermium-stretch-slim AS builder
EXPOSE 9000

WORKDIR /app
COPY . .
RUN echo "GATSBY_WEBSITE_URL=https://www.substrate.io\nGATSBY_DOCS_URL=http://localhost:9000\nGATSBY_MARKETPLACE_URL=https://marketplace.substrate.io\nGATSBY_CAREERS_URL=https://careers.substrate.io" \
  > .env.production
RUN yarn && yarn build
CMD ["yarn", "gatsby", "serve", "-H", "0.0.0.0"]
