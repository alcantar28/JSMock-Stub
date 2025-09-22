import { beforeAll, describe, expect, it, MockInstance, vi } from 'vitest';
import { MockFunctions } from '../utils/helpers/common.ts';
import { TaskWorkflowFunc } from '../utils/taskManagingWorkflow.ts';
import axios from 'axios';

const taskWorkflowFunc = new TaskWorkflowFunc();
let spy: MockInstance;

describe.skip('Mocking complex functions', async () => {

    beforeAll(async () => {

        spy = vi.spyOn(taskWorkflowFunc, 'fetchIncompleteTasksFromDB')
            .mockImplementation(async () => {
                // Simulate a database query
            return [
                { id: 1, title: 'Task 1', description: 'Description for Task 1' },
                { id: 2, title: 'Task 2', description: 'Description for Task 2' }
            ];
        })
        spy = vi.spyOn(taskWorkflowFunc, 'createTrelloCard')
            .mockImplementation(async () => {
                return {id: 'card1', url: 'https://trello.com/c/card1'};
            })
        spy = vi.spyOn(taskWorkflowFunc, 'updateTaskWithTrelloCardID')
            .mockImplementation(async () => {
                return true;
            })
    })

    it('Try to mimic manageProjectTasks() functionality', async () => {
        let result = await taskWorkflowFunc.manageProjectTasks();

        expect(taskWorkflowFunc.fetchIncompleteTasksFromDB).toHaveBeenCalled();
        expect(taskWorkflowFunc.createTrelloCard).toHaveBeenCalled();
        expect(taskWorkflowFunc.updateTaskWithTrelloCardID).toHaveBeenCalled();
        expect(result).to.deep.equals({
            tasksProcessed: 2,
            trelloLinks: ['https://trello.com/c/card1', 'https://trello.com/c/card1'],
        })
    });

    it('Try to check on API being called within reportToDB', async () => {
        const mockFunctions = new MockFunctions();

        //Return the original implementation of the function being spied/mocked
        spy.mockRestore();

        spy = vi.spyOn(axios, 'get').mockReturnValue(Promise.resolve({data: [{id: 1}]}));
        vi.spyOn(axios, 'post').mockReturnValue(Promise.resolve({}));

        let result = await mockFunctions.reportToDB();

        expect(result).toHaveProperty('reportId');
        expect(result).toHaveProperty('results');
        expect(result.reportId).toBeTypeOf('number');
        expect(result.results).toBeTypeOf('number');
    });
})