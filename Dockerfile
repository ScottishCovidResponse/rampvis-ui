FROM nginx:1.21-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY out /usr/share/nginx/html
