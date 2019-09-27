// tslint:disable: no-console

import chalk from 'chalk';

export const warning = chalk.keyword('orange');
export const error = chalk.bold.red;
export const log = chalk.dim.white;

export class Logger {
  public log(message: string | object) {
    if (typeof message === 'object') {
      message = JSON.stringify(message, null, 4);
    }

    console.log(log(message));
  }

  public error(message: string) {
    console.log(error(message));
  }

  public warning(message: string) {
    console.log(warning(message));
  }
}

export const logger = new Logger();
