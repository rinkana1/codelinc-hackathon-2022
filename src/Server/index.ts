import { Command } from '../Interfaces';
import * as path from 'path';
import { readdirSync } from 'fs';
import * as custom from 'events';
import * as readline from 'readline';
import { stdin, stdout } from 'process';
const bodyParser = require('body-parser');
const express = require('express');
const server = new custom.EventEmitter();
const app = express();
app.use(bodyParser.json());
const port = 8080


class Server {
    public commands: Map<string, Command> = new Map();
    public aliases: Map<string, Command> = new Map();
    public events: Map<string, Event> = new Map();

    public async init() {
        app.get('/', (req: any, res: any) => {
            res.send('Hello World')
        })

        app.get('/userdata/:user', async (req: any, res: any) => {
            const userID = req.params.user;
            let data: string;

            try {
                data = await (this.commands.get('getuserdata') as Command).run([userID]);
            } catch (err) {
                console.error(err)
            }

            res.send(data)
        })

        app.get('/jobposting', async (req: any, res: any) => {
            let query = req.query.tags;
            query = query.split(',')
            let data: string;

            try {
                data = await (this.commands.get('getjobdata') as Command).run(query)
            } catch (err) {
                console.error(err)
            }

            res.send(data);
        })

        app.post('/quizresults', (req: any, res: any) => {
            console.log(req.body);
            res.status(200);
            res.send();
        })

        app.listen(port, () => {
            console.log(`App listening on port ${port}`)
        })

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
}

export default Server;