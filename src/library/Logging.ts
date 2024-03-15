import chalk from "chalk";
import fs from "fs";

export default class Logging {
  logFile = "../log.txt";

  public static log = (args: any) => this.info(args);
  public static info = (args: any) => {
    console.log(
      chalk.blue(`[${new Date().toLocaleString()}] [INFO]`),
      typeof args === "string" ? chalk.blue(args) : args
    );
    fs.appendFile("log.txt", `${args}  \n`, (err) => {
      if (err) throw err;
    });
  };

  public static warning = (args: any) => {
    console.log(
      chalk.yellow(`[${new Date().toLocaleString()}] [WARN]`),
      typeof args === "string" ? chalk.yellow(args) : args
    );
    fs.appendFile("log.txt", `${args}  \n`, (err) => {
      if (err) throw err;
    });
  };
  public static error = (args: any) => {
    console.log(
      chalk.red(`[${new Date().toLocaleString()}] [ERROR]`),
      typeof args === "string" ? chalk.red(args) : args
    );
    fs.appendFile("log.txt", `${args}  \n`, (err) => {
      if (err) throw err;
    });
  };
}
