FROM node:18-alpine

WORKDIR /app

COPY package.json .

RUN npm install

RUN npm i -g serve

COPY . .

ARG VITE_BACKEND_API
ARG VITE_BACKEND_HUB

ENV VITE_API_URL=$VITE_BACKEND_API
ENV VITE_ENV=$VITE_BACKEND_HUB

RUN npm run build

EXPOSE 3000

CMD [ "serve", "-s", "dist" ]