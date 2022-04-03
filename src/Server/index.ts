import { Command } from '../Interfaces';
import * as path from 'path';
import * as http from 'http';
import { readdirSync } from 'fs';
import * as custom from 'events';
import * as readline from 'readline';
import { stdin, stdout } from 'process';
const server = new custom.EventEmitter();


class Server {
    public commands: Map<string, Command> = new Map();
    public aliases: Map<string, Command> = new Map();
    public events: Map<string, Event> = new Map();
    public srvr: any;

    public async init() {
        this.srvr = http.createServer(function (req, res) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end('Hello World!');
          }).listen(8090);

        // Commands
        const commandPath = path.join(__dirname, "..", "Commands");
        readdirSync(commandPath).forEach((dir) => {
            const commands = readdirSync(`${commandPath}/${dir}`).filter((file) => file.endsWith('.ts'));

            for (const file of commands) {
                try {
                    const { command } = require(`${commandPath}/${dir}/${file}`)
                    this.commands.set(command.name, command);

                    if(command.aliases) {
                        command.aliases.forEach((alias: any) => {
                            this.aliases.set(alias, command)
                        })
                    }

                    console.log(`Loaded command "${command.name}" (${commandPath}/${dir}/${file})`);
                } catch (err: any) {
                    console.log(`Failed to load command ${commandPath}/${dir}/${file}.`);
                    console.error(err);
                }
            }
        })

        // Events
        const eventPath = path.join(__dirname, "..", "Events");
        readdirSync(eventPath).forEach(async (file) => {
            try{
                const { event } = await import(`${eventPath}/${file}`);
                this.events.set(event.name, event)
                console.log(`Loaded event "${event.name}" (${eventPath}/${file})`)
                server.on(event.name, event.run.bind(null, this));
            } catch (err:any) {
                console.log(`Failed to load command ${eventPath}/${file}.`);
                console.error(err);
            }
        })

        this.enterCommand();
    }

    enterCommand() {
        const rl = readline.createInterface({
            input: stdin,
            output: stdout
        });

        const parent = this;

        rl.question('Enter Command: ', function (input: string) {
            const args: string[] = input.split(' ')
            const cmd = args.shift()?.toLowerCase();
            const command = parent.commands.get(cmd);
            if (!command) return rl.close();

            console.log(`Called command "${command.name}"`)

            try {
                (command as Command).run(args);
            } catch (err) {
                console.log(`Server ran into an error while issuing a command.`)
                console.error(err);
            }
            rl.close()
        })
        rl.on('close', () => this.enterCommand());
    }

    closeServer() {
        this.srvr.close();
    }
}

export default Server;