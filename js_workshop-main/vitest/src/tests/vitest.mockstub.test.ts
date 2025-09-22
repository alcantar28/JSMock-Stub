import { beforeAll, describe, expect, it, vi } from 'vitest';
import {getBoardData, getMultipleLists} from '../test_data/getBoardData.ts';
import APIHelper from '../utils/api/common.ts';
import { AxiosHeaders } from 'axios';
import { trelloConfig } from '../config/config.ts';

vi.mock('../src/utils/api/common.ts', () => {
    return {
        default: vi.fn().mockImplementation(() =>{
            return {
                get: vi.fn().mockReturnValue({
                    data: getBoardData as any,
                    status: 200,
                    statusText: 'OK',
                    headers: new AxiosHeaders(),
                    config: { headers: new AxiosHeaders() }
                }),
                post: vi.fn().mockReturnValue({
                    data: {id: 1},
                    status: 200,
                    statusText: 'OK',
                    headers: new AxiosHeaders(),
                    config: { headers: new AxiosHeaders() }
                }),
            }
        })
    }
});

const apiHelper = new APIHelper();
let idBoardTrello: string;
let idNewList: string;
let idNewCard: string;

describe.skip('Testing Trello Stub', () => {

    beforeAll(async () => {
        expect(apiHelper.get).toBeCalledTimes(0);

        let response = await apiHelper.get(`https://api.trello.com/1/boards/${trelloConfig.trelloID}`);
        idBoardTrello = response.data.id;

        expect(apiHelper.get).toBeCalledTimes(1);
        expect(response.data.id).toBe('abcde123');
    });

    it("Check that no lists exists", async () => {
        apiHelper.get.mockRejectedValue(new Error('API was called incorrectly!'));

        await expect(async () => {await apiHelper.get(`https://api.trello.com/1/boards/${idBoardTrello}/lists`)}).rejects.toThrowError('API was called incorrectly!');
        expect(apiHelper.get).toBeCalledWith(`https://api.trello.com/1/boards/${idBoardTrello}/lists`);
        expect(apiHelper.get).toBeCalledTimes(2);
    });

    it("Check that 2 lists exists", async () => {
        apiHelper.get.mockReturnValueOnce({
            data: getMultipleLists,
            status: 200
        });
        let response = await apiHelper.get(`https://api.trello.com/1/boards/${idBoardTrello}/lists`);
        
        expect(response.status, "Response was not 200").toBe(200);
        expect(response.data).to.have.length(2);
        expect(response.data).to.deep.equals(getMultipleLists);
    });

    it("Creates a new list", async ()=> {
        apiHelper.post.mockReturnValueOnce({
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
        expect(idNewList).to.be.equals("1");
    })

    it("Creates a new card", async ()=> {
        apiHelper.post.mockReturnValueOnce({
            data: {id: "2"},
            status: 200
        });
        let response = await apiHelper.post(`https://api.trello.com/1/cards`,
            {
                idList: idNewList,
                name: "NewCard"
            }
        )
        idNewCard = response.data.id;
        
        expect(response.status).toBe(200);
        expect(idNewCard).to.be.equals("2");
    })
})
