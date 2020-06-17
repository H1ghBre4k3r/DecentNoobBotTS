FROM node:alpine

WORKDIR /app

COPY ./build/ /app/
COPY ./node_modules /app/node_modules

RUN mkdir /app/storage

# CMD ["node", ""]

ENTRYPOINT ["node", "/app/index.js"]