import { Command } from '../../Interfaces';

export const command: Command = {
    name: 'closeserver',
    run: async() => {
        process.exit(0);
    }
}