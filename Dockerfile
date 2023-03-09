# syntax=docker/dockerfile:1

FROM node:18-alpine
WORKDIR /socale-backend-server
COPY . .
RUN npm install --production
CMD ["npm", "run", "prod"]
EXPOSE 3000
