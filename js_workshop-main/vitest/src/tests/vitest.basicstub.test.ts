import { beforeAll, describe, expect, it, MockInstance, vi } from 'vitest';
import {getBoardData, getMultipleLists} from '../test_data/getBoardData.ts';
import APIHelper from '../utils/api/common.ts';
import { AxiosError, AxiosHeaders } from 'axios';
import { trelloConfig } from '../config/config.ts';

const apiHelper = new APIHelper();
let spyGetMethod: MockInstance;
let spyPostMethod: MockInstance;
let idBoardTrello: string;
let idNewList: string;
let idNewCard: string;

const stubResponseData = {
    data: getBoardData as any,
    status: 200,
    statusText: 'OK',
    headers: new AxiosHeaders(),
    config: { headers: new AxiosHeaders() }
};

describe.skip('Using Stubs with Trello APIs', () => {

    beforeAll(async () => {
        spyGetMethod = vi.spyOn(apiHelper, 'get').mockResolvedValue(stubResponseData);
        let response = await apiHelper.get(`https://api.trello.com/1/boards/${trelloConfig.trelloID}`);
        idBoardTrello = response.data.id;
        expect(response.data.id).toBe('abcde123');
    });

    it("Check that no lists exists", async () => {
        stubResponseData.data = []
        spyGetMethod.mockResolvedValueOnce(stubResponseData);
        let response = await apiHelper.get(`https://api.trello.com/1/boards/${idBoardTrello}/lists`);
        expect(response.status, "Response was not 200").toBe(200);
        expect(apiHelper.get).toHaveBeenCalledTimes(2);
        expect(response.data).to.be.empty;
    });

    it("Check that 2 lists exists", async () => {
        spyGetMethod.mockReset();
        stubResponseData.data = getMultipleLists;
        spyGetMethod.mockResolvedValueOnce(stubResponseData);
        let response = await apiHelper.get(`https://api.trello.com/1/boards/${idBoardTrello}/lists`);

        expect(response.status, "Response was not 200").toBe(200);
        expect(response.data).to.have.length(2);
        expect(response.data).to.deep.equals(getMultipleLists);
        expect(apiHelper.get).toHaveBeenCalledTimes(1);

        spyGetMethod.mockRestore();

        await expect(async () => {await apiHelper.get(`https://api.trello.com/1/boards/${idBoardTrello}/lists`)}).rejects.toThrowError(AxiosError);
        expect(apiHelper.get).not.toBe(spyGetMethod);
    });

    it("Creates a new list", async ()=> {
        stubResponseData.data = {id: "1"}
        spyPostMethod = vi.spyOn(apiHelper, 'post').mockResolvedValueOnce(stubResponseData);
        let response = await apiHelper.post(`https://api.trello.com/1/lists`,
            {
                name: "NewList",
                idBoard: idBoardTrello
            }
        )
        idNewList = response.data.id;

        expect(response.status).toBe(200);
        expect(idNewList).to.be.equals("1");
        expect(spyPostMethod).toHaveBeenCalledWith('https://api.trello.com/1/lists',{
            name: "NewList",
            idBoard: idBoardTrello
        })
    })

    it("Creates a new card", async ()=> {
        stubResponseData.data = {id: "2"}
        spyPostMethod = vi.spyOn(apiHelper, 'post').mockResolvedValueOnce(stubResponseData);
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
