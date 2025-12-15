FROM node:lts-alpine3.23

WORKDIR /app

COPY package*.json .
COPY tsconfig*.json .

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm" ,"run", "prod"]