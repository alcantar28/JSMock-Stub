import { expect, jest, describe, beforeAll, it } from "@jest/globals";
import { getMultipleLists } from '../test_data/getBoardData.ts';
import APIHelper from '../utils/api/common.ts';
import { AxiosHeaders, AxiosResponse } from 'axios';
import { trelloConfig } from '../config/config.ts';

jest.mock('../../src/utils/api/common.ts');

const apiHelper = new APIHelper();
let idBoardTrello: string;
let idNewList: string;
let idNewCard: string;

describe.skip('Testing Trello Stub mock', () => {

    beforeAll(async () => {
        expect(apiHelper.get).toHaveBeenCalledTimes(0);
        let response = await apiHelper.get(`https://api.trello.com/1/boards/${trelloConfig.trelloID}`);
        idBoardTrello = "1";
        expect(apiHelper.get).toHaveBeenCalledTimes(1);
        expect(response).toBeUndefined();
    });

    it("Check that no lists exists", async () => {
        (apiHelper as jest.Mocked<typeof apiHelper>).get.mockReturnValueOnce(new Promise<AxiosResponse<any, any>>(resolve => { 
            resolve({
                data: [],
                status: 200,
                statusText: 'OK',
                headers: new AxiosHeaders(),
                config: { headers: new AxiosHeaders() }
            })
        }));
        let response = await apiHelper.get(`https://api.trello.com/1/boards/${idBoardTrello}/lists`);
        expect(response.status).toBe(200);
        expect(response.data).toEqual([]);
        expect(apiHelper.get).toHaveBeenCalledTimes(2);
    });

    it("Check that 2 lists exists", async () => {
        (apiHelper as jest.Mocked<typeof apiHelper>).get.mockReturnValueOnce(new Promise<AxiosResponse<any, any>>(resolve => { 
            resolve({
                data: getMultipleLists,
                status: 200,
                statusText: 'OK',
                headers: new AxiosHeaders(),
                config: { headers: new AxiosHeaders() }
            })
        }));
        let response = await apiHelper.get(`https://api.trello.com/1/boards/${idBoardTrello}/lists`);
        expect(response.status).toBe(200);
        expect(response.data).toHaveLength(2);
        expect(response.data).toBe(getMultipleLists);
    });

    it("Creates a new list", async ()=> {
        (apiHelper as jest.Mocked<typeof apiHelper>).post.mockReturnValueOnce(new Promise<AxiosResponse<any, any>>(resolve => { 
            resolve({
                data: {id: "1"},
                status: 200,
                statusText: 'OK',
                headers: new AxiosHeaders(),
                config: { headers: new AxiosHeaders() }
            })
        }));
        let response = await apiHelper.post(`https://api.trello.com/1/lists`, {
                name: "NewList",
                idBoard: idBoardTrello
            }
        )
        idNewList = response.data.id;
        expect(response.status).toBe(200);
        expect(idNewList).toBe("1");
    })

    it("Creates a new card", async ()=> {
        const innerApiHelper = new APIHelper();
        (innerApiHelper as jest.Mocked<typeof innerApiHelper>).post.mockReturnValueOnce(new Promise<AxiosResponse<any, any>>(resolve => { 
            resolve({
                data: {id: "2"},
                status: 200,
                statusText: 'OK',
                headers: new AxiosHeaders(),
                config: { headers: new AxiosHeaders() }
            })
        }));
        let response = await innerApiHelper.post(`https://api.trello.com/1/cards`, {
                idList: idNewList,
                name: "NewCard"
            }
        )
        idNewCard = response.data.id;
        expect(response.status).toBe(200);
        expect(idNewCard).toBe("2");
        expect((APIHelper as jest.Mock).mock.instances).toHaveLength(2);
    })
})
