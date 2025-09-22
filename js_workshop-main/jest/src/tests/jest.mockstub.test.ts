import { expect, jest, describe, beforeAll, it } from "@jest/globals";
import {getBoardData, getMultipleLists} from '../test_data/getBoardData.ts';
import APIHelper from '../utils/api/common.ts';
import { AxiosHeaders, AxiosResponse } from 'axios';
import { trelloConfig } from '../config/config.ts';

jest.mock('../../src/utils/api/common.ts');
const myApiMock = APIHelper as jest.MockedClass<typeof APIHelper>;

myApiMock.mockImplementation(() => ({
    get: jest.fn().mockImplementation(async (): Promise<AxiosResponse<any, any>> => {
        return new Promise<AxiosResponse<any, any>>(resolve => { 
            resolve({
                data: getBoardData,
                status: 200,
                statusText: 'OK',
                headers: new AxiosHeaders(),
                config: { headers: new AxiosHeaders() }
            })
        })
    }) as unknown as jest.MockedFunction<typeof APIHelper.prototype.get>,
    post: jest.fn().mockImplementation(() => {
        return new Promise<AxiosResponse<any, any>>(resolve => { 
            resolve({
                data: {id: "1"},
                status: 200,
                statusText: 'OK',
                headers: new AxiosHeaders(),
                config: { headers: new AxiosHeaders() }
            })
        })
    }) as unknown as jest.MockedFunction<typeof APIHelper.prototype.get>,
    put: jest.fn().mockImplementation(() => {}) as unknown as jest.MockedFunction<typeof APIHelper.prototype.get>
}))

let apiHelper = new APIHelper();
let idBoardTrello: string;
let idNewList: string;
let idNewCard: string;

describe.skip('Testing Trello Stub', () => {

    beforeAll(async () => {
        expect(apiHelper.get).toHaveBeenCalledTimes(0);
        let response = await apiHelper.get(`https://api.trello.com/1/boards/${trelloConfig.trelloID}`);
        expect(apiHelper.get).toHaveBeenCalledTimes(1);
        idBoardTrello = response.data.id;
        expect(response.data.id).toBe('abcde123');
    });

    it("Check that no lists exists", async () => {
        (apiHelper.get as jest.MockedFunction<typeof apiHelper.get>).mockRejectedValueOnce(new Error('API was called incorrectly!'));
        await expect(async () => {await apiHelper.get(`https://api.trello.com/1/boards/${idBoardTrello}/lists`)}).rejects.toThrow('API was called incorrectly!');
        expect(apiHelper.get).toHaveBeenCalledWith(`https://api.trello.com/1/boards/${idBoardTrello}/lists`);
        expect(apiHelper.get).toHaveBeenCalledTimes(2);
    });

    it("Check that 2 lists exists", async () => {
        (apiHelper.get as jest.Mock).mockReturnValueOnce({
            data: getMultipleLists,
            status: 200
        });
        let response = await apiHelper.get(`https://api.trello.com/1/boards/${idBoardTrello}/lists`);
        expect(response.status).toBe(200);
        expect(response.data).toHaveLength(2);
        expect(response.data).toEqual(getMultipleLists);
    });

    it("Creates a new list", async ()=> {
        (apiHelper.post as jest.Mock).mockReturnValueOnce({
            data: {id: "1"},
            status: 200
        });
        let response = await apiHelper.post(`https://api.trello.com/1/lists`, {
                name: "NewList",
                idBoard: idBoardTrello
            }
        )
        idNewList = response.data.id;
        expect(response.status).toBe(200);
        expect(idNewList).toEqual("1");
    })

    it("Creates a new card", async ()=> {
        (apiHelper.post as jest.Mock).mockReturnValueOnce({
            data: {id: "2"},
            status: 200
        });
        let response = await apiHelper.post(`https://api.trello.com/1/cards`, {
                idList: idNewList,
                name: "NewCard"
            }
        )
        idNewCard = response.data.id;
        expect(response.status).toBe(200);
        expect(idNewCard).toEqual("2");
    })
})
