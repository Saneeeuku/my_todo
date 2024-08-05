FROM node:22

WORKDIR /app

COPY ./package*.json ./

RUN npm ci

COPY ./dist/apps/my_todo ./dist/apps/my_todo

COPY . .

CMD ["npm", "run", "start:dev" ]

LABEL authors="Saneeeuku"
