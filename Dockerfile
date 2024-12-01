FROM node:23-alpine
WORKDIR /app

COPY package*.json ./

RUN npm install -g @angular/cli
RUN npm ci --force
COPY . .

EXPOSE 4200
CMD ["ng", "serve", "--host", "0.0.0.0", "--ssl", "--ssl-cert", "certificates/ssl/localhost.crt", "--ssl-key", "certificates/ssl/localhost.key"]