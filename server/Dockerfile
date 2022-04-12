# the api-endpint server dockerfile
FROM alpine:latest

RUN apk add --upgrade nodejs npm mysql-client && \
    mkdir -p /opt/nodeapi && \
    adduser -S -s /bin/sh -h /opt/nodeapi node

WORKDIR /opt/nodeapi/

COPY *.js package.json /opt/nodeapi/
RUN npm install && chown -R node: /opt/nodeapi

USER node
EXPOSE 3000

CMD ["npm", "start"]
