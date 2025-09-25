import { describe, expect, it, vi } from 'vitest';
import { TrelloLocalDBSync } from '../utils/syncTrelloWithLocalDB.ts';
import { trelloList, trelloCards, trelloTask } from '../test_data/trelloData.ts';

const boardId = 'board1';

const trelloApiMock = {
  getLists: vi.fn().mockResolvedValue(trelloList),
  getCards: vi.fn().mockResolvedValue(trelloCards),
};

const localDbMock = {
  getTasks: vi.fn().mockResolvedValue(trelloTask),
  addTask: vi.fn(),
  updateTask: vi.fn(),
};

describe('TrelloSync', () => {
  it('should mimic syncTrelloWithLocalDB() functionality', async () => {
    const trelloLocalDBSync = new TrelloLocalDBSync(trelloApiMock, localDbMock);
    const result = await trelloLocalDBSync.syncTrelloWithLocalDB(boardId);

    expect(result.added).toHaveLength(1);
    expect(result.updated).toHaveLength(1);
    expect(result.skipped).toHaveLength(0);
    expect(localDbMock.addTask).toHaveBeenCalledWith(trelloCards[1]);
    expect(localDbMock.updateTask).toHaveBeenCalledWith(trelloCards[0]);
  });
});
