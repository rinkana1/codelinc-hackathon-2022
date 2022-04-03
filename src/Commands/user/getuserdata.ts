import { Command } from '../../Interfaces';
import * as userdata from '../../DB/userdata.json'

export const command: Command = {
    name: 'getuserdata',
    run: async(args) => {
        let user: any;

        let id = parseInt(args[0]);

        for (let i = 0; i < userdata.users.length; i++) {
            if (userdata.users[i].id === id) {
                user = JSON.stringify(userdata.users[i]);
                break;
            }
        }
        
        return user;
    }
}