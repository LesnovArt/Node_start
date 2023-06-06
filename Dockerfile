# Use base Node.js image
FROM node:16

# Install MongoDB
RUN apt-get update && apt-get install -y wget gnupg
RUN wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | apt-key add -
RUN echo "deb http://repo.mongodb.org/apt/debian buster/mongodb-org/5.0 main" | tee /etc/apt/sources.list.d/mongodb-org-5.0.list
RUN apt-get update && apt-get install -y mongodb-org

# Create a folder of app inside image
WORKDIR /usr/src/app

# Install deps
COPY ./package.json ./yarn.lock .
COPY ./migrate-mongo-config.js .
COPY ./src/express/data-layer/migrations ./migrations
RUN yarn install

# Install mongoose
RUN yarn add mongoose

# Copy all files
COPY . .

# Build project
RUN yarn build

COPY dist ./dist

ENV MONGODB_URL=mongodb://mongodb:27017/express-mongoDB

# Open App port 
EXPOSE 3000

# Start app
CMD sleep 10 && yarn express
