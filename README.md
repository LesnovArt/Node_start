# Node_start

Pet project for learning how to use node.js

## Top scanner run

To run top process scanner run command `npm run top:scan`.
It will be looking after the most heavy process, updating data 10 time/sec and writing it into the `activityMonitor.log` file one a minute

## Custom EventEmitter class

Custom event emitter class is just the simplest implementation of some base staff of Node.js EventEmitter. For testing it's work you can run command `npm run class:emitter` and check logs.

## WithTime class

WithTime class extends from EventEmitter class and aimed to calculate time of request and log some details on `start`, `end` or `error` events, pushing some useful payload back. For checking it's functionality, try command `npm run withtime:emitter`.

## CsvToJson

This small util takes .csv file from docs directory and converts it to .txt, making it line by line. It also is watching after possible errors while reading the data through readable stream. To test it, run command `npm run stream:csvtojson`

## User API

User API implements some base api-calls. It is a part of `server` folder.
To run server you should

- `yarn build`
- `yarn server`

In case you need developer mode try `yarn server:dev`, which use `tsc --watch & nodemon ...` via `concurrently` and watch after all changes in these folders.

In case you want to test it without postman, you can just check in browser after `build` and `run server` commands:

- `http://localhost:8080/users` for GET all users without hobbies;
- `http://localhost:8080/users/1` for GET mocked user with id 1 without hobbies;
- `http://localhost:8080/users/1` for GET generated HATEOAS link;
- `http://localhost:8080/users/1/hobbies` for GET mocked user hobbies list;

In case you need to test other methods you should:

- check `src/server/server-test.ts`, which contains some friendly utils, with which you can try each endpoint
- run server
- use instruction inside `src/server/server-test.ts`
- open separate terminal
- run `yarn server:test`
- check the result inside server terminal
- check the result in the browser

## SHOP API

SHOP API implements some base api-calls on express framework. It is a part of `express` folder.
To run express you should

- `yarn build`
- `yarn express`

In case you need developer mode try `yarn express:dev`, which use `tsc --watch & nodemon ...` via `concurrently` and watch after all changes in these folders.

In case you want to test it without postman, you can just check in browser after `build` and `run express` commands:

- `http://localhost:8080/products` for GET all products;
- `http://localhost:8080/products/1` for GET mocked product with id 1;
- `http://localhost:8080/profile/cart` for GET user cart or generate it in case it was not still created;

## Data base

To run DB you should build the project - `yarn build`. Build and up docker image - `docker-compose up --build`. Now you are able just to start server with `yarn express`.

## Data base migration

To create migration, build app with `yarn build`, run DB docker image with `docker-compose up`, run command `yarn migrate:cr`.

To use this generated schema run `yarn build`, then `yarn migrate:up`.

## MicroOrm

To create microOrm run `yarn orm:create`

## Seed the data base

Put the data into corresponding files inside `express/mocks` folder. Build the app. Run DB (check the DATA BASE block to do it). Run command `yarn seed:db`.

## Logging and Debugging

- `yarn debug` - node debug for developer mode
- `yarn debug:prod` - node debug for prod mode (has no bunyan logger)
- `yarn debug:auth` - node debug for auth in developer mode
- `yarn debug:connect` - node debug for connection stuff in developer mode

## Docker

- run docker desktop or similar
- run `docker-compose up --build` for first run and `docker-compose up` later.
