FROM node:lts-alpine

WORKDIR /app
COPY package.json .
RUN yarn install
COPY . .
RUN npx prisma generate

CMD ["yarn", "prod"]