import { Command } from '../Interfaces';
import * as path from 'path';
import { readdirSync } from 'fs';
import * as readline from 'readline';
import { stdin, stdout } from 'process';
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
app.use(bodyParser.json());
app.use(express.static('public'))
app.use(express.static('files'))
const port = 8080


class Server {
    public commands: Map<string, Command> = new Map();
    public aliases: Map<string, Command> = new Map();
    public events: Map<string, Event> = new Map();

    public async init() {
        app.get('/', (req: any, res: any) => {
            res.sendFile(path.join(__dirname+'/..'+'/index.html'));
        })

        app.get('/userdata/:user', async (req: any, res: any) => {
            //const userID = req.params.user;
            //let data: string;

            try {
                //data = await (this.commands.get('getuserdata') as Command).run([userID]);
            } catch (err) {
                console.error(err)
            }

            res.sendFile(__dirname+"/profile.html")
        })

        app.get('/jobposting', async (req: any, res: any) => {
            //let query = req.query.tags;
            //query = query.split(',')
            //let data: string;

            try {
                //data = await (this.commands.get('getjobdata') as Command).run(query)
            } catch (err) {
                console.error(err)
            }
            
            res.sendFile(__dirname+'/jobposting.html');
        })

        app.get('/company/:comp', async (req:any, res:any) => {
            const company = req.params.comp;

            res.sendFile(__dirname + `/${company}.html`)
        })

        app.post('/quizresults', (req: any, res: any) => {
            console.log(req.body);
            const score = req.body;
            
            try {
                (this.commands.get('updatescores') as Command).run([score.user, score.score])
            } catch (err) {
                if (err) throw err;
            }

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