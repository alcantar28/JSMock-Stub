import { beforeAll, describe, expect, it, vi } from 'vitest';
import {getBoardData, getMultipleLists} from '../test_data/trelloData.ts';
import APIHelper from '../utils/api/common.ts';
import { AxiosHeaders } from 'axios';
import { trelloConfig } from '../config/config.ts';

vi.mock('../src/utils/api/common.ts');

const apiHelper = new APIHelper();
let idBoardTrello: string;
let idNewList: string;
let idNewCard: string;

const responseData = {
    data: getBoardData as any,
    status: 200,
    statusText: 'OK',
    headers: new AxiosHeaders(),
    config: { headers: new AxiosHeaders() }
};

describe.skip('Testing Trello Stub mock', () => {
    
    beforeAll(async () => {
        expect(apiHelper.get).toBeCalledTimes(0);

        let response = await apiHelper.get(`https://api.trello.com/1/boards/${trelloConfig.trelloID}`);

        expect(apiHelper.get).toBeCalledTimes(1);
        expect(response).toBeUndefined();
    });

    it("Check that no lists exists", async () => {
        responseData.data = [];
        apiHelper.get.mockReturnValueOnce(responseData);
        let response = await apiHelper.get(`https://api.trello.com/1/boards/${idBoardTrello}/lists`);

        expect(response.status, "Response was not 200").toBe(200);
        expect(response.data).to.be.empty;
        expect(apiHelper.get).toBeCalledTimes(2);
    });

    it("Check that 2 lists exists", async () => {
        responseData.data = getMultipleLists;
        apiHelper.get.mockReturnValueOnce(responseData);
        let response = await apiHelper.get(`https://api.trello.com/1/boards/${idBoardTrello}/lists`);

        expect(response.status, "Response was not 200").toBe(200);
        expect(response.data).to.have.length(2);
        expect(response.data).to.deep.equals(getMultipleLists);
    });

    it("Creates a new list", async ()=> {
        responseData.data = {id:1}
        apiHelper.post.mockReturnValueOnce(responseData);
        let response = await apiHelper.post(`https://api.trello.com/1/lists`,
            {
                name: "NewList",
                idBoard: idBoardTrello
            }
        )
        idNewList = response.data.id;

        expect(response.status).toBe(200);
        expect(idNewList).to.be.equals(1);
    })

    it("Creates a new card", async ()=> {
        const innerApiHelper = new APIHelper();
        responseData.data = {id:2}
        apiHelper.post.mockReturnValueOnce(responseData);
        let response = await innerApiHelper.post(`https://api.trello.com/1/cards`,
            {
                idList: idNewList,
                name: "NewCard"
            }
        )
        idNewCard = response.data.id;
        
        expect(response.status).toBe(200);
        expect(idNewCard).to.be.equals(2);
        expect(APIHelper.mock.instances).toHaveLength(2);
    })
})
