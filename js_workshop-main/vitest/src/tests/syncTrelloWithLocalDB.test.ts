import { describe, expect, it, vi } from 'vitest';
import { TrelloLocalDBSync } from '../utils/syncTrelloWithLocalDB.ts';

const trelloApiMock = {
  getLists: vi.fn().mockResolvedValue([
    { id: 'list1', name: 'Task List 1' },
  ]),
  getCards: vi.fn().mockResolvedValue([
    { id: 'card1', name: 'Task 1', desc: 'Updated Description', due: '2023-10-01' },
    { id: 'card2', name: 'Task 2', desc: 'Description 2', due: '2023-10-02' },
  ]),
};

const localDbMock = {
  getTasks: vi.fn().mockResolvedValue([
    { id: 'card1', name: 'Task 1', description: 'Description 1', dueDate: '2023-10-01' },
  ]),
  addTask: vi.fn(),
  updateTask: vi.fn(),
};

describe('TrelloSync', () => {
  it('mimic syncTrelloWithLocalDB() functionality', async () => {
    const trelloLocalDBSync = new TrelloLocalDBSync(trelloApiMock, localDbMock);
    const result = await trelloLocalDBSync.syncTrelloWithLocalDB('board123');

    expect(result.added).toHaveLength(1);
    expect(result.updated).toHaveLength(1);
    expect(result.skipped).toHaveLength(0);

    expect(localDbMock.addTask).toHaveBeenCalledWith({
      id: 'card2',
      name: 'Task 2',
      desc: 'Description 2',
      due: '2023-10-02',
    });

    expect(localDbMock.updateTask).toHaveBeenCalledWith({
      id: 'card1',
      name: 'Task 1',
      desc: 'Updated Description',
      due: '2023-10-01',
    });
  });
});
