FROM nginx
LABEL name="webserver"
LABEL version="0.0.1"
COPY src/.vuepress/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
VOLUME [ "/certs" ]
VOLUME [ "/usr/share/nginx/html" ]
EXPOSE 80
EXPOSE 443
