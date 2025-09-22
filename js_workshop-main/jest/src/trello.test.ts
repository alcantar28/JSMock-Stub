import APIHelper from './utils/api/common.ts';
import { beforeAll, describe, expect, it } from '@jest/globals';
import { trelloConfig } from './config/config.ts';

const apiHelper = new APIHelper();

let idBoardTrello: string;
let idNewList: string;
let idNewCard: string;

describe.skip('Testing Trello', () => {
  beforeAll(async () => {
    let response = await apiHelper.get(`https://api.trello.com/1/boards/${trelloConfig.trelloID}`);
    idBoardTrello = response.data.id;
  });

  it("Check that no lists exists", async () => {
    let response = await apiHelper.get(`https://api.trello.com/1/boards/${idBoardTrello}/lists`);
    expect(response.status).toBe(200);
    expect(response.data).toStrictEqual([]);
  });

  it("Creates a new list", async ()=> {
    let response = await apiHelper.post(`https://api.trello.com/1/lists`,
        {
          name: "NewList",
          idBoard: idBoardTrello
        }
    )
    idNewList = response.data.id;
    expect(response.status).toBe(200);
    expect(idNewList).not.toBeUndefined;
  })

  it("Creates a new card", async ()=> {
    let response = await apiHelper.post(`https://api.trello.com/1/cards`,
      {
        idList: idNewList,
        name: "NewCard"
      }
    )
    idNewCard = response.data.id;
    expect(response.status).toBe(200);
    expect(idNewList).not.toBeUndefined;
  })

  it("Archive the new list", async ()=> {
    let response = await apiHelper.put(idNewList)
    expect(response.status).toBe(200);
  })
  
})
