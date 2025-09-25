import { describe, it, expect, vi, afterAll, MockInstance } from 'vitest';
import { WeeklyReportGenerator } from '../utils/weeklyReportGenerator.ts';
import { MockFunctions } from '../utils/helpers/common.ts';
import { getBoardData, trelloTask, trelloApiResponse, trelloCompileReportData } from '../test_data/trelloData.ts';
import { trelloConfig } from '../config/config.ts';
import APIHelper from '../utils/api/common.ts';

vi.mock('../utils/api/common.ts');

let spy: MockInstance;
let report: any;
const apiHelper = new APIHelper();
const weeklyReportGenerator = new WeeklyReportGenerator('MockDB', trelloConfig.trelloApiKey, trelloConfig.trelloToken, "http://localhost");
const mockFunctions = new MockFunctions();

describe('WeeklyReportGenerator', () => {
  afterAll(async () => {
      //Make the object being spied/mocked to have empty implementations
      spy.mockReset();
  });

  const mockDb = {
    query: vi.fn(),
  };

  const mockTasks = [{ id: 1, trello_card_id: 'card1', completed_at: '2023-10-01T00:00:00Z' }];

  it('should fetch completed tasks from the database', async () => {
    spy = vi.spyOn(weeklyReportGenerator, 'fetchCompletedTasks').mockImplementation(async () => {
      const currentDate = new Date();
      const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
      const endOfWeek = new Date(currentDate.setDate(startOfWeek.getDate() + 6));

      await mockFunctions
        .queryDatabase(mockFunctions.getDatabaseConnection(), 
        'SELECT * FROM completed_tasks WHERE completed_at BETWEEN ? AND ?', 
        {completed_at_start: startOfWeek.toISOString(), 
          completed_at_end: endOfWeek.toISOString()});
      return trelloTask;
    })

    mockDb.query.mockResolvedValue(trelloTask);

    const tasks = await weeklyReportGenerator.fetchCompletedTasks();
    expect(tasks).toEqual(trelloTask);
    expect(weeklyReportGenerator.fetchCompletedTasks).toHaveBeenCalled();
  });

  it('should fetch Trello card details', async () => {
    const responseData = trelloApiResponse;
    
    spy = vi.spyOn(weeklyReportGenerator, 'fetchTrelloCardDetails').mockImplementation(async () => {
      let idBoardTrello = 1;

      vi.spyOn(apiHelper, 'get').mockResolvedValue(responseData);
      return await apiHelper.get(`https://api.trello.com/1/boards/${idBoardTrello}/lists`);
    });
    
    let response = await weeklyReportGenerator.fetchTrelloCardDetails(1);
    expect(apiHelper.get).toBeCalledTimes(1);
    expect(weeklyReportGenerator.fetchTrelloCardDetails).toHaveBeenCalled();
    expect(response.status, "Response was not 200").toBe(200);
    expect(response.data).to.be.not.empty;
    expect(response.data).toEqual(getBoardData);
  });

  it('should compile a report', async () => {
    spy = vi.spyOn(weeklyReportGenerator, 'compileReport').mockReturnValue(Promise.resolve(trelloCompileReportData));

    report = await weeklyReportGenerator.compileReport(mockTasks);
    expect(report.trelloTeamStats).to.be.empty;
    expect(report.trelloTaskSummaries).toHaveLength(1);
    expect(report.trelloBlockedItems).toHaveLength(1);
  });

  it('should send the report to the external API', async () => {
    spy = vi.spyOn(weeklyReportGenerator, 'sendReport').mockReturnValue(Promise.resolve(true));
    const response = await weeklyReportGenerator.sendReport(report);

    expect(weeklyReportGenerator.sendReport).toHaveBeenCalledWith(report);
    expect(response).toBe(true);
  });
});