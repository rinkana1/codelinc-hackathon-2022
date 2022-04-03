import { User, Command } from '../../Interfaces';
import * as userdata from '../../DB/userdata.json';
import * as compdata from '../../DB/compdata.json';
import * as fs from 'fs';
const users = userdata.users;
const comps = compdata.companies;

function createRandomID(): number {
    const id = Math.floor(Math.random() * 10000000000000000);

    if (!users.length) return id;

    for (let i = 0; i < users.length; i++) {
        if (users[i].id === id) return createRandomID();
    }

    for (let j = 0; j < comps.length; j++) {
        if (comps[j].id === id) return createRandomID();
    }

    return id;
}

export const command: Command = {
    name: 'createuser',
    run: async() => {
        // Create random ID and check if ID already exists.
        let id = createRandomID();

        let user: User = {
            'id': id,
            'username': null,
            'name': null,
            'tags': [],
            'location': null,
            'rating': null
        }

        users.push(user);

        fs.readFile('src/DB/userdata.json', 'utf8', function readFileCallback(err, data){
            if (err){
                console.log(err);
            } else {
            const obj = JSON.parse(data);
            obj.users.push(user);
            const json = JSON.stringify(obj);
            fs.writeFile('src/DB/userdata.json', json, (err) => {
                if (err) throw err;
            });
        }});
    } 
}
