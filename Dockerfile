FROM node:18-alpine

WORKDIR /app

COPY ./package.json ./yarn.lock ./

RUN yarn install && \
    yarn cache clean --force

COPY . .

COPY orm.config.ts /app/orm.config.ts

RUN apk add --no-cache curl

RUN yarn build

# Open App port 
EXPOSE 8000

# Define a health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 CMD curl --fail http://0.0.0.0:8000/health || exit 1

COPY init-db.sh /docker-entrypoint-initdb.d/init-db.sh
# Set executable permissions for init-db.sh
RUN chmod +x /docker-entrypoint-initdb.d/init-db.sh

# Start app
CMD sleep 5 && yarn express
