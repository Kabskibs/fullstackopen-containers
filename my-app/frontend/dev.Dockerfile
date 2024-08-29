FROM node:20

WORKDIR /usr/src/app

COPY . .

ENV BACKEND_URL=http://localhost:3003

RUN npm install

CMD ["npm", "run", "dev", "--", "--host"]
