FROM node:21-alpine as build

WORKDIR /app

COPY ["package.json", "package-lock.json", ".env", "./"]

COPY ./src ./src

RUN npm install

FROM node:21-alpine as develop

WORKDIR /app

COPY --from=build /app /app

CMD ["npm", "run", "dev"]

FROM node:21-alpine as production

WORKDIR /app

COPY --from=build /app /app

CMD ["npm", "run", "start"]