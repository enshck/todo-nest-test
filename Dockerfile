FROM node:12.22-alpine3.15

ARG NODE_ENV=develop
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 5000
CMD [ "npm", "start" ]