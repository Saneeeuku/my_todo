FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY ./dist ./dist

COPY . .

CMD ["npm", "run", "start:dev" ]

LABEL authors="Saneeeuku"
