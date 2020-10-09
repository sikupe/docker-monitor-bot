FROM node:13
WORKDIR /app
COPY . /app

RUN npm install
RUN npm run-script build
CMD node dist/index.js