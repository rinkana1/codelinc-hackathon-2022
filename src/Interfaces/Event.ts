import Server from '../Server';

interface Run {
    (server: Server, ...args: any[]): any;
}

export interface Event {
    name: string;
    run: Run;
}