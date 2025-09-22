import { describe, expect, it, vi } from 'vitest';
import { TrelloLocalDBSync } from '../utils/syncTrelloWithLocalDB.ts';

const trelloApiMock = {
  getLists: vi.fn().mockResolvedValue([
    { id: 'mockList', name: 'Mock Task List' },
  ]),
  getCards: vi.fn().mockResolvedValue([
    { id: 'mockCard1', name: 'Mock Task 1', desc: 'Updated Description 1', due: '2028-10-01' },
    { id: 'mockCard2', name: 'Mock Task 2', desc: 'Description 2', due: '2028-10-02' },
  ]),
};

const localDbMock = {
  getTasks: vi.fn().mockResolvedValue([
    { id: 'mockCard1', name: 'Mock Task 1', description: 'Description 1', dueDate: '2028-10-01' },
  ]),
  addTask: vi.fn(),
  updateTask: vi.fn(),
};

describe('TrelloSync', () => {
  it('mimic syncTrelloWithLocalDB() functionality', async () => {
    const trelloLocalDBSync = new TrelloLocalDBSync(trelloApiMock, localDbMock);
    const result = await trelloLocalDBSync.syncTrelloWithLocalDB('board1');

    expect(result.added).toHaveLength(1);
    expect(result.updated).toHaveLength(1);
    expect(result.skipped).toHaveLength(0);

    expect(localDbMock.addTask).toHaveBeenCalledWith({
      id: 'mockCard2',
      name: 'Mock Task 2',
      desc: 'Description 2',
      due: '2028-10-02',
    });

    expect(localDbMock.updateTask).toHaveBeenCalledWith({
      id: 'mockCard1',
      name: 'Mock Task 1',
      desc: 'Updated Description 1',
      due: '2028-10-01',
    });
  });
});
