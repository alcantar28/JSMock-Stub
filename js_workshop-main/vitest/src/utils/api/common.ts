import axios, { AxiosResponse } from 'axios';
import { trelloConfig } from '../../config/config.ts';

export default class APIHelper{
    async get(url: string){
        return await axios.get(`${url}?key=${trelloConfig.apiKey}&token=${trelloConfig.apiToken}`);
    }

    async post(url: string, payload: any){
        let response;
        try {
            response = await axios.post(`${url}?key=${trelloConfig.apiKey}&token=${trelloConfig.apiToken}`,  
                {
                    ...payload
                },
            )
        } catch(err){
            throw new Error(`ERROR in POST: ${err} ${url} -- ${JSON.stringify(payload)}`);
        }
        return response;
    }

    async put(idNewList: string){
        let response;
        try{
            response = await axios.put(`https://api.trello.com/1/lists/${idNewList}/closed?key=${trelloConfig.apiKey}&token=${trelloConfig.apiToken}`, 
                {
                    value: true
                }
            )
        } catch(err){
            throw new Error(`ERROR in PUT: ${err}`);
        }
        return response;
    }

    generateReport(cards: any) {
        const report = cards.map((card: any) => ({
            id: card.id,
            name: card.name,
            description: card.desc,
            dateLastActivity: card.dateLastActivity,
        }));
        return report;
    }
}