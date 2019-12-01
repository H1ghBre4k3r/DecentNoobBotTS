FROM node:13.1

ENV BOT_TOKEN ${BOT_TOKEN}

WORKDIR /app

COPY ./build/ /app/
COPY ./node_modules /app/node_modules

# CMD ["node", ""]

ENTRYPOINT ["node", "/app/index.js"]%