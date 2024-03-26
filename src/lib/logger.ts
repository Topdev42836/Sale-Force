export class Logger {
  private level: number;
  private levels: any = {
    DEBUG: 1,
    INFO: 2,
    WARN: 3,
    ERROR: 4,
    FATAL: 5,
  };

  constructor(level: string) {
    this.level = this.levels[level];
  }

  info(...message: any[]) {
    if (this.level <= this.levels.INFO) {
      console.info(message);
    }
  }

  debug(...message: any[]) {
    if (this.level <= this.levels.DEBUG) {
      console.log(message);
    }
  }

  warn(...message: any[]) {
    if (this.level <= this.levels.WARN) {
      console.warn(message);
    }
  }

  error(...message: any[]) {
    if (this.level <= this.levels.ERROR) {
      console.error(message);
    }
  }

  fatal(...message: any[]) {
    if (this.level <= this.levels.FATAL) {
      console.error(message);
    }
  }
}

export default Logger;
