export interface Logger {
  info(message: string, ...rest: any[]): void;
  warn(message: string, ...rest: any[]): void;
  error(message: string, ...rest: any[]): void;
};

const log = (level: string, tag: string, message: string, ...rest: any[]) =>
  console[level].apply(console[level], [`[${tag}] ${message}`, ...rest]); // eslint-disable-line no-console

export default function create(tag: string): Logger {
  return {
    info: (message, ...rest) => log('log', tag, message, ...rest),
    warn: (message, ...rest) => log('warn', tag, message, ...rest),
    error: (message, ...rest) => log('error', tag, message, ...rest),
  }
}
