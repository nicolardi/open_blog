FROM node:15.14.0-alpine3.10 as build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx
LABEL name="webserver"
LABEL version="0.0.1"
COPY --from=build src/.vuepress/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
VOLUME [ "/certs" ]
VOLUME [ "/usr/share/nginx/html" ]
EXPOSE 80
EXPOSE 443
