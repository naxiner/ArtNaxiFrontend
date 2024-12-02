FROM node:23-alpine AS build

WORKDIR /app

COPY package*.json .
RUN npm install --force

COPY . .
RUN npm run build

FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY --from=build /app/dist/art-naxi-frontend/browser .

COPY nginx.conf /etc/nginx/conf.d/nginx.conf

COPY certificates/ssl/localhost.crt /etc/ssl/certs/localhost.crt
COPY certificates/ssl/localhost.key /etc/ssl/private/localhost.key

EXPOSE 4200

CMD ["nginx", "-g", "daemon off;"]