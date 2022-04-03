import { Command } from '../../Interfaces';
import * as fs from 'fs'

export const command: Command = {
    name: 'editcomptags',
    run: async(args) => {
        fs.readFile('src/DB/compdata.json', 'utf8', function readFileCallback(err, data){
            if (err){
                console.log(err);
            } else {
                
            const obj = JSON.parse(data);

            let id = parseInt(args[0]);

            for (let i = 0; i < obj.companies.length; i++) {
                if (obj.companies[i].id === id) {
                    obj.companies[i].tags.push(args.slice(1));
                    break;
                }
            }

            const json = JSON.stringify(obj);
            fs.writeFile('src/DB/compdata.json', json, (err) => {
                if (err) throw err;
            });
        }});

    }
}