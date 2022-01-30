FROM nginx
LABEL name="webserver"
LABEL version="0.0.1"
COPY src/.vuepress/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
