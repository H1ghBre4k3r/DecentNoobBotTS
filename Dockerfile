FROM node:13.1

WORKDIR /app

COPY ./build/ /app/
COPY ./node_modules /app/node_modules

# CMD ["node", ""]

ENTRYPOINT ["node", "/app/index.js"]%