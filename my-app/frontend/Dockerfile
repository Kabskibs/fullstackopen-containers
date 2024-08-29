FROM node:20 AS build-stage

WORKDIR /usr/src/app

ENV BACKEND_URL=http://localhost:3003

COPY . .

RUN npm ci

RUN npm run build

# ---

FROM nginx:1.25-alpine

COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html
