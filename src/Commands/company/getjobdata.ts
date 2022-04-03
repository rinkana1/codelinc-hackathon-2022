import { Command } from '../../Interfaces';
import * as jobdata from '../../DB/jobdata.json'

export const command: Command = {
    name: 'getjobdata',
    run: async(args) => {

        return jobdata.jobs.filter((obj) => {
            let something = false;
            args.forEach((tag) => {
                something = obj.tags.includes(tag);
            })
            return something
        })


    }
}