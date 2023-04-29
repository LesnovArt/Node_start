// scan top activity on:
// HINT  Unix-like OS ps -A -o %cpu,%mem,comm | sort -nr | head -n 1
// HINT Windows powershell "Get-Process | Sort-Object CPU -Descending | Select-Object -Property Name, CPU, WorkingSet -First 1 | ForEach-Object { $_.Name + ' ' + $_.CPU + ' ' + $_.WorkingSet }"

import { spawn, exec } from "child_process";
import readline from "readline";
import chalk from "chalk";
import fs from "fs";

function logOnNewLine(fn) {
  readline.clearLine(process.stdout, 0);
  readline.cursorTo(process.stdout, 0);
  fn();
}

function getCommand() {
  return process.platform === "win32"
    ? "powershell \"Get-Process | Sort-Object CPU -Descending | Select-Object -Property Name, CPU, WorkingSet -First 1 | ForEach-Object { $_.Name + ' ' + $_.CPU + ' ' + $_.WorkingSet }\""
    : "ps -A -o %cpu,%mem,comm | sort -nr | head -n 1";
}

function listenActivity(command) {
  return new Promise((resolve, reject) => {
    const process = spawn(command, { shell: true });
    let log = "";

    process.stdout.on("data", (data) => {
      log += data.toString();
    });

    process.stdout.on("error", (error) => {
      console.log(chalk.bgRedBright(`Activity Monitor exit with Error: ${error}`));
      reject(error);
    });

    process.stdout.on("close", () => {
      resolve(log.trim());
    });
  });
}

async function displayActivity() {
  const command = getCommand();
  const program = await listenActivity(command);

  logOnNewLine(() =>
    process.stdout.write(chalk.bgWhiteBright(`TOP PROCESS: ${JSON.stringify(program)} \r`))
  );
}

function writeFile(log) {
  fs.appendFileSync("activityMonitor.log", log);
}

function writeActivity() {
  logOnNewLine(() => console.log(chalk.blue("Start writing logs to activityMonitor.log file ...")));
  const command = getCommand();

  exec(command, (error, stdout) => {
    if (error) {
      const errorLog = `Activity Monitor write failed with Error: ${JSON.stringify(error)}`;

      console.log(chalk.bgRedBright(errorLog));
      writeFile(errorLog);
      return;
    }

    const log = `${Date.now()}: ${stdout}`;
    writeFile(log);
    logOnNewLine(() => console.log(chalk.green("File activityMonitor.log was updated")));
  });
}

const LOG_DISPLAY_INTERVAL = 100;
const LOG_WRITE_INTERVAL = 60000;

// run monitoring with update 10 times per sec
setInterval(displayActivity, LOG_DISPLAY_INTERVAL);
console.log(chalk.blue("Activity Monitor"));
console.log(chalk.yellow("Press Ctrl+C to exit"));

// run log writing once per minute
setInterval(writeActivity, LOG_WRITE_INTERVAL);
