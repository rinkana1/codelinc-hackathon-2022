import { Command } from '../../Interfaces';
import * as fs from 'fs'

export const command: Command = {
    name: 'deletecomp',
    run: async(args) => {
        fs.readFile('src/DB/compdata.json', 'utf8', function readFileCallback(err, data){
            if (err){
                console.log(err);
            } else {
                
            const obj = JSON.parse(data);

            let id = parseInt(args[0]);

            for (let i = 0; i < obj.companies.length; i++) {
                if (obj.users[i].id === id) {
                    obj.users.splice(i, 1);
                }
            }

            const json = JSON.stringify(obj);
            fs.writeFile('src/DB/compdata.json', json, (err) => {
                if (err) throw err;
            });
        }});

    }
}