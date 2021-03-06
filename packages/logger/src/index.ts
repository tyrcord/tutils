// tslint:disable: no-console

import chalk from 'chalk';

export const warning = chalk.keyword('orange');
export const error = chalk.red;
export const log = chalk.white;
export const success = chalk.green;

export class Logger {
  public log(message: string | object): void {
    console.log(log(this.formatMessage(message)));
  }

  public error(message: string | object): void {
    console.log(error(this.formatMessage(message)));
  }

  public warning(message: string | object): void {
    console.log(warning(this.formatMessage(message)));
  }

  public success(message: string | object): void {
    console.log(success(this.formatMessage(message)));
  }

  private formatMessage(message: string | object): string {
    if (typeof message === 'object') {
      message = JSON.stringify(message, null, 4);
    }

    return message;
  }
}

export const logger = new Logger();
