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
