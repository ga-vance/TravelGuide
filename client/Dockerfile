# the web-hosting server dockerfile
FROM alpine:latest

RUN apk add --upgrade nodejs npm && \
    mkdir -p /var/www/html/js /var/www/html/css /opt/nodeserver && \
    adduser -S -s /bin/sh -h /opt/nodeserver node

COPY public/*.html /var/www/html/
ADD public/js /var/www/html/js
ADD public/css /var/www/html/css

WORKDIR /opt/nodeserver/

COPY index.js package.json /opt/nodeserver/

RUN npm install && chown -R node: /var/www/html

USER node

CMD ["npm", "start"]
