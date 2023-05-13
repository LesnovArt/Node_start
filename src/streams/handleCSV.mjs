import chalk from "chalk";

import fs from "fs";
import csvtojson from "csvtojson";
import { pipeline } from "stream";
import path from "path";

const getDirname = () => {
  const __filename = new URL(import.meta.url).pathname;
  return path.dirname(__filename);
};

const csvFilePath = path.join(getDirname(), "docs/test_csv.csv");
const txtFilePath = path.join(getDirname(), "docs/fromCsv.txt");

pipeline(
  fs.createReadStream(csvFilePath),
  csvtojson(),
  fs.createWriteStream(txtFilePath),
  (error) => {
    if (error) {
      console.log(chalk.bgRedBright(`Error occurs while processing csv file. Error: ${error}`));
    } else {
      console.log(chalk.bgGreenBright(`CSV file was successfully converted and written`));
    }
  }
);
