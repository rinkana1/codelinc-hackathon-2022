interface Run {
    (args?: string[]): any;
}

export interface Command {
    name: string;
    description?: string;
    aliases?: string[];
    run: Run;
}