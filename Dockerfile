# Use base Node.js image
FROM node:16

# Create a folder of app inside image
WORKDIR /usr/src/app

# Install deps
COPY ./package.json ./yarn.lock .
COPY orm.config.ts .
COPY ./tsconfig.json .
COPY ./src/migrations ./migrations
RUN yarn install

# Copy all files
COPY . .
# Build project
RUN yarn build


COPY dist ./dist
COPY dist/orm.config.js ./dist/orm.config.js

ENV POSTGRES_PASSWORD=password123
ENV POSTGRES_URL=postgres://node_rdb:password123@postgres-db:5432/node_rdb
ENV MIKRO_ORM_DB_NAME=node_rdb
ENV MIKRO_ORM_USER=node_rdb
ENV MIKRO_ORM_PASSWORD=password123
ENV MIKRO_ORM_HOST=postgres-db

# Open App port 
EXPOSE 8000

# Start app
CMD yarn express
