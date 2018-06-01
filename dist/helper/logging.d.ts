export interface Logger {
    info(message: string, ...rest: any[]): void;
    warn(message: string, ...rest: any[]): void;
    error(message: string, ...rest: any[]): void;
}
export default function create(tag: string): Logger;
