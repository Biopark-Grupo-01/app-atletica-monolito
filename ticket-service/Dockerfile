FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=build /app/package*.json ./

RUN npm install --only=production

COPY --from=build /app/dist ./dist

EXPOSE 3002

CMD ["node", "dist/main"]